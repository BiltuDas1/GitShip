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


class DeploymentFailed(Exception):
  """
  Exception class when a deployment can't be stored in the database
  """


class MessageQueueUnavailable(Exception):
  """
  Exception class when the message queue server is not working properly
  """
