import pytest
from models import User
from httpx import AsyncClient
from core import logger
from tortoise import Tortoise


@pytest.mark.asyncio
class TestLogin:
  email = "test@gmail.com"
  password = "HelloWorld@123"

  async def test_login_success(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post(
      "/users/login", json={"email": self.email, "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 200
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies
    assert json_data["status"] is True
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2

  async def test_login_wrong_password(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post(
      "/users/login", json={"email": self.email, "password": "HelloWorld@124"}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert "access_token" not in response.cookies
    assert "refresh_token" not in response.cookies
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2

  async def test_login_wrong_email(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post(
      "/users/login", json={"email": "example@gmail.com", "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert "access_token" not in response.cookies
    assert "refresh_token" not in response.cookies
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2

  async def test_login_no_email(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post("/users/login", json={"password": self.password})

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "email" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_no_password(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post("/users/login", json={"email": self.email})

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "password" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_empty_request(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post("/users/login")

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "email" in json_data["errors"]
    assert "password" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_empty_json(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post("/users/login", json={})

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "email" in json_data["errors"]
    assert "password" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_invalid_email_format(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post(
      "/users/login", json={"email": "gmail.com", "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "email" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_empty_fields(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post("/users/login", json={"email": "", "password": ""})

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "email" in json_data["errors"]
    assert "password" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_unicode(self, client: AsyncClient):
    unicode_email = "🚀user@gmail.com"
    unicode_pass = "Pásswörd!@#🔥"

    await User.create(
      firstname="Test",
      lastname="User",
      email=unicode_email,
      password=unicode_pass,
      is_active=True,
    )

    response = await client.post(
      "/users/login", json={"email": unicode_email, "password": unicode_pass}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 200
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies
    assert json_data["status"] is True
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2

  async def test_login_inactive_user(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=False,
    )

    response = await client.post(
      "/users/login", json={"email": self.email, "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert "access_token" not in response.cookies
    assert "refresh_token" not in response.cookies
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2

  async def test_login_large_email(self, client: AsyncClient):
    large_prefix = "a" * (1024 * 1024)  # 1 MiB large string
    monster_email = f"{large_prefix}@gmail.com"

    response = await client.post(
      "/users/login", json={"email": monster_email, "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "email" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_large_password(self, client: AsyncClient):
    large_password = "a" * (1024 * 1024)  # 1MiB

    response = await client.post(
      "/users/login", json={"email": self.email, "password": large_password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "password" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_js_injection(self, client: AsyncClient):
    code = "<script>alert('Hello World!')</script>"

    response = await client.post(
      "/users/login", json={"email": code, "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert "email" in json_data["errors"]
    assert len(json_data) == 3

  async def test_login_wrong_case(self, client: AsyncClient):
    await User.create(
      firstname="Test",
      lastname="User",
      email=self.email,
      password=self.password,
      is_active=True,
    )

    response = await client.post(
      "/users/login", json={"email": self.email.upper(), "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 200
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies
    assert json_data["status"] is True
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2

  async def test_login_database_unavailable(self, client: AsyncClient):
    await Tortoise.close_connections()

    response = await client.post(
      "/users/login", json={"email": self.email, "password": self.password}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 500
    assert "access_token" not in response.cookies
    assert "refresh_token" not in response.cookies
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2

  async def test_login_sql_injection(self, client: AsyncClient):
    query = "' Or '1'='1"

    response = await client.post(
      "/users/login", json={"email": self.email, "password": query}
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert "access_token" not in response.cookies
    assert "refresh_token" not in response.cookies
    assert json_data["status"] is False
    assert (
      "invalid" in json_data["message"].lower()
      or "wrong" in json_data["message"].lower()
    )
    assert len(json_data) == 2
