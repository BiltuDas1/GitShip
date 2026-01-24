import pytest
from models import User
from httpx import AsyncClient


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

    assert response.status_code == 200
    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies
