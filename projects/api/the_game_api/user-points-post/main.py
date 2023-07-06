from uuid import uuid4
from datetime import datetime
import traceback
import re

import functions_framework
import firebase_admin

from firebase_admin import firestore, auth
from firebase_admin.auth import (
    InvalidIdTokenError,
    ExpiredIdTokenError,
    RevokedIdTokenError,
    UserDisabledError,
)
from google.cloud.firestore import Client as FirestoreClient
from werkzeug.exceptions import BadRequest
from google.cloud.logging import Client as LoggingClient
from flask import Response, Request

logging_client = LoggingClient()
logging_client.setup_logging()

import logging

firebase_admin.initialize_app()

db: FirestoreClient = firestore.client()

headers = {"Access-Control-Allow-Origin": "*"}


@functions_framework.http
def function_handler(request: Request):
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

        user = auth.verify_id_token(id_token=id_token)
    except AttributeError:
        logging.error(traceback.format_exc())
        return (
            {"code": 401, "message": "Unauthorized: Authorization not provided"},
            401,
            headers,
        )
    except (
        InvalidIdTokenError,
        ExpiredIdTokenError,
        RevokedIdTokenError,
        UserDisabledError,
    ):
        logging.error(traceback.format_exc())
        return (
            {
                "code": 403,
                "message": "Forbidden: Caller is not authorized to take this action",
            },
            403,
            headers,
        )
    except Exception:
        logging.error(traceback.format_exc())
        return ({"code": 500, "message": "Internal server error"}, 500, headers)

    try:
        # request.path
        pattern = re.compile(r"^\/v1\/users\/(.*)\/points$")
        request_path = request.headers.get("x-envoy-original-path")
        subject_uid = pattern.sub(r"\1", request_path)
        request_json = request.get_json(force=True)

        doc = {
            "created_by": user["uid"],
            # TODO: is there a better way to do this?
            "created_time": f"{datetime.utcnow().isoformat()}Z",
            "subject": subject_uid,
            "reason": request_json["reason"],
            "points": request_json["points"],
        }

        db.collection("points").document(str(uuid4())).set(doc)
    except BadRequest:
        logging.error(traceback.format_exc())
        (
            {
                "code": 400,
                "message": "Bad Request: Please double check API documentation to make sure you are passing the correct options",
            },
            400,
            headers,
        )
    except KeyError:
        logging.error(traceback.format_exc())
        (
            {
                "code": 400,
                "message": "Bad Request: Please double check API documentation to make sure you are passing the correct options",
            },
            400,
            headers,
        )
    except Exception:
        logging.error(traceback.format_exc())
        return ({"code": 500, "message": "Internal server error"}, 500, headers)

    return Response(status=201, headers=headers)