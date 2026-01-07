from models.user import User
from tortoise.exceptions import IntegrityError
from utils.status import Response


async def add_user(
  firstname: str, lastname: str, email: str, password: str
) -> Response:
  """
  Adds the user information to the database
  """
  try:
    await User.create(
      firstname=firstname,
      lastname=lastname,
      email=email,
      password=password,
    )
  except IntegrityError:
    return Response(status=False, message="email address already exist").status(400)

  return Response(status=True, message="registration successful").status(200)
