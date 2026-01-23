from abc import ABC, abstractmethod


class AuthAccessToken(ABC):
  @abstractmethod
  def __init__(self, sub: str, access_token: str | None = None):
    pass

  @abstractmethod
  def get_token(self) -> str:
    """
    Returns the Access Token
    """

  @abstractmethod
  def creation_time(self) -> int:
    """
    Returns the creation time of the Token
    """

  @abstractmethod
  def expiry_time(self) -> int:
    """
    Returns the expiry time of the Token
    """
