# TODO: how much can be abstracted out here?
import traceback as _traceback
import re as _re
import os as _os
import json as _json
from urllib.parse import urlparse as _urlparse

import functions_framework as _functions_framework
from flask import Request as _Request, Response as _Response
from firebase_admin import initialize_app as _initialize_app
from firebase_admin.firestore import client as _firestore_client
from google.cloud.logging import Client as _LoggingClient
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
    _initialize_app()

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
        A User object.
    """
    try:
        id_token = request.headers.get("x_forwarded_authorization").replace(
            "Bearer ", ""
        )

        _verify_id_token(id_token=id_token)

        request_path = request.headers.get("x-envoy-original-path")
        parsed_url = _urlparse(request_path)
        pattern = _re.compile(r"^\/v1\/users\/(.*)$")

        subject_uid = pattern.sub(r"\1", parsed_url.path)

        users_ref = _db.collection("users")
        users_query_ref = users_ref.where(
            filter=_FieldFilter(field_path="uid", op_string="==", value=subject_uid)
        )

        users_results = users_query_ref.get()

        if len(users_results) == 0:
            return _Response(
                _json.dumps(
                    {"code": 404, "message": "Not found: Resource can not be located"}
                ),
                404,
                _headers,
            )

        created_by_user = users_results[0].to_dict()

        return _Response(_json.dumps(created_by_user), 200, _headers)

    except AttributeError as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            {"code": 401, "message": "Unauthorized: Authorization not provided"},
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
        return ({"code": 500, "message": "Internal server error"}, 500, _headers)
