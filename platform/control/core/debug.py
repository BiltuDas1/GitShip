import os
from . import environ


# If .env file exist then it's development Environment
DEBUG = False
if os.path.isfile(".env"):
  DEBUG = True
if not environ.ENV.exist("PRODUCTION"):
  DEBUG = True
