import httpx
from core import settings
from email_validator import validate_email
from utils.template import Template
from .email import Email


class BrevoEmail(Email):
  """
  Class to Interact with Brevo Email
  """

  def __init__(self):
    if (api_key := settings.ENV.get("BREVO_API_KEY")) is not None and len(api_key) > 0:
      self.__api_key = api_key
    else:
      raise EnvironmentError("BREVO_API_KEY is not set")

    if (sender_email := settings.ENV.get("SENDER_EMAIL")) is not None and len(
      sender_email
    ) > 0:
      self.__sender_email = validate_email(sender_email).normalized
    else:
      raise EnvironmentError("SENDER_EMAIL is not set")

    if (sender_name := settings.ENV.get("SENDER_NAME")) is not None and len(
      sender_name
    ) > 0:
      self.__sender_name = sender_name
    else:
      raise EnvironmentError("SENDER_NAME is not set")

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
