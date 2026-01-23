from models import User, VerificationToken, TokenType
from tortoise.exceptions import IntegrityError
from utils.email import Email
from utils.template import Template
from utils.template.types import EmailVerify
from utils import token
from . import exceptions


async def register_new_user(
  firstname: str,
  lastname: str,
  email: str,
  password: str,
  email_service: Email,
  sender_email: str,
  frontend_url: str,
) -> User:
  """
  Adds the user information to the database
  """
  # Trying to create user
  try:
    new_user = await User.create(
      firstname=firstname,
      lastname=lastname,
      email=email,
      password=password,
    )
  except IntegrityError:
    raise exceptions.UserAlreadyExist("user already exist")

  # Generate Email token and store in DB
  verify_token = await VerificationToken.create(
    user=new_user, token=token.generate_token(), token_type=TokenType.VERIFY_EMAIL
  )

  # Trying to send email
  sended = await email_service.send(
    toEmail=new_user.email,
    subject="Verify your Email",
    body=Template(
      EmailVerify(
        verification_link=f"{frontend_url}/verify-email?token={verify_token.token}",
        firstname=firstname,
        feedback_email=sender_email,
      )
    ),
  )

  if not sended:
    await new_user.delete()
    raise exceptions.EmailConfigurationError("failed to send email")

  return new_user
