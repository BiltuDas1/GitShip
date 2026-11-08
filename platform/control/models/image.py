from tortoise.models import Model
from tortoise import fields
from models.user import User
from uuid import uuid7


class Image(Model):
  id = fields.UUIDField(primary_key=True, default=uuid7)
  user: fields.ForeignKeyRelation[User] = fields.ForeignKeyField(
    model_name="models.User", on_delete=fields.CASCADE, related_name="images"
  )
  image_name = fields.CharField(max_length=255)
  hub_url = fields.CharField(max_length=255, default="https://docker.io")
  container_id = fields.CharField(max_length=255, null=True)
