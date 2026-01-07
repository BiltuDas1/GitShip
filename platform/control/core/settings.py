from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from tortoise import Tortoise
from . import environ, debug
from contextlib import asynccontextmanager


ENV = environ.Env()
DB_URI = ENV.get("POSTGRESQL_URI")


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

  await Tortoise.close_connections()
