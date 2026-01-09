from fastapi import APIRouter
from schemas import authSchema
from services.register import register_new_user
from services import exceptions
from utils.status import Response, HTTPStatus


router = APIRouter(prefix="/users", tags=["Authentication"])


@router.post("/register")
async def register(data: authSchema.RegisterSchema):
  """
  User Registration Handler
  """
  try:
    new_user = await register_new_user(
      firstname=data.firstname,
      lastname=data.lastname,
      email=data.email,
      password=data.password,
    )

    return Response(
      status=True,
      message="a verfication email has been send to the email address",
      data={"email": new_user.email},
    ).status(HTTPStatus.HTTP_200_OK)

  except exceptions.EmailConfigurationError as err:
    return Response(status=False, message=str(err)).status(
      HTTPStatus.HTTP_500_INTERNAL_SERVER_ERROR
    )

  except exceptions.UserAlreadyExist as err:
    return Response(status=False, message=str(err)).status(
      HTTPStatus.HTTP_400_BAD_REQUEST
    )
