import os


class Env:
  """
  Class which stores all the environment variables
  """

  def __init__(self):
    self.__env: dict[str, str | None] = {}
    try:
      import dotenv

      dotenv.dotenv_values()
    except Exception:
      pass

    self.__env = dict(os.environ)

  def get(self, key: str) -> str | None:
    """
    Gets the environment from the key name, if it doesn't exist then return None
    """
    return self.__env.get(key)

  def exist(self, key: str) -> bool:
    """
    Checks if the environment variable exist or not
    """
    if key in self.__env:
      return True
    else:
      return False


ENV = Env()
