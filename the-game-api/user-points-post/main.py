import os
import json
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

        # headers = ", ".join(dict(request.headers))

        logging.info(id_token)
        logging.info(request.path)
        # logging.info(json.dumps(headers))

        user = auth.verify_id_token(id_token=id_token)
    except AttributeError:
        logging.error(traceback.format_exc())
        return {"code": 401, "message": "Unauthorized: Authorization not provided"}, 401
    except (
        InvalidIdTokenError,
        ExpiredIdTokenError,
        RevokedIdTokenError,
        UserDisabledError,
    ) as ex:
        print(ex)
        logging.error(traceback.format_exc())
        return {
            "code": 403,
            "message": "Forbidden: Caller is not authorized to take this action",
        }, 403
    except Exception:
        logging.error(traceback.format_exc())
        return {"code": 500, "message": "Internal server error"}, 500

    try:
        # request.path
        pattern = re.compile(r"^\/api\/v1\/user\/(.*)\/points$")
        subject_uid = pattern.sub(r"\1", request.path)
        request_json = request.get_json(force=True)
        doc = {
            "created_by_name": user["name"],
            "created_by_uid": user["uid"],
            "created_time": datetime.utcnow().isoformat(),
            "subject": subject_uid,
            "reason": request_json["reason"],
            "points": request_json["points"],
        }

        db.collection("points").document(str(uuid4())).set(doc)
    except BadRequest:
        logging.error(traceback.format_exc())
        {
            "code": 400,
            "message": "Bad Request: Please double check API documentation to make sure you are passing the correct options",
        }, 400
    except KeyError:
        logging.error(traceback.format_exc())
        {
            "code": 400,
            "message": "Bad Request: Please double check API documentation to make sure you are passing the correct options",
        }, 400
    except Exception:
        logging.error(traceback.format_exc())
        return {"code": 500, "message": "Internal server error"}, 500

    return Response(status=201)
