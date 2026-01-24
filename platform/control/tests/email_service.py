from utils.email import email


class DummyEmailService(email.Email):
  async def send(self, toEmail: str, subject: str, body: str | email.Template) -> bool:
    return True

  async def close(self):
    return
