import functions_framework


@functions_framework.http
def function_handler(request):
    """HTTP ping Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        Pong.
    """
    return "Pong"
