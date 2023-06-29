import os
import json
from uuid import uuid4
from datetime import datetime
import logging
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
from flask import Response


parsed_credential = json.loads(os.environ.get("SERVICE_WORKER_CREDENTIAL"))
credential = firebase_admin.credentials.Certificate(parsed_credential)
firebase_admin.initialize_app(credential)

db: FirestoreClient = firestore.client()


@functions_framework.http
def function_handler(request):
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
        id_token = request.authorization.token

        user = auth.verify_id_token(id_token=id_token)
    except AttributeError:
        logging.error(traceback.format_exc())
        return {"code": 401, "message": "Unauthorized: Authorization not provided"}, 401
    except (
        InvalidIdTokenError,
        ExpiredIdTokenError,
        RevokedIdTokenError,
        UserDisabledError,
    ):
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
        doc = {
            "created_by_name": user["name"],
            "created_by_uid": user["uid"],
            "created_time": datetime.utcnow().isoformat(),
            "subject": subject_uid,
            "reason": request.json["reason"],
            "points": request.json["points"],
        }

        db.collection("points").document(str(uuid4())).set(doc)
    except BadRequest:
        logging.error(traceback.format_exc())
        {
            "code": 400,
            "message": "Bad Request: Please double check API documentation to make sure you are passing the correct options",
        }, 400
    except Exception:
        logging.error(traceback.format_exc())
        return {"code": 500, "message": "Internal server error"}, 500

    return Response(status=201)
