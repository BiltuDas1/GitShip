import bcrypt


def hash_password(password: str) -> str:
  """
  Converts plaintext password to a secure hash.
  """
  return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
  """
  Checks if a plaintext password matches the stored hash.
  """
  return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
