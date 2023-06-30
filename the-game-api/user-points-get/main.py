import traceback
import re

import functions_framework
from flask import Request
import firebase_admin
from firebase_admin import firestore, auth
from google.cloud.logging import Client as LoggingClient
from google.cloud.firestore import Client as FirestoreClient
from firebase_admin.auth import (
    InvalidIdTokenError,
    ExpiredIdTokenError,
    RevokedIdTokenError,
    UserDisabledError,
)
from google.cloud.firestore_v1.base_query import FieldFilter

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
    try:
        id_token = request.headers.get("x_forwarded_authorization").replace(
            "Bearer ", ""
        )

        auth.verify_id_token(id_token=id_token)
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
        pattern = re.compile(r"^\/v1\/users\/(.*)\/points$")
        request_path = request.headers.get("x-envoy-original-path")
        subject_uid = pattern.sub(r"\1", request_path)

        points_ref = db.collection("points")
        points_query_ref = points_ref.where(
            filter=FieldFilter(field_path="subject", op_string="==", value=subject_uid)
        )

        points_results = points_query_ref.get()

        points_docs = [doc.to_dict() | {"id": doc.id} for doc in points_results]

        points = []

        for doc in points_docs:
            users_ref = db.collection("users")
            users_query_ref = users_ref.where(
                filter=FieldFilter(
                    field_path="uid", op_string="==", value=doc["created_by"]
                )
            )

            users_results = users_query_ref.get()

            created_by_user = users_results[0].to_dict()

            points.append(doc | {"created_by": created_by_user})

        return (points, 200, headers)
    except Exception:
        logging.error(traceback.format_exc())
        return ({"code": 500, "message": "Internal server error"}, 500, headers)
