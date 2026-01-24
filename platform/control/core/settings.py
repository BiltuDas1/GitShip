from . import environ, debug
from utils import eddsa


# PostGredSQL Settings
if not environ.ENV.exist("POSTGRESQL_URI"):
  raise EnvironmentError("POSTGRESQL_URI can't be empty")
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

# Sender Email Address
if not environ.ENV.exist("SENDER_EMAIL"):
  raise EnvironmentError("SENDER_EMAIL can't be empty")
SENDER_EMAIL = str(environ.ENV.get("SENDER_EMAIL"))

# Sender Name
if not environ.ENV.exist("SENDER_NAME"):
  raise EnvironmentError("SENDER_NAME can't be empty")
SENDER_NAME = str(environ.ENV.get("SENDER_NAME"))

# Brevo API Key
if not environ.ENV.exist("BREVO_API_KEY"):
  raise EnvironmentError("BREVO_API_KEY can't be empty")
BREVO_API_KEY = str(environ.ENV.get("BREVO_API_KEY"))

# User Token
REFRESH_TOKEN_EXPIRY = 3 * 24 * 60 * 60  # 3 Days
ACCESS_TOKEN_EXPIRY = 10 * 60  # 10 Minutes

# Reset Password
RESET_LINK_EXPIRY = 10 * 60
