import functions_framework as _functions_framework
from flask import Request as _Request, Response as _Response


@_functions_framework.http
def function_handler(request: _Request):
    """HTTP ping Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        CORS headers.
    """
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Max-Age": "3600",
    }

    return _Response("", 204, headers)
