from core import environ


def load_fake_environment():
  environ.ENV.update(
    {
      "POSTGRESQL_URI": "sqlite://:memory:",
      "REDIS_URI": "redis://localhost:6379",
      "BREVO_API_KEY": "xkeysib-1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef-dummy",  # gitleaks:allow
      "SENDER_EMAIL": "gitship@gmail.com",
      "SENDER_NAME": "GitShip Test",
      "FRONTEND_URL": "http://gitship.localhost",
      "EDDSA_PRIVATE_KEY": """-----BEGIN PRIVATE KEY-----
        MC4CAQAwBQYDK2VwBCIEIF6K3m4WM7/yMA9COn6HYyx7PjJCIzY7bnBoKupYgdTL
        -----END PRIVATE KEY-----""",  # gitleaks:allow
    }
  )
