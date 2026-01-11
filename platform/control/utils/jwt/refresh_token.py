import jwt
import time
from core import settings
from .. import token
from dataclasses import dataclass, asdict


@dataclass(frozen=True)
class RefreshTokenPayload:
  sub: str
  jti: str
  iat: int
  exp: int
  type: str = "refresh"


class RefreshToken:
  def __init__(self, sub: str, refresh_token: str | None = None):
    if refresh_token is not None:
      self.__payload = RefreshTokenPayload(
        **jwt.decode(
          refresh_token,
          key=settings.EDDSA_KEY.public_key(),
          algorithms=["EdDSA"],
          verify=True,
        )
      )
      self.__token = refresh_token
      return

    self.__payload = RefreshTokenPayload(
      sub=sub,
      jti=token.generate_token(),
      iat=int(time.time()),
      exp=int(time.time()) + settings.REFRESH_TOKEN_EXPIRY,
    )

    self.__token = jwt.encode(
      payload=asdict(self.__payload),
      key=settings.EDDSA_KEY.private_key(),
      algorithm="EdDSA",
    )

  def getToken(self) -> str:
    """
    Returns the Refresh Token
    """
    return self.__token

  def getJTI(self) -> str:
    """
    Returns the ID of the Token
    """
    return self.__payload.jti

  def creation_time(self) -> int:
    """
    Returns the creation time of the Token
    """
    return self.__payload.iat

  def expiry_time(self) -> int:
    """
    Returns the expiry time of the Token
    """
    return self.__payload.exp
