from . import cache
from abc import ABC, abstractmethod


class AuthStorage(ABC):
  @abstractmethod
  async def add_token(self, jti: str, user_id: str, expire_at: int):
    pass

  @abstractmethod
  async def get_id(self, jti: str) -> str | None:
    pass

  @abstractmethod
  async def remove_token(self, jti: str) -> str:
    pass

  @abstractmethod
  async def update_token(self, old_jti: str, new_jti: str, new_expiry_at: int) -> bool:
    pass

  @abstractmethod
  async def close(self):
    pass

  @abstractmethod
  async def cleanall(self):
    pass
