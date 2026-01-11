from models import User
from . import access_token, refresh_token
import jwt as jwt_token


class JWT:
  def __init__(self, user: User):
    self.access_token = access_token.AccessToken(str(user.id))
    self.refresh_token = refresh_token.RefreshToken(str(user.id))

  def toDict(self) -> dict[str, str]:
    """
    Returns a dictionary object containing access_token and refresh_token
    """
    return {
      "access_token": self.access_token.getToken(),
      "refresh_token": self.refresh_token.getToken(),
    }

  @classmethod
  def ToRefreshToken(cls, token: str) -> refresh_token.RefreshToken | None:
    """
    Get RefreshToken from the inputted token

    :param token: The refresh token string
    :type token: str
    :return: If successful returns RefreshToken object, otherwise None
    :rtype: RefreshToken
    """
    try:
      return refresh_token.RefreshToken(sub="", refresh_token=token)
    except jwt_token.exceptions.InvalidSignatureError:
      return None
