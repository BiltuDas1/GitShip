from fastapi import FastAPI
from tortoise import Tortoise
from . import environ, debug, logger
from contextlib import asynccontextmanager
from utils import email, eddsa
import db


# PostGredSQL Settings
if not environ.ENV.exist("POSTGRESQL_URL"):
  raise EnvironmentError("POSTGRESQL_URL can't be empty")
DB_URI = str(environ.ENV.get("POSTGRESQL_URI"))

# Redis Settings
if not environ.ENV.exist("REDIS_URI"):
  raise EnvironmentError("REDIS_URI can't be empty")
REDIS_URI = str(environ.ENV.get("REDIS_URI"))

# Frontend Settings
if (not debug.DEBUG) and (not environ.ENV.exist("FRONTEND_URL")):
  raise EnvironmentError("FRONTEND_URL can't be empty")
FRONTEND_URL = environ.ENV.get("FRONTEND_URL") or "http://127.0.0.1:5173"

# EdDSA Key
if not environ.ENV.exist("EDDSA_PRIVATE_KEY"):
  raise EnvironmentError("EDDSA_PRIVATE_KEY can't be empty")
EDDSA_KEY = eddsa.EdDSA(str(environ.ENV.get("EDDSA_PRIVATE_KEY")))

# User Token
REFRESH_TOKEN_EXPIRY = 3 * 24 * 60 * 60  # 3 Days
ACCESS_TOKEN_EXPIRY = 10 * 60  # 10 Minutes


@asynccontextmanager
async def APILifespan(app: FastAPI):
  yield  # All API tasks are here

  await email.EMAIL.close()
  logger.LOGGER.debug("Closed connection of Email Server")
  await Tortoise.close_connections()
  logger.LOGGER.debug("Closed connection of Database Server")
  await db.CACHE.close()
  logger.LOGGER.debug("Closed connection of Cache Server")
