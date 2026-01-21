from .cache import Cache
from .redis import Redis
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
from core import debug

CACHE: Cache = Redis()


def InitializeORM(app: FastAPI, db_uri: str):
  register_tortoise(
    app,
    db_url=db_uri,
    modules={"models": ["models"]},
    generate_schemas=debug.DEBUG,  # Creates tables automatically (Dev only)
    add_exception_handlers=False,  # Automatically handles some DB errors
  )
