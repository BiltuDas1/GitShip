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
