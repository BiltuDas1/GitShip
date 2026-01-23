from utils import jwt, auth_token
import db
from models import User


async def generate_token(token: str, cache: db.Cache) -> auth_token.AuthToken | None:
  """
  Generate a new access and refresh token, based on the existing refresh token

  :param token: active refresh token
  :type token: str
  """
  # Verify if the JWT Token is valid or not
  jwt_token: auth_token.refresh_token.AuthRefreshToken | None = (
    jwt.JWT.to_refresh_token(token)
  )
  if jwt_token is None:
    return None

  user_id = await cache.get_id(jwt_token.get_jti())
  if user_id is None:
    return None

  # Check if the user account is valid or not
  user = await User.get_or_none(id=user_id)
  if user is None:
    await cache.remove_token(jwt_token.get_jti())
    return None

  # Generate a new access token and refresh token (Refresh Token Rotation)
  new_jwt: auth_token.AuthToken = jwt.JWT(user)
  await cache.update_token(
    jwt_token.get_jti(),
    new_jwt.refresh_token.get_jti(),
    new_jwt.refresh_token.expiry_time(),
  )

  return new_jwt
