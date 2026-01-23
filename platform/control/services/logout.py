import db
from utils import jwt, auth_token


async def logout_user(token: str, cache: db.Cache) -> bool:
  """
  Removes the refresh token from the Cache database

  :param token: active refresh token
  :type token: str
  :return: True if the removal complete, otherwise False
  :rtype: bool
  """
  jwt_token: auth_token.refresh_token.AuthRefreshToken | None = (
    jwt.JWT.to_refresh_token(token)
  )
  if jwt_token is None:
    return False

  await cache.remove_token(jwt_token.get_jti())
  return True
