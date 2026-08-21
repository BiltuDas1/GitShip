from models import User, VerificationToken, TokenType
from utils import token
from utils.email import Email
from utils.template import Template, types
from . import exceptions
from tortoise.exceptions import IntegrityError
from datetime import datetime, timedelta, timezone


async def reset_password(
  email: str, email_service: Email, frontend_url: str, link_expire_in: int
):
  """
  Send an email for resetting password
  """
  user = await User.get_or_none(email=email)
  if user is None or not user.is_active:
    return

  try:
    verify_obj = await VerificationToken.create(
      user=user, token=token.generate_token(), token_type=TokenType.RESET_PASSWORD
    )
  except IntegrityError:
    raise exceptions.TokenAlreadyExist("verification token already exist for this user")

  sended = await email_service.send(
    toEmail=user.email,
    subject="Reset Password",
    body=Template(
      types.ResetPassword(
        firstname=user.firstname,
        reset_link=f"{frontend_url}/reset?token={verify_obj.token}",
        expire_in=link_expire_in,
      )
    ),
  )

  if not sended:
    await verify_obj.delete()
    raise exceptions.EmailConfigurationError("failed to send email")


async def set_password(token: str, password: str, expires_in: int) -> bool:
  """
  Update the password of the user which generated the token
  """
  if not await is_reset_token_valid(token, expires_in):
    return False

  token_obj = await VerificationToken.get_or_none(
    token=token, token_type=TokenType.RESET_PASSWORD
  )
  if token_obj is None:
    return False

  user = await token_obj.user
  user.set_password(password)
  await user.save()
  await token_obj.delete()
  return True


async def is_reset_token_valid(token: str, expires_in: int) -> bool:
  """
  Check a reset token without consuming it
  """
  token_obj = await VerificationToken.get_or_none(
    token=token, token_type=TokenType.RESET_PASSWORD
  )
  if token_obj is None:
    return False

  updated_at = token_obj.updated_at
  now = datetime.now(updated_at.tzinfo or timezone.utc)
  return now - updated_at <= timedelta(seconds=expires_in)
