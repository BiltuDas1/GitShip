from .html_template import HTMLTemplate
from dataclasses import dataclass, asdict


@dataclass
class EmailVerify(HTMLTemplate):
  verification_link: str
  firstname: str
  feedback_email: str

  def __post_init__(self):
    super().__init__(html_file="email_verify.html", **asdict(self))
