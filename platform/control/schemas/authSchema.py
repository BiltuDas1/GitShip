from pydantic import BaseModel, EmailStr, Field, field_validator
from utils import password


class RegisterSchema(BaseModel):
  firstname: str = Field(..., max_length=50)
  lastname: str = Field(..., max_length=50)

  email: EmailStr
  password: str = Field(..., min_length=8, max_length=72)

  @field_validator("firstname", "lastname")
  def name_validator(cls, name: str):
    if not name.isalpha():
      raise ValueError("name should only contains alphabet characters")
    return name

  @field_validator("password")
  def password_validator(cls, passwd: str):
    if not password.check_password(passwd):
      raise ValueError(
        "password should contains uppercase, lowercase, number and special characters"
      )
    return passwd
