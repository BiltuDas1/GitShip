from models import User, VerificationToken, TokenType
from utils import token
from utils.email import EMAIL
from utils.template import Template, types
from core import settings
import exceptions


async def reset_password(email: str):
  """
  Send an email for resetting password
  """
  user = await User.get_or_none(email=email)
  if user is None or not user.is_active:
    return

  verify_obj = await VerificationToken.create(
    user=user, token=token.generate_token(), token_type=TokenType.RESET_PASSWORD
  )

  sended = await EMAIL.send(
    toEmail=user.email,
    subject="Reset Password",
    body=Template(
      types.ResetPassword(
        firstname=user.firstname,
        reset_link=f"{settings.FRONTEND_URL}/reset?token={verify_obj.token}",
        expire_in=60 * 10,  # 10 Minutes
      )
    ),
  )

  if not sended:
    await verify_obj.delete()
    raise exceptions.EmailConfigurationError("failed to send email")


async def set_password(token: str, password: str) -> bool:
  """
  Update the password of the user which generated the token
  """
  token_obj = await VerificationToken.get_or_none(token=token)
  if token_obj is None:
    return False

  user = await token_obj.user
  user.set_password(password)
  await user.save()
  await token_obj.delete()
  return True
