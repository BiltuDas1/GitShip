import db
from utils import jwt


async def logout_user(token: str) -> bool:
  """
  Removes the refresh token from the Cache database

  :param token: active refresh token
  :type token: str
  :return: True if the removal complete, otherwise False
  :rtype: bool
  """
  jwt_token = jwt.JWT.ToRefreshToken(token)
  if jwt_token is None:
    return False

  jti = jwt_token.getJTI()
  refresh_jti = f"refresh_token:{jti}"
  await db.CACHE.remove(refresh_jti)
  return True
