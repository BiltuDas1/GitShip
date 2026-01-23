import redis.asyncio as redis
from . import cache
from core import settings


class Redis(cache.Cache):
  def __init__(self):
    self.__conn_pool = redis.ConnectionPool.from_url(
      url=settings.REDIS_URI, decode_responses=True
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

  async def add_token(self, jti: str, user_id: str, expire_at: int):
    key = f"refresh_token:{jti}"
    await self.__client.set(name=key, value=user_id, exat=expire_at)

  async def get_id(self, jti: str) -> str | None:
    key = f"refresh_token:{jti}"
    return await self.__client.get(key)

  async def remove_token(self, jti: str):
    key = f"refresh_token:{jti}"
    await self.__client.delete(key)

  async def update_token(self, old_jti: str, new_jti: str, new_expiry_at: int) -> bool:
    if not (await self.__client.renamenx(old_jti, new_jti)):
      return False
    await self.__client.expireat(name=new_jti, when=new_expiry_at)
    return True
