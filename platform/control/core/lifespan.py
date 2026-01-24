from fastapi import FastAPI
from contextlib import asynccontextmanager
from tortoise import Tortoise
from utils import email
from . import logger
import db


@asynccontextmanager
async def APILifespan(app: FastAPI):
  yield  # All API tasks are here

  await email.EMAIL.close()
  logger.LOGGER.debug("Closed connection of Email Server")
  await Tortoise.close_connections()
  logger.LOGGER.debug("Closed connection of Database Server")
  await db.CACHE.close()
  logger.LOGGER.debug("Closed connection of Cache Server")
  await db.AUTH_STORAGE.close()
  logger.LOGGER.debug("Closed connection of Auth Storage (Cache) Server")
