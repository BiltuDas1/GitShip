from tortoise.exceptions import DBConnectionError
from fastapi import FastAPI
from utils.status import Response, HTTPStatus


def setDBConnectionError(app: FastAPI):
  """
  Attach Database Custom Exceptions
  """

  @app.exception_handler(DBConnectionError)
  async def db_connection_exception_handler(request, exc):
    return Response(
      status=False,
      message="We're having trouble connecting to the database",
    ).status(HTTPStatus.HTTP_500_INTERNAL_SERVER_ERROR)
