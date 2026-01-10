from tortoise.models import Model
from tortoise import fields
from models.user import User
from enum import Enum


class TokenType(Enum):
  RESET_PASSWORD = "reset_password"
  VERIFY_EMAIL = "verify_email"


class VerificationToken(Model):
  user: fields.OneToOneRelation[User] = fields.OneToOneField(
    model_name="models.User", on_delete=fields.CASCADE, pk=True
  )
  token = fields.CharField(max_length=32, unique=True)
  token_type = fields.CharEnumField(
    enum_type=TokenType, default=TokenType.VERIFY_EMAIL, max_length=20
  )
  updated_at = fields.DatetimeField(auto_now=True)
