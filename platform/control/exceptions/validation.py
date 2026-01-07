from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from utils.status import Response, HTTPStatus, VALIDATION_FAILED


def setValidationException(app: FastAPI):
  """
  Attach the Custom API Error
  """

  @app.exception_handler(RequestValidationError)
  async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error = exc.errors()[0]
    clean_message = error.get("msg").replace("Value error, ", "")

    return Response(
      status=False,
      code=VALIDATION_FAILED,
      message=clean_message,
      field=error.get("loc")[-1],
    ).status(HTTPStatus.HTTP_400_BAD_REQUEST)
