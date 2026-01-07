import string


def check_password(password: str) -> bool:
  """
  This function takes password as input and then check if the password is following the rule or not
    - At least One Uppercase Character
    - At least One Lowercase Character
    - At least One Number
    - At least One Special Character
  Returns True if it is following the rule, otherwise False
  """
  has_upper = any(c.isupper() for c in password)
  has_lower = any(c.islower() for c in password)
  has_nums = any(c.isdigit() for c in password)
  # string.punctuation is a pre-defined string of all special chars
  has_special = any(c in string.punctuation for c in password)

  return all([has_upper, has_lower, has_nums, has_special])
