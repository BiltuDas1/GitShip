from utils.status import Response, HTTPStatus
from fastapi.responses import Response as ResponseEmpty
from utils import jwt
from datetime import datetime, timezone
from core import debug


def setAuthCookies(response: Response, jwt: jwt.JWT) -> Response:
  """
  Stores the JWT Cookie in a Response and return a Response object of it

  :param response: The response object to modify
  :type response: Response
  :param jwt: The JWT Token to store
  :type jwt: jwt.JWT
  :return: Response object with the JWT Token
  :rtype: Response
  """
  response.add_cookie(
    key="access_token",
    value=jwt.access_token.getToken(),
    expires=datetime.fromtimestamp(
      timestamp=jwt.access_token.expiry_time(), tz=timezone.utc
    ),
    secure=not debug.DEBUG,
    httponly=True,
    samesite="lax",
    path="/",
  )

  response.add_cookie(
    key="refresh_token",
    value=jwt.refresh_token.getToken(),
    expires=datetime.fromtimestamp(
      timestamp=jwt.refresh_token.expiry_time(), tz=timezone.utc
    ),
    secure=not debug.DEBUG,
    httponly=True,
    samesite="lax",
    path="/auth/refresh",
  )

  return response


def deleteAuthCookies() -> ResponseEmpty:
  """
  Returns response of deleting the JWT Cookie
  """
  response = ResponseEmpty(status_code=HTTPStatus.HTTP_204_NO_CONTENT)
  response.delete_cookie(key="refresh_token", path="/auth/refresh")
  response.delete_cookie(key="access_token", path="/")
  return response
