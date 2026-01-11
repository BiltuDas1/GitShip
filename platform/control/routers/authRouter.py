from fastapi import APIRouter
from schemas import authSchema
from services import refresh_token
from utils.status import Response, HTTPStatus
from datetime import datetime, timezone


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/refresh")
async def refresh(data: authSchema.RefreshTokenSchema):
  """
  Access and Refresh Token Renewal Handler
  """
  jwt = await refresh_token.generate_token(data.refresh_token)
  if jwt is None:
    return Response(status=False, message="refresh token is invalid or expired").status(
      HTTPStatus.HTTP_403_FORBIDDEN
    )

  return (
    Response(status=True, message="token generated successfully")
    .status(HTTPStatus.HTTP_200_OK)
    .add_cookie(
      key="access_token",
      value=jwt.access_token.getToken(),
      expires=datetime.fromtimestamp(
        timestamp=jwt.access_token.expiry_time(), tz=timezone.utc
      ),
      secure=True,
      httponly=True,
      samesite="lax",
      path="/",
    )
    .add_cookie(
      key="refresh_token",
      value=jwt.refresh_token.getToken(),
      expires=datetime.fromtimestamp(
        timestamp=jwt.refresh_token.expiry_time(), tz=timezone.utc
      ),
      secure=True,
      httponly=True,
      samesite="lax",
      path="/api/auth/refresh",
    )
  )
