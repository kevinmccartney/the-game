import traceback

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
        A User object.
    """
    try:
        id_token = request.headers.get("x_forwarded_authorization").replace(
            "Bearer ", ""
        )
        name_param = None

        auth.verify_id_token(id_token=id_token)

        params = request.args.to_dict()

        try:
            name_param_value = params["name"]
            name_param = name_param_value.lower()
        except KeyError:
            pass

        users_ref = db.collection("users")

        if name_param:
            name_len = len(name_param)
            name_front_code = name_param[0 : name_len - 1]
            name_end_code = name_param[name_len - 1 : name_len]

            start_code = name_param
            end_code = name_front_code + chr(ord(name_end_code) + 1)

            users_query_ref = users_ref.where(
                filter=FieldFilter(
                    field_path="display_name_normalized",
                    op_string=">=",
                    value=start_code,
                )
            ).where(
                filter=FieldFilter(
                    field_path="display_name_normalized", op_string="<", value=end_code
                )
            )

            users_results = users_query_ref.get()

            users = [doc.to_dict() for doc in users_results]

            return (users, 200, headers)

        users_results = users_ref.get()

        users = [doc.to_dict() for doc in users_results]

        return (users, 200, headers)

    except AttributeError as ex:
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
