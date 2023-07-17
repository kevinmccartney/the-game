# TODO: how much can be abstracted out here?
from typing import Union as _Union, List as _List
import traceback as _traceback
import os as _os
import json as _json

import functions_framework as _functions_framework
from firebase_admin import initialize_app as _initialize_app
from pydantic import BaseModel, ValidationError as _ValidationError
from firebase_admin.auth import verify_id_token as _verify_id_token
from firebase_admin.firestore import client as _firestore_client
from firebase_admin.auth import (
    InvalidIdTokenError as _InvalidIdTokenError,
    ExpiredIdTokenError as _ExpiredIdTokenError,
    RevokedIdTokenError as _RevokedIdTokenError,
    UserDisabledError as _UserDisabledError,
)
from google.cloud.firestore import (
    Client as _FirestoreClient,
    DocumentSnapshot as _DocumentSnapshot,
)
from werkzeug.exceptions import BadRequest as _BadRequest
from google.cloud.logging import Client as _LoggingClient
from flask import Response as _Response, Request as _Request
from google.cloud.firestore_v1.base_query import FieldFilter as _FieldFilter

_env = _os.environ.get("THE_GAME_ENV", "")

# we don't want to initialize the app and do want to log to stdout/stderr when running
# the API dev server
if _env != "local":
    _logging_client = _LoggingClient()
    _logging_client.setup_logging()
    _initialize_app()

import logging as _logging

_db: _FirestoreClient = _firestore_client()

_headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
}


class MePatchRequestBody(BaseModel):
    about_me: _Union[str, None]
    dislikes: _List[str]
    display_name: str
    email: str
    likes: _List[str]
    location: _Union[str, None]
    phone_number: _Union[str, None]
    photo_url: _Union[str, None]
    username: str


@_functions_framework.http
def function_handler(request: _Request):
    """HTTP ping Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        Pong.
    """
    try:
        id_token = request.headers.get("x_forwarded_authorization").replace(
            "Bearer ", ""
        )

        user = _verify_id_token(id_token=id_token)
    except AttributeError as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps(
                {"code": 401, "message": "Unauthorized: Authorization not provided"}
            ),
            401,
            _headers,
        )
    except (
        _InvalidIdTokenError,
        _ExpiredIdTokenError,
        _RevokedIdTokenError,
        _UserDisabledError,
    ) as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps(
                {
                    "code": 403,
                    "message": "Forbidden: Caller is not authorized to take this action",
                }
            ),
            403,
            _headers,
        )
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps({"code": 500, "message": "Internal server error"}),
            500,
            _headers,
        )

    try:
        subject_uid = user.get("uid", "")
        request_json = request.get_json(force=True)

        try:
            request_body = MePatchRequestBody(
                about_me=request_json.get("about_me"),
                dislikes=request_json.get("dislikes"),
                display_name=request_json.get("display_name"),
                email=request_json.get("email"),
                likes=request_json.get("likes"),
                location=request_json.get("location"),
                phone_number=request_json.get("phone_number"),
                photo_url=request_json.get("photo_url"),
                username=request_json.get("username"),
            )
        except _ValidationError as ex:
            print(ex)
            errors = ex.errors()

            message = ""

            for error in errors:
                field = error["loc"][0]
                err_message = error["msg"]

                message = f"{message}| {field}: {err_message} "

            raise _BadRequest(description=message)

        user_query = (
            _db.collection("users")
            .where(filter=_FieldFilter("uid", "==", subject_uid))
            .get()
        )
        user_record: _DocumentSnapshot = user_query[0]

        _db.collection("users").document(user_record.id).update(
            field_updates=request_body.model_dump()
        )
    except _BadRequest as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps(
                {
                    "code": 400,
                    "message": "Bad Request: Please double check API documentation to make sure you are passing the correct options",
                    "details": ex.description,
                }
            ),
            400,
            _headers,
        )
    except KeyError as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps(
                {
                    "code": 400,
                    "message": "Bad Request: Please double check API documentation to make sure you are passing the correct options",
                }
            ),
            400,
            _headers,
        )
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return ({"code": 500, "message": "Internal server error"}, 500, _headers)

    return _Response(status=201, headers=_headers)
