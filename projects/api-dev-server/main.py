import os
import logging

from flask import Flask, request
from flask_cors import CORS
from werkzeug.wrappers import Request

from firebase_admin import initialize_app as _initialize_app

_initialize_app()

from the_game_api.user_notifications_get import (
    function_handler as user_notifications_get_handler,
)
from the_game_api.user_points_get import function_handler as user_points_get_handler
from the_game_api.user_points_post import function_handler as user_points_post_handler
from the_game_api.user_scores_get import function_handler as user_scores_get_handler
from the_game_api.users_get import function_handler as users_get_handler
from the_game_api.users_get_entity import function_handler as users_get_entity_handler

os.environ["THE_GAME_ENV"] = "local"
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app)


def request_handler(func, *args, **kwargs):
    def wrapper(*args, **kwargs):
        print(request)

        return func(request=request)

    # TODO: this might be mad hacky. revisit
    # https://stackoverflow.com/a/42254713
    wrapper.__name__ = f"${func.__hash__()}"

    return wrapper


app.add_url_rule(
    "/v1/users/<id>/notifications",
    view_func=request_handler(func=user_notifications_get_handler),
)

app.add_url_rule(
    "/v1/users/<id>/points",
    view_func=request_handler(func=user_points_get_handler),
)

app.add_url_rule(
    "/v1/users/<id>/points",
    view_func=request_handler(func=user_points_post_handler),
    methods=["POST"],
)

app.add_url_rule(
    "/v1/users/<id>/scores",
    view_func=request_handler(func=user_scores_get_handler),
)

app.add_url_rule(
    "/v1/users",
    view_func=request_handler(func=users_get_handler),
)

app.add_url_rule(
    "/v1/users/<id>",
    view_func=request_handler(func=users_get_entity_handler),
)


class Middleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        try:
            environ["HTTP_X_FORWARDED_AUTHORIZATION"] = environ["HTTP_AUTHORIZATION"]
            del environ["HTTP_AUTHORIZATION"]
        except KeyError:
            pass

        environ["HTTP_X_ENVOY_ORIGINAL_PATH"] = environ["REQUEST_URI"]

        return self.app(environ, start_response)


app.wsgi_app = Middleware(app.wsgi_app)
