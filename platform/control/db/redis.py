import redis.asyncio as redis
from . import cache
from core import environ


class Redis(cache.Cache):
  def __init__(self):
    if (cache_uri := environ.ENV.get("REDIS_URI")) is None:
      raise EnvironmentError("REDIS_URI can't be empty")

    self.__conn_pool = redis.ConnectionPool.from_url(
      url=cache_uri, decode_responses=True
    )
    self.__client = redis.Redis(connection_pool=self.__conn_pool)

  async def set(self, key: str, value: str, expire_after: int | None = None):
    if expire_after:
      await self.__client.setex(name=key, value=value, time=expire_after)
    else:
      await self.__client.set(name=key, value=value)

  async def setExpiry(self, key: str, expire_at: int):
    await self.__client.expireat(name=key, when=expire_at)

  async def get(self, key: str) -> str | None:
    return await self.__client.get(key)

  async def remove(self, key: str):
    await self.__client.delete(key)

  async def close(self):
    await self.__client.aclose(close_connection_pool=True)
