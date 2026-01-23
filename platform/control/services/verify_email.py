from models.verification_token import VerificationToken, TokenType
from models.user import User


async def verify(token: str) -> User | None:
  """
  Checks if the token is valid or not
  """
  token_obj = await VerificationToken.get_or_none(
    token=token, token_type=TokenType.VERIFY_EMAIL
  )
  if token_obj is None:
    return None

  user = await token_obj.user
  if not user.is_active:
    user.is_active = True
    await user.save()
  await token_obj.delete()

  return user
