from models import User
from utils import security


async def login_user(email: str, password: str) -> User | None:
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

  return user
