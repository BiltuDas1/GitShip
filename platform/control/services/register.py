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
    new_user = await User.create(
      firstname=firstname,
      lastname=lastname,
      email=email,
      password=password,
    )
  except IntegrityError:
    return Response(status=False, message="user already exist").status(400)

  return Response(
    status=True,
    message="user registered successfully",
    data={"uuid": str(new_user.id), "email": new_user.email},
  ).status(200)
