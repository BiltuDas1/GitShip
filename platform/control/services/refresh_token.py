from utils import jwt
import db
from models import User


async def generate_token(token: str) -> jwt.JWT | None:
  """
  Generate a new access and refresh token, based on the existing refresh token

  :param token: active refresh token
  :type token: str
  """
  # Verify if the JWT Token is valid or not
  jwt_token = jwt.JWT.ToRefreshToken(token)
  if jwt_token is None:
    return None

  jti = jwt_token.getJTI()
  refresh_jti = f"refresh_token:{jti}"
  user_id = await db.CACHE.get(refresh_jti)
  await db.CACHE.remove(refresh_jti)
  if user_id is None:
    return None

  # Check if the user account is valid or not
  user = await User.get_or_none(id=user_id)
  if user is None:
    return None

  # Generate a new access token and refresh token (Refresh Token Rotation)
  new_jwt = jwt.JWT(user)
  new_refresh_jti = f"refresh_token:{new_jwt.refresh_token.getJTI()}"
  expire_at = new_jwt.refresh_token.expiry_time()
  await db.CACHE.set(key=new_refresh_jti, value=str(user.id))
  await db.CACHE.setExpiry(key=new_refresh_jti, expire_at=expire_at)

  return new_jwt
