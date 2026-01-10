from fastapi import APIRouter
from schemas import usersSchema
from services.register import register_new_user
from services.reset_password import reset_password, set_password
from services.verify_email import verify
from services.login import login_user
from services import exceptions
from utils.status import Response, HTTPStatus


router = APIRouter(prefix="/users", tags=["Authentication"])


@router.post("/register")
async def register(data: usersSchema.RegisterSchema):
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


@router.get("/verify")
async def verify_email(token: str):
  """
  Verify Email Handler
  """
  user = await verify(token)
  if user is not None:
    return Response(
      status=True,
      message="user registered successfully",
      data={"uuid": str(user.id), "email": user.email},
    ).status(HTTPStatus.HTTP_200_OK)

  return Response(status=False, message="invalid token").status(
    HTTPStatus.HTTP_404_NOT_FOUND
  )


@router.post("/login")
async def login(data: usersSchema.LoginSchema):
  """
  User Login Handler
  """
  user = await login_user(data.email, data.password)
  if user is None:
    return Response(status=False, message="invalid email or password").status(
      HTTPStatus.HTTP_400_BAD_REQUEST
    )

  return Response(
    status=True,
    message="login successful",
    data={"firstname": user.firstname, "lastname": user.lastname, "email": user.email},
  ).status(HTTPStatus.HTTP_200_OK)


# Password Related Routing
passwordRouter = APIRouter(prefix="/password", tags=["Password"])


@passwordRouter.post("/reset")
async def reset(data: usersSchema.ResetPasswordSchema):
  """
  Reset Password Handler
  """
  try:
    await reset_password(data.email)

    return Response(
      status=True, message="a reset password email has been sent to that email address"
    ).status(HTTPStatus.HTTP_200_OK)

  except exceptions.EmailConfigurationError as err:
    return Response(status=False, message=str(err)).status(
      HTTPStatus.HTTP_500_INTERNAL_SERVER_ERROR
    )


@passwordRouter.post("/update")
async def update_password(data: usersSchema.UpdatePasswordSchema):
  """
  Update Password Handler (Helper of Reset Password Handler)
  """
  isSet = await set_password(data.token, data.password)
  if not isSet:
    return Response(status=False, message="invalid token").status(
      HTTPStatus.HTTP_400_BAD_REQUEST
    )

  return Response(status=True, message="password updated").status(
    HTTPStatus.HTTP_200_OK
  )


# Attaching the password router with the users router
router.include_router(passwordRouter)
