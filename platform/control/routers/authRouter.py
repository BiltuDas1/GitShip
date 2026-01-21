from fastapi import APIRouter, Cookie
from services import refresh_token
from utils import auth_cookie
from utils.status import Response, HTTPStatus


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/refresh")
async def refresh(token: str | None = Cookie(default=None, alias="refresh_token")):
  """
  Access and Refresh Token Renewal Handler
  """
  if token is None:
    return Response(
      status=False, message="refresh_token cookie is not provided"
    ).status(HTTPStatus.HTTP_401_UNAUTHORIZED)

  jwt = await refresh_token.generate_token(token)
  if jwt is None:
    return Response(status=False, message="refresh token is invalid or expired").status(
      HTTPStatus.HTTP_403_FORBIDDEN
    )

  return auth_cookie.setAuthCookies(
    Response(status=True, message="token generated successfully").status(
      HTTPStatus.HTTP_200_OK
    ),
    jwt,
  )
