from abc import ABC, abstractmethod


class AuthRefreshToken(ABC):
  @abstractmethod
  def __init__(self, sub: str, refresh_token: str | None = None):
    pass

  @abstractmethod
  def get_token(self) -> str:
    """
    Returns the Refresh Token
    """

  @abstractmethod
  def get_jti(self) -> str:
    """
    Returns the ID of the Token
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
