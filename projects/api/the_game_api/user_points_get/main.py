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
from google.cloud.firestore_v1.base_query import FieldFilter, Or

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
        logging.error(ex)
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
    ) as ex:
        logging.error(ex)
        logging.error(traceback.format_exc())
        return (
            {
                "code": 403,
                "message": "Forbidden: Caller is not authorized to take this action",
            },
            403,
            headers,
        )
    except Exception as ex:
        logging.error(ex)
        logging.error(traceback.format_exc())
        return ({"code": 500, "message": "Internal server error"}, 500, headers)

    try:
        pattern = re.compile(r"^\/v1\/users\/(.*)\/points(\?.*)?$")
        request_path = request.headers.get("x-envoy-original-path")
        subject_uid = pattern.sub(r"\1", request_path)

        type_param = "all"

        # error if we don't pass in args?
        params = request.args.to_dict()

        try:
            type_param_value = params["type"]
            type_param = type_param_value.lower()
        except KeyError:
            pass

        points_ref = db.collection("points")
        users_ref = db.collection("users")
        points_query_ref = None

        if type_param == "all":
            filter_1 = FieldFilter("subject", "==", subject_uid)
            filter_2 = FieldFilter("created_by", "==", subject_uid)

            # Create the union filter of the two filters (queries)
            or_filter = Or(filters=[filter_1, filter_2])

            points_query_ref = points_ref.where(filter=or_filter)
        elif type_param == "sent":
            filter = FieldFilter("created_by", "==", subject_uid)

            points_query_ref = points_ref.where(filter=filter)
        elif type_param == "received":
            filter = FieldFilter("subject", "==", subject_uid)

            points_query_ref = points_ref.where(filter=filter)

        points_results = points_query_ref.get()

        points_docs = [doc.to_dict() | {"id": doc.id} for doc in points_results]

        points = []
        uids = []
        users = {}

        for doc in points_docs:
            uids.append(doc["subject"])
            uids.append(doc["created_by"])

        uids = list(set(uids))

        filters = [FieldFilter("uid", "==", uid) for uid in uids]
        or_filter = Or(filters=filters)
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

        return (sorted_points, 200, headers)
    except Exception as ex:
        logging.error(ex)
        logging.error(traceback.format_exc())
        return ({"code": 500, "message": "Internal server error"}, 500, headers)
