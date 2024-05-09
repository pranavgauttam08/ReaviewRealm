import logging

FMT = "[{levelname: ^2}]: shourya's-{name}: {message}"
FORMATS = {
    logging.DEBUG: FMT,
    logging.INFO: f"\33[36m{ FMT}\33[0m",
    logging.WARNING: "\33[33m{ FMT}\33[0m",
    logging.ERROR: f"\33[31m{ FMT}\33[0m",
    logging.CRITICAL: f"\33[1m\33[31m{FMT}\33[0m",
}


class CustomFormatter(logging.Formatter):
    """Custom Colored Logger for stuff!"""

    def format(self, record):
        log_fmt = FORMATS[record.levelno]
        formatter = logging.Formatter(log_fmt, style="{")
        return formatter.format(record)


handler = logging.StreamHandler()
handler.setFormatter(CustomFormatter())
logging.basicConfig(
    level=logging.INFO,
    handlers=[handler],
)

log = logging.getLogger("backend-logger")
