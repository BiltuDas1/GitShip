from abc import ABC, abstractmethod
from utils.template import Template


class Email(ABC):
  @abstractmethod
  async def send(self, toEmail: str, subject: str, body: str | Template) -> bool:
    """
    Sends an Email

    :param toEmail: The email address where the mail will be send
    :type toEmail: str
    :param subject: The subject of the email
    :type subject: str
    :param body: The body of the email
    :type body: str | Template
    :return: If email sending successful, then return True, otherwise False
    :rtype: bool
    """

  @abstractmethod
  async def close(self):
    """
    Close the underlying connection with the server
    """
