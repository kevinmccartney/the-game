# TODO: how much can be abstracted out here?
import traceback as _traceback
import os as _os
from typing import List, Union
from uuid import uuid4 as _uuid4
from string import digits
from random import choice

from firebase_admin import initialize_app as _initialize_app
from pydantic import BaseModel

from firebase_admin.firestore import client as _firestore_client
from google.cloud.logging import Client as _LoggingClient
from google.cloud.functions.context import Context

from google.cloud.firestore import Client as _FirestoreClient

_env = _os.environ.get("THE_GAME_ENV", "")

# we don't want to initialize the app and do want to log to stdout/stderr when running
# the API dev server
if _env != "local":
    _logging_client = _LoggingClient()
    _logging_client.setup_logging()
    _initialize_app()

import logging as _logging


_db: _FirestoreClient = _firestore_client()

#  User
#  uid: $Admin,$Self,$Friend,$Anon
#  display_name: string; $Admin,$Self,$Friend,$Anon
#  username: string; $Admin,$Self,$Friend,$Anon
#  photo_url: string; $Admin,$Self,$Friend,$Anon
#  join_date: Date $Admin,$Self,$Friend
#  location: string; $Admin,$Self,$Friend
#  about_me: string; $Admin,$Self,$Friend
#  likes: Array<string> $Admin,$Self,$Friend
#  friends: Array<string> $Admin,$Self,$Friend # ARRAY OF UIDs. Exposed by /v1/users/{id}/friends
#  dislikes: Array<string> $Admin,$Self,$Friend
#  email: string; $Admin,$Self
#  phone_number: string; $Admin,$Self
#
#  Admin User returned by API
#  User - $Self
#  Friend - $Friend
#  UserIdentifier - $Anon


class User(BaseModel):
    uid: str
    display_name: str
    display_name_normalized: str
    username: str
    photo_url: Union[str, None] = None
    join_date: str
    location: Union[str, None] = None
    about_me: Union[str, None] = None
    likes: List[str] = []
    friends: List[str] = []
    dislikes: List[str] = []
    email: str
    phone_number: Union[str, None] = None


def function_handler(data: dict, context: Context):
    """Triggered by creation or deletion of a Firebase Auth user object.
    Args:
        data (dict): The event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """

    try:
        display_name = data.get("displayName", None)

        if display_name:
            display_name_normalized = display_name.lower()
            username = f"{display_name_normalized.replace(' ', '')}{''.join(choice(digits) for i in range(8))}"

        user = User(
            uid=data.get("uid", None),
            display_name=data.get("displayName", None),
            display_name_normalized=display_name_normalized,
            username=username,
            photo_url=data.get("photoURL", None),
            join_date=data.get("metadata", {}).get("createdAt", None),
            location=None,
            about_me=None,
            likes=[],
            friends=[],
            dislikes=[],
            email=data.get("email", None),
            phone_number=None,
        )
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())

    try:
        record_id = str(_uuid4())
        _db.collection("users").document(record_id).set(document_data=user.model_dump())

        _logging.info(f"Created user - record id: {record_id}, uid: {user.uid}")
    except Exception as ex:
        _logging.error(ex)
        _logging.error(_traceback.format_exc())
