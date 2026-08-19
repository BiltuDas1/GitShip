from cryptography.hazmat.primitives.asymmetric.ed25519 import (
  Ed25519PrivateKey,
  Ed25519PublicKey,
)
from cryptography.hazmat.primitives import serialization
from typing import cast
import base64


class EdDSA:
  def __init__(self, pem_data_base64: str):
    private_key = serialization.load_pem_private_key(
      base64.b64decode(pem_data_base64), 
      password=None
    )
    self.__private_key = cast(Ed25519PrivateKey, private_key)
    self.__public_key = self.__private_key.public_key()

  def private_key(self) -> Ed25519PrivateKey:
    """
    Returns the EdDSA Private Key

    :return: Description
    :rtype: Ed25519PrivateKey
    """
    return self.__private_key

  def public_key(self) -> Ed25519PublicKey:
    """
    Returns the EdDSA Public Key

    :return: Description
    :rtype: Ed25519PublicKey
    """
    return self.__public_key
