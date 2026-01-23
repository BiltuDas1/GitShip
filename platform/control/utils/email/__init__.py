from .email import Email
from .brevo import BrevoEmail
from core import settings

EMAIL: Email = BrevoEmail(
  api_key=settings.BREVO_API_KEY,
  sender_email=settings.SENDER_EMAIL,
  sender_name=settings.SENDER_NAME,
)
