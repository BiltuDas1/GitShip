from models import User
from utils import jwt, auth_token
from utils import security
import db


async def login_user(
  email: str, password: str, cache: db.Cache
) -> auth_token.AuthToken | None:
  """
  Checks if the login details are correct or not
  """
  user = await User.get_or_none(email=email)
  if user is None:
    return None

  if not user.is_active:
    return None

  if not security.verify_password(password, user.password):
    return None

  # Generating JWT and storing it in Cache DB
  token: auth_token.AuthToken = jwt.JWT(user)
  await cache.add_token(
    token.refresh_token.get_jti(), str(user.id), token.refresh_token.expiry_time()
  )
  return token
