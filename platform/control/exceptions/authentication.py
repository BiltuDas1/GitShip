from fastapi import FastAPI
from utils.status import Response, HTTPStatus


class UnauthorizedError(Exception):
  """
  Exception class when the request is not authenticated
  """


def setAuthenticationException(app: FastAPI):
  """
  Attach Authentication Custom Exceptions
  """

  @app.exception_handler(UnauthorizedError)
  async def authentication_exception_handler(request, exc):
    return Response(status=False, message=str(exc)).status(
      HTTPStatus.HTTP_401_UNAUTHORIZED
    )
