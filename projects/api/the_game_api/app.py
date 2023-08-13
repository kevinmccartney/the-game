import os
import logging

from flask import Flask
from flask_cors import CORS

from firebase_admin import initialize_app as _initialize_app

_initialize_app()

os.environ["THE_GAME_ENV"] = "local"
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app)


class Middleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        try:
            environ["HTTP_X_FORWARDED_AUTHORIZATION"] = environ.get(
                "HTTP_AUTHORIZATION", ""
            )
            del environ["HTTP_AUTHORIZATION"]
        except KeyError:
            pass

        environ["HTTP_X_ENVOY_ORIGINAL_PATH"] = environ.get("REQUEST_URI", "")

        return self.app(environ, start_response)


app.wsgi_app = Middleware(app.wsgi_app)
