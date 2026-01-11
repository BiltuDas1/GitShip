from models import User
from utils import jwt
from utils import security
import db


async def login_user(email: str, password: str) -> jwt.JWT | None:
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
  token = jwt.JWT(user)

  key = f"refresh_token:{token.refresh_token.getJTI()}"
  expire_at = token.refresh_token.expiry_time()
  await db.CACHE.set(key=key, value=str(user.id))
  await db.CACHE.setExpiry(key=key, expire_at=expire_at)
  return token
