import asyncio
import json
from typing import Any
from core import settings, logger


class RabbitMQ:
  """
  Message queue client which stores deployment jobs.

  The connection is created lazily (on the first publish) so the API can
  boot even when the AMQP server or the client library is unavailable.
  """

  def __init__(self, uri: str | None = None, queue: str = "deployment"):
    self.__uri = uri or settings.RABBITMQ_URI
    self.__queue_name = queue
    self.__lock = asyncio.Lock()
    self.__connection: Any = None
    self.__channel: Any = None

  @property
  def queue_name(self) -> str:
    return self.__queue_name

  async def connect(self):
    """
    Creates the connection, channel and the durable queue (idempotent)
    """
    from aio_pika import connect_robust

    if self.__channel is not None and not self.__channel.is_closed:
      return

    async with self.__lock:
      if self.__channel is not None and not self.__channel.is_closed:
        return

      self.__connection = await connect_robust(self.__uri)
      self.__channel = await self.__connection.channel()
      _ = await self.__channel.declare_queue(self.__queue_name, durable=True)
      logger.LOGGER.debug("Connected to Message Queue (RabbitMQ) Server")

  async def publish(self, payload: dict[str, Any]):
    """
    Publishes a persistent JSON message to the deployment queue
    """
    from aio_pika import DeliveryMode, Message

    await self.connect()

    message = Message(
      body=json.dumps(payload, default=str).encode(),
      content_type="application/json",
      delivery_mode=DeliveryMode.PERSISTENT,
    )
    _ = await self.__channel.default_exchange.publish(
      message, routing_key=self.__queue_name
    )

  async def close(self):
    """
    Closes the channel and the connection gracefully
    """
    if self.__channel is not None and not self.__channel.is_closed:
      await self.__channel.close()

    if self.__connection is not None and not self.__connection.is_closed:
      await self.__connection.close()

    self.__channel = None
    self.__connection = None
