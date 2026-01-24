from . import helper

helper.load_fake_environment()

import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock
from tortoise import Tortoise
import db
from main import app
import fakeredis
from utils import email
from . import email_service


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
  """
  Initializes the in-memory SQLite database for the entire test session.
  """
  await Tortoise.init(
    db_url="sqlite://:memory:", modules={"models": ["models"]}
  )  # gitleaks:allow
  await Tortoise.generate_schemas()

  # Fake Redis
  cache = db.Redis.__new__(db.Redis)
  cache._set_client(fakeredis.FakeAsyncRedis())
  authstorage = db.RedisAuthStorage.__new__(db.RedisAuthStorage)
  authstorage._set_client(fakeredis.FakeAsyncRedis())

  # Overriding the Clients
  db.CACHE = cache
  db.AUTH_STORAGE = authstorage

  # Overriding Email Client
  email.EMAIL = email_service.DummyEmailService()

  yield

  await Tortoise.close_connections()
  await db.CACHE.close()
  await db.AUTH_STORAGE.close()


@pytest_asyncio.fixture
async def client():
  """
  Provides an HTTP client for testing and mocks the Redis storage.
  """
  # Mock Redis components to avoid 'Connection Error' during tests
  db.CACHE = AsyncMock()
  db.AUTH_STORAGE = AsyncMock()

  # We use ASGITransport to talk directly to the FastAPI app code
  async with AsyncClient(
    transport=ASGITransport(app=app), base_url="http://test"
  ) as ac:
    yield ac
