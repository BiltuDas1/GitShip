import os
from pathlib import Path
from jinja2 import Template


class HTMLTemplate:
  """
  It holds the HTML Template and it's information
  """

  _CACHE: dict[Path, Template] = {}  # Global Cache

  def __init__(self, html_file: str, **params):
    current_path = Path(__file__).resolve().parent
    self.__template_path = current_path.joinpath("html", html_file)
    if not os.path.isfile(self.__template_path):
      raise FileNotFoundError(f"{self.__template_path} not found")

    self.__params = params

  def _load(self):
    """
    Loads the HTML data into global cache if it is not present
    """
    if self.__template_path in HTMLTemplate._CACHE:
      return

    with open(self.__template_path, "r") as f:
      HTMLTemplate._CACHE[self.__template_path] = Template(f.read())

  def _replace(self) -> str:
    """
    Replaces the variables inside the HTML document
    """
    self._load()
    return HTMLTemplate._CACHE[self.__template_path].render(self.__params)
