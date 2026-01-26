import pytest
from models import User
from httpx import AsyncClient
from core import logger


@pytest.mark.asyncio
class TestRegister:
  firstname = "Test"
  lastname = "User"
  email = "test@gmail.com"
  password = "HelloWorld@123"

  async def test_register_success(self, client: AsyncClient):
    response = await client.post(
      "/users/register",
      json={
        "firstname": self.firstname,
        "lastname": self.lastname,
        "email": self.email,
        "password": self.password,
      },
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 200
    assert json_data["status"] is True
    assert len(json_data["message"]) > 0
    assert "data" in json_data
    assert len(json_data) == 3

  async def test_register_already_exist(self, client: AsyncClient):
    await User.create(
      firstname=self.firstname,
      lastname=self.lastname,
      email=self.email,
      password=self.password,
    )

    response = await client.post(
      "/users/register",
      json={
        "firstname": self.firstname,
        "lastname": self.lastname,
        "email": self.email,
        "password": self.password,
      },
    )

    json_data = response.json()
    logger.LOGGER.debug(f"Response: {json_data}")

    assert response.status_code == 400
    assert json_data["status"] is False
    assert len(json_data["message"]) > 0
    assert len(json_data) == 2
