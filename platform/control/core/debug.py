import os


# If .env file exist then it's development Environment
DEBUG = False
if os.path.isfile(".env"):
  DEBUG = True
