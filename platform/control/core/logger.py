import logging
import debug


LOGGER = logging.getLogger("gitship_logger")

# If Debugging Environment then Show Debug logs and up
# Otherwise show warning level or up
c_handler = logging.StreamHandler()
c_handler.setLevel(logging.DEBUG if debug.DEBUG else logging.WARNING)
LOGGER.addHandler(c_handler)
