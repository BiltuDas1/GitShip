from .html_template import HTMLTemplate
from dataclasses import dataclass, asdict
from utils import datetime


@dataclass
class EmailVerify(HTMLTemplate):
  verification_link: str
  firstname: str
  feedback_email: str

  def __post_init__(self):
    super().__init__(html_file="email_verify.html", **asdict(self))


@dataclass
class ResetPassword(HTMLTemplate):
  Seconds = int

  firstname: str
  reset_link: str
  expire_in: Seconds

  def __post_init__(self):
    super().__init__(
      html_file="reset_password.html",
      firstname=self.firstname,
      reset_link=self.reset_link,
      expire_time=datetime.seconds_to_readable(self.expire_in),
    )
