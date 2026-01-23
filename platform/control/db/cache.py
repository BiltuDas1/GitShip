from abc import ABC, abstractmethod


class Cache(ABC):
  @abstractmethod
  async def set(self, key: str, value: str, expire_after: int | None = None):
    pass

  @abstractmethod
  async def setExpiry(self, key: str, expire_at: int):
    pass

  @abstractmethod
  async def get(self, key: str) -> str | None:
    pass

  @abstractmethod
  async def remove(self, key: str):
    pass

  @abstractmethod
  async def close(self):
    pass

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
