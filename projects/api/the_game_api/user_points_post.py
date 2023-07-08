# TODO: how much can be abstracted out here?
from uuid import uuid4 as _uuid4
from datetime import datetime as _datetime
import traceback as _traceback
import re as _re
import os as _os
import json as _json
from urllib.parse import urlparse as _urlparse

import functions_framework as _functions_framework
from firebase_admin import initialize_app as _initialize_app

from firebase_admin.auth import verify_id_token as _verify_id_token
from firebase_admin.firestore import client as _firestore_client
from firebase_admin.auth import (
    InvalidIdTokenError as _InvalidIdTokenError,
    ExpiredIdTokenError as _ExpiredIdTokenError,
    RevokedIdTokenError as _RevokedIdTokenError,
    UserDisabledError as _UserDisabledError,
)
from google.cloud.firestore import Client as _FirestoreClient
from werkzeug.exceptions import BadRequest as _BadRequest
from google.cloud.logging import Client as _LoggingClient
from flask import Response as _Response, Request as _Request

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
        Pong.
    """
    # TODO: validate request
    id_token = ""
    user = {}

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
        request_path = request.headers.get("x-envoy-original-path")
        parsed_url = _urlparse(request_path)
        pattern = _re.compile(r"^\/v1\/users\/(.*)/points$")

        subject_uid = pattern.sub(r"\1", parsed_url.path)
        request_json = request.get_json(force=True)

        doc = {
            "created_by": user["uid"],
            # TODO: is there a better way to do this?
            "created_time": f"{_datetime.utcnow().isoformat()}Z",
            "subject": subject_uid,
            "reason": request_json["reason"],
            "points": request_json["points"],
        }

        _db.collection("points").document(str(_uuid4())).set(doc)
    except _BadRequest as ex:
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
    except Exception:
        _logging.error(_traceback.format_exc())
        return ({"code": 500, "message": "Internal server error"}, 500, _headers)

    return _Response(status=201, headers=_headers)
