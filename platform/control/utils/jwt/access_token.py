import jwt
import time
from core import settings
from dataclasses import dataclass, asdict


@dataclass(frozen=True)
class AccessTokenPayload:
  sub: str
  iat: int
  exp: int
  type: str = "access"


class AccessToken:
  def __init__(self, sub: str, access_token: str | None = None):
    if access_token is not None:
      self.__payload = AccessTokenPayload(
        **jwt.decode(
          access_token,
          key=settings.EDDSA_KEY.public_key(),
          algorithms=["EdDSA"],
          verify=True,
        )
      )
      self.__token = access_token
      return

    self.__payload = AccessTokenPayload(
      sub=sub,
      iat=int(time.time()),
      exp=int(time.time()) + settings.ACCESS_TOKEN_EXPIRY,
    )

    self.__token = jwt.encode(
      payload=asdict(self.__payload),
      key=settings.EDDSA_KEY.private_key(),
      algorithm="EdDSA",
    )

  def getToken(self) -> str:
    """
    Returns the Access Token
    """
    return self.__token

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
