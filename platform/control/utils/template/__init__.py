from . import types


class Template:
  """
  Template class loads the specific pre defined templates and return string
  """

  def __init__(self, template: types.HTMLTemplate):
    template._load()
    self.__html = template._replace()

  def __str__(self) -> str:
    return self.__html
