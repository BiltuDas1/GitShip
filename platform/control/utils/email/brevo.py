import httpx
from email_validator import validate_email
from utils.template import Template
from .email import Email


class BrevoEmail(Email):
  """
  Class to Interact with Brevo Email
  """

  def __init__(self, api_key: str, sender_email: str, sender_name: str):
    self.__api_key = api_key
    self.__sender_email = validate_email(sender_email).normalized
    self.__sender_name = sender_name

    self.__http = httpx.AsyncClient()

  async def send(self, toEmail: str, subject: str, body: str | Template) -> bool:
    try:
      response = await self.__http.post(
        url="https://api.brevo.com/v3/smtp/email",
        json={
          "sender": {"name": self.__sender_name, "email": self.__sender_email},
          "to": [{"email": toEmail}],
          "subject": subject,
          "htmlContent": str(body),
        },
        headers={
          "accept": "application/json",
          "api-key": self.__api_key,
        },
      )
      return response.status_code == 201
    except Exception:
      return False

  async def close(self):
    await self.__http.aclose()
