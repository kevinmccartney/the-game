import os
import json
from uuid import uuid4
from datetime import datetime

import functions_framework
import firebase_admin

from firebase_admin import firestore, auth
from google.cloud.firestore import Client as FirestoreClient


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
    id_token = ""

    try:
        id_token = request.authorization.token
    except Exception as ex:
        print(ex)
        return "Not authed"  # TODO: return 400

    user = auth.verify_id_token(id_token=id_token)

    doc = {
        "created_by_name": user["name"],
        "created_by_uid": user["uid"],
        "created_time": datetime.utcnow().isoformat(),
        "subject": "tori_uuid",
        "reason": "more violence",
        "points": -5,
    }

    db.collection("points").document(str(uuid4())).set(doc)

    return "Pong"
