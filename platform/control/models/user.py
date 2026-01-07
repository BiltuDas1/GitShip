from tortoise.models import Model
from tortoise import fields
from typing import cast
from utils import security


class User(Model):
  firstname = fields.CharField(max_length=50)
  lastname = fields.CharField(max_length=50)
  email = fields.CharField(max_length=255, unique=True)
  password = fields.CharField(max_length=60)
  created_at = fields.DatetimeField(auto_now_add=True)

  @classmethod
  async def create(cls, **kwargs):
    # Make email lowercase (If exist)
    if "email" in kwargs:
      kwargs["email"] = cast(str, kwargs["email"]).lower()

    # Hash password (If exist)
    if "password" in kwargs:
      kwargs["password"] = security.hash_password(cast(str, kwargs["password"]))

    return await super().create(**kwargs)
