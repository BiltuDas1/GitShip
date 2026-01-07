from fastapi import APIRouter
from schemas import authSchema
from services.register import add_user


router = APIRouter(prefix="/users", tags=["Authentication"])


@router.post("/register")
async def register(data: authSchema.RegisterSchema):
  """
  User Registration Handler
  """
  resp = await add_user(
    firstname=data.firstname,
    lastname=data.lastname,
    email=data.email,
    password=data.password,
  )
  return resp
