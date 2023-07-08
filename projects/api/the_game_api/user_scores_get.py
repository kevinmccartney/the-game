import traceback as _traceback
import re as _re
import functools as _functools
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

_headers = {"Access-Control-Allow-Origin": "*"}


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

        _verify_id_token(id_token=id_token)
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
        pattern = _re.compile(r"^\/v1\/users\/(.*)\/scores$")
        request_path = request.headers.get("x-envoy-original-path")
        subject_uid = pattern.sub(r"\1", request_path)

        points_ref = _db.collection("points")
        points_query_ref = points_ref.where(
            filter=_FieldFilter(field_path="subject", op_string="==", value=subject_uid)
        )

        points_results = points_query_ref.get()
        points_docs = [doc.to_dict() for doc in points_results]

        if len(points_docs) != 0:
            points_docs_points = [doc["points"] for doc in points_docs]
            points_total = _functools.reduce(lambda a, b: a + b, points_docs_points)

            return _Response(_json.dumps({"data": points_total}), 200, _headers)
        else:
            return ({"data": 0}, 200, _headers)
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps({"code": 500, "message": "Internal server error"}),
            500,
            _headers,
        )