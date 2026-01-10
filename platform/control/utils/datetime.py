def seconds_to_readable(seconds: int) -> str:
  """
  Convert seconds to human readabl format (e.g 1 hour 1 minute 2 seconds)

  :param seconds: Input as seconds
  :type seconds: int
  :return: Human readable date time format
  :rtype: str
  """
  units = {"day": 60 * 60 * 24, "hour": 60 * 60, "minute": 60}
  for unit, value in units.items():
    units[unit], seconds = divmod(seconds, value)

  result = []
  for unit, value in units.items():
    if value == 0:
      continue
    if value == 1:
      result.append(f"{value} {unit}")
    else:
      result.append(f"{value} {unit + 's'}")

  if seconds != 0:
    if seconds == 1:
      result.append(f"{seconds} second")
    else:
      result.append(f"{seconds} seconds")

  return " ".join(result)
