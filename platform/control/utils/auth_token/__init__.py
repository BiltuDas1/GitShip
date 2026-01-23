from abc import ABC, abstractmethod
from models import User
from utils.auth_token import refresh_token, access_token


class AuthToken(ABC):
  @abstractmethod
  def __init__(self, user: User):
    self.access_token: access_token.AuthAccessToken
    self.refresh_token: refresh_token.AuthRefreshToken

  @abstractmethod
  def to_dict(self) -> dict[str, str]:
    """
    Returns a dictionary object containing access_token and refresh_token
    """

  @classmethod
  @abstractmethod
  def to_refresh_token(cls, token: str) -> refresh_token.AuthRefreshToken | None:
    """
    Get RefreshToken from the inputted token

    :param token: The refresh token string
    :type token: str
    :return: If successful returns RefreshToken object, otherwise None
    :rtype: RefreshToken
    """
