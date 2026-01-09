from tortoise.models import Model
from tortoise import fields
from models.user import User


class VerificationToken(Model):
  user: fields.OneToOneRelation[User] = fields.OneToOneField(
    model_name="models.User", on_delete=fields.CASCADE, pk=True
  )
  token = fields.CharField(max_length=32, unique=True)
  updated_at = fields.DatetimeField(auto_now=True)
