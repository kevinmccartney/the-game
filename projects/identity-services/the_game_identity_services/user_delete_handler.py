# TODO: how much can be abstracted out here?
import traceback as _traceback
import os as _os
from typing import List, Union
from uuid import uuid4 as _uuid4

from firebase_admin import initialize_app as _initialize_app
from pydantic import BaseModel

from firebase_admin.firestore import client as _firestore_client
from google.cloud.logging import Client as _LoggingClient
from google.cloud.functions.context import Context

from google.cloud.firestore import Client as _FirestoreClient
from google.cloud.firestore_v1.base_query import FieldFilter as _FieldFilter

_env = _os.environ.get("THE_GAME_ENV", "")

# we don't want to initialize the app and do want to log to stdout/stderr when running
# the API dev server
if _env != "local":
    _logging_client = _LoggingClient()
    _logging_client.setup_logging()
    _initialize_app()

import logging as _logging


_db: _FirestoreClient = _firestore_client()


def function_handler(data: dict, context: Context):
    """Triggered by creation or deletion of a Firebase Auth user object.
    Args:
        data (dict): The event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """
    uid = data.get("uid", None)

    try:
        user_record = (
            _db.collection("users").where(filter=_FieldFilter("uid", "==", uid)).get()
        )

        for record in user_record:
            _db.collection("users").document(record.id).delete()

            _logging.info(f"Deleted user - record id: ${record.id}, uid: ${uid}")
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
