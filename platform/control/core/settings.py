from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from tortoise import Tortoise
from . import environ, debug
from contextlib import asynccontextmanager
from utils import email, eddsa
import db


DB_URI = environ.ENV.get("POSTGRESQL_URI")

# Frontend Settings
FRONTEND_URL = environ.ENV.get("FRONTEND_URL") or "http://127.0.0.1:5173"

# EdDSA Key
if (key := environ.ENV.get("EDDSA_PRIVATE_KEY")) is not None:
  EDDSA_KEY = eddsa.EdDSA(key)
  del key
else:
  raise EnvironmentError("EDDSA_PRIVATE_KEY is not set")

# User Token
REFRESH_TOKEN_EXPIRY = 3 * 24 * 60 * 60  # 3 Days
ACCESS_TOKEN_EXPIRY = 10 * 60  # 10 Minutes


def InitializeORM(app: FastAPI):
  register_tortoise(
    app,
    db_url=DB_URI,
    modules={"models": ["models"]},
    generate_schemas=debug.DEBUG,  # Creates tables automatically (Dev only)
    add_exception_handlers=False,  # Automatically handles some DB errors
  )


@asynccontextmanager
async def APILifespan(app: FastAPI):
  yield  # All API tasks are here

  print("Closing connection of Email Server...", end="")
  await email.EMAIL.close()
  print("Done")
  print("Closing connection of Database Server...", end="")
  await Tortoise.close_connections()
  print("Done")
  print("Closing connection of Caching Server...", end="")
  await db.CACHE.close()
  print("Done")
