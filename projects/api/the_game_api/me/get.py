# TODO: how much can be abstracted out here?
import traceback as _traceback

import os as _os
import json as _json

import functions_framework as _functions_framework
from flask import Request as _Request, Response as _Response

import firebase_admin as _firebase_admin
from google.cloud.logging import Client as _LoggingClient

from firebase_admin.firestore import client as _firestore_client
from google.cloud.firestore import Client as _FirestoreClient
from firebase_admin.auth import (
    InvalidIdTokenError as _InvalidIdTokenError,
    ExpiredIdTokenError as _ExpiredIdTokenError,
    RevokedIdTokenError as _RevokedIdTokenError,
    UserDisabledError as _UserDisabledError,
    verify_id_token as _verify_id_token,
)

from google.cloud.firestore_v1.base_query import FieldFilter as _FieldFilter

_env = _os.environ.get("THE_GAME_ENV", "")

# we don't want to initialize the app and do want to log to stdout/stderr when running
# the API dev server
if _env != "local":
    _logging_client = _LoggingClient()
    _logging_client.setup_logging()
    _firebase_admin.initialize_app()

import logging as _logging

_db: _FirestoreClient = _firestore_client()

_headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
}


@_functions_framework.http
def function_handler(request: _Request):
    """HTTP ping Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        User Notifications
    """
    try:
        id_token = request.headers.get("x_forwarded_authorization").replace(
            "Bearer ", ""
        )

        token_data = _verify_id_token(id_token=id_token)
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
        subject_uid = token_data.get("user_id", "")

        users_ref = _db.collection("users")
        users_query_ref = users_ref.where(
            filter=_FieldFilter(field_path="uid", op_string="==", value=subject_uid)
        )

        users_results = users_query_ref.get()
        user_docs = [doc.to_dict() for doc in users_results]

        for doc in user_docs:
            del doc["display_name_normalized"]

        return _Response(_json.dumps({"data": user_docs[0]}), 200, _headers)

    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps({"code": 500, "message": "Internal server error"}),
            500,
            _headers,
        )1
    
