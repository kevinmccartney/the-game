# TODO: how much can be abstracted out here?
import traceback as _traceback
import os as _os
import json as _json

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
        name_param = None

        _verify_id_token(id_token=id_token)

        params = request.args.to_dict()

        try:
            name_param_value = params["name"]
            name_param = name_param_value.lower()
        except KeyError:
            pass

        users_ref = _db.collection("users")

        if name_param:
            name_len = len(name_param)
            name_front_code = name_param[0 : name_len - 1]
            name_end_code = name_param[name_len - 1 : name_len]

            start_code = name_param
            end_code = name_front_code + chr(ord(name_end_code) + 1)

            users_query_ref = users_ref.where(
                filter=_FieldFilter(
                    field_path="display_name_normalized",
                    op_string=">=",
                    value=start_code,
                )
            ).where(
                filter=_FieldFilter(
                    field_path="display_name_normalized", op_string="<", value=end_code
                )
            )

            users_results = users_query_ref.get()

            users = [doc.to_dict() for doc in users_results]

            return _Response(_json.dumps({"data": users}), 200, _headers)

        users_results = users_ref.get()

        users = [doc.to_dict() for doc in users_results]

        return _Response(_json.dumps({"data": users}), 200, _headers)

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
