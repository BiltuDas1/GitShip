from fastapi import Cookie
from uuid import UUID
from models import User
from exceptions.authentication import UnauthorizedError
from utils import jwt


async def get_current_user(
  access_token: str | None = Cookie(default=None, alias="access_token"),
) -> User:
  """
  Verifies the JWT access token and returns the user it belongs to

  Add it only to the endpoints which need authentication, for example:
  ``user: User = Depends(get_current_user)``
  """
  if access_token is None:
    raise UnauthorizedError("access token is not provided")

  try:
    token = jwt.access_token.AccessToken(sub="", access_token=access_token)
    user_id = UUID(token.get_sub())
  except Exception as err:
    # Invalid signature, expired, malformed or a token of another type
    raise UnauthorizedError("access token is invalid or expired") from err

  user = await User.get_or_none(id=user_id)
  if user is None or not user.is_active:
    raise UnauthorizedError("user does not exist or is not active")

  return user
