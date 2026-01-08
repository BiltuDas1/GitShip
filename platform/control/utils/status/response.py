from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Literal


class Response(JSONResponse):
  """
  Custom Response
  """

  def __init__(
    self,
    *,
    status: bool,
    message: str | None = None,
    **kwargs,
  ):
    self.__body = {}
    self.__body["status"] = status

    if message:
      self.__body["message"] = message

    self.__body.update(kwargs)
    super().__init__(content=self.__body)

  def status(self, code: int) -> "Response":
    """
    Set HTTP Status Code
    """
    self.status_code = code
    return self

  def add_header(self, name: str, value: str) -> "Response":
    """
    Adds HTTP Headers
    """
    self.headers[name] = value
    return self

  def add_cookie(
    self,
    key: str,
    value: str,
    max_age: int | None = None,
    expires: datetime | str | int | None = None,
    path: str | None = "/",
    domain: str | None = None,
    secure: bool = False,
    httponly: bool = False,
    samesite: Literal["lax", "strict", "none"] | None = "lax",
    partitioned: bool = False,
  ) -> "Response":
    """
    Add Cookie to the User Web Browser
    """
    self.set_cookie(
      key,
      value,
      max_age,
      expires,
      path,
      domain,
      secure,
      httponly,
      samesite,
      partitioned,
    )
    return self
