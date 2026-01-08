from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from utils.status import Response, HTTPStatus


def setValidationException(app: FastAPI):
  """
  Attach the Custom API Error
  """

  @app.exception_handler(RequestValidationError)
  async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = {}
    for err in exc.errors():
      message = err.get("msg").replace("Value error, ", "")
      field = err.get("loc")[-1]
      errors[field] = message

    return Response(
      status=False,
      message="validation failed",
      errors=errors,
    ).status(HTTPStatus.HTTP_400_BAD_REQUEST)
