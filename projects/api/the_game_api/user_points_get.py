# TODO: how much can be abstracted out here?
import traceback as _traceback
import re as _re
import json as _json
import os as _os
from urllib.parse import urlparse as _urlparse

import functions_framework as _functions_framework
from flask import (
    Request as _Request,
    Response as _Response,
)
from firebase_admin import initialize_app as _initialize_app
from google.cloud.logging import Client as _LoggingClient
from google.cloud.firestore import (
    Client as _FirestoreClient,
)
from firebase_admin.firestore import client as _firestore_client
from firebase_admin.auth import (
    InvalidIdTokenError as _InvalidIdTokenError,
    ExpiredIdTokenError as _ExpiredIdTokenError,
    RevokedIdTokenError as _RevokedIdTokenError,
    UserDisabledError as _UserDisabledError,
    verify_id_token as _verify_id_token,
)
from google.cloud.firestore_v1.base_query import FieldFilter as _FieldFilter, Or as _Or

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
def function_handler(request: _Request) -> _Response:
    """HTTP ping Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        Pong.
    """
    try:
        id_token = request.headers.get("x-forwarded-authorization").replace(
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
                },
            ),
            403,
            _headers,
        )
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
        return _Response(
            _json.dumps(
                {"code": 500, "message": "Internal server error"}, 500, _headers
            )
        )

    try:
        request_path = request.headers.get("x-envoy-original-path")
        parsed_url = _urlparse(request_path)
        pattern = _re.compile(r"^\/v1\/users\/(.*)/points$")

        subject_uid = pattern.sub(r"\1", parsed_url.path)

        type_param = "all"

        # error if we don't pass in args?
        params = request.args.to_dict()

        try:
            type_param_value = params["type"]
            type_param = type_param_value.lower()
        except KeyError:
            pass

        points_ref = _db.collection("points")
        users_ref = _db.collection("users")
        points_query_ref = None

        if type_param == "all":
            filter_1 = _FieldFilter("subject", "==", subject_uid)
            filter_2 = _FieldFilter("created_by", "==", subject_uid)

            # Create the union filter of the two filters (queries)
            or_filter = _Or(filters=[filter_1, filter_2])

            points_query_ref = points_ref.where(filter=or_filter)
        elif type_param == "sent":
            filter = _FieldFilter("created_by", "==", subject_uid)

            points_query_ref = points_ref.where(filter=filter)
        elif type_param == "received":
            filter = _FieldFilter("subject", "==", subject_uid)

            points_query_ref = points_ref.where(filter=filter)

        points_results = points_query_ref.get()

        points_docs = [doc.to_dict() | {"id": doc.id} for doc in points_results]

        if len(points_docs) == 0:
            return _Response(
                _json.dumps(
                    {"data": []},
                ),
                200,
                _headers,
            )

        points = []
        uids = []
        users = {}

        for doc in points_docs:
            uids.append(doc["subject"])
            uids.append(doc["created_by"])

        uids = list(set(uids))

        filters = [_FieldFilter("uid", "==", uid) for uid in uids]
        or_filter = _Or(filters=filters)
        users_query_ref = users_ref.where(filter=or_filter)
        users_results = users_query_ref.get()

        users_docs = [doc.to_dict() for doc in users_results]

        users = {}

        for doc in users_docs:
            users[doc["uid"]] = doc

        for doc in points_docs:
            points.append(
                doc
                | {
                    "created_by": users[doc["created_by"]],
                    "subject": users[doc["subject"]],
                }
            )

        sorted_points = sorted(points, key=lambda x: x["created_time"], reverse=True)

        return _Response(
            _json.dumps(
                {"data": sorted_points},
            ),
            200,
            _headers,
        )
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())

        return _Response(
            _json.dumps(
                {"code": 500, "message": "Internal server error"},
            ),
            500,
            _headers,
        )
