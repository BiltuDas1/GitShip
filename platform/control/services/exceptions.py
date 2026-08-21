class EmailConfigurationError(Exception):
  """
  Exception class when email server is not working properly
  """


class UserAlreadyExist(Exception):
  """
  Exception class for user not exist
  """


class TokenAlreadyExist(Exception):
  """
  Exception class for verification token existance
  """
