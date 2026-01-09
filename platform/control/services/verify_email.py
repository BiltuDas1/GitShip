from models.verification_token import VerificationToken
from models.user import User


async def verify(token: str) -> User | None:
  """
  Checks if the token is valid or not
  """
  token_obj = await VerificationToken.get_or_none(token=token)
  if token_obj is None:
    return None

  user = await token_obj.user
  user.is_active = True
  await user.save()
  await token_obj.delete()

  return user
