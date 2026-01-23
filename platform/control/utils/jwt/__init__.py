from models import User
from . import access_token, refresh_token
import jwt as jwt_token
from utils.auth_token import AuthToken


class JWT(AuthToken):
  def __init__(self, user: User):
    self.access_token = access_token.AccessToken(str(user.id))
    self.refresh_token = refresh_token.RefreshToken(str(user.id))

  def to_dict(self) -> dict[str, str]:
    return {
      "access_token": self.access_token.get_token(),
      "refresh_token": self.refresh_token.get_token(),
    }

  @classmethod
  def to_refresh_token(cls, token: str) -> refresh_token.RefreshToken | None:
    try:
      return refresh_token.RefreshToken(sub="", refresh_token=token)
    except jwt_token.exceptions.InvalidSignatureError:
      return None
