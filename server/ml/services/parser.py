import re
from datetime import datetime

# ----------------------------------------
# Regex Patterns
# ----------------------------------------

timestamp_pattern = re.compile(
    r'^(\d{1,2}:\d{2}:\d{2})\s+\(([^)]+)\)\s+TIMESTAMP\s+(\d{1,2}/\d{1,2}/\d{4})'
)

event_pattern = re.compile(
    r'^(\d{1,2}:\d{2}:\d{2})\s+\(([^)]+)\)\s+([A-Z_]+):\s+"([^"]+)"\s+([^@]+)@([^\s]+)'
)

# ----------------------------------------
# Allowed Event Types
# ----------------------------------------

ALLOWED_EVENTS = {
    "OUT",
    "IN",
    "DENIED",
    "QUEUED",
    "DEQUEUED",
}

# ----------------------------------------
# Current Date
# ----------------------------------------

current_date = None


# ----------------------------------------
# Parse One Log Line
# ----------------------------------------

def parse_log_line(line):
    """
    Parses one log line.

    Returns:
        None -> if line should be ignored

        dict -> if valid event
    """

    global current_date

    line = line.strip()

    # ------------------------------------
    # Timestamp Line
    # ------------------------------------

    ts = timestamp_pattern.match(line)

    if ts:

        current_date = datetime.strptime(
            ts.group(3),
            "%m/%d/%Y"
        ).date()

        return None

    # ------------------------------------
    # Event Line
    # ------------------------------------

    event = event_pattern.match(line)

    if not event:
        return None

    event_time = event.group(1)

    event_type = event.group(3)

    if event_type not in ALLOWED_EVENTS:
        return None

    feature_name = event.group(4).strip()

    username = event.group(5).strip()

    hostname = event.group(6).strip()

    return {
        "event_date": current_date,
        "event_time": event_time,
        "event_type": event_type,
        "feature_name": feature_name,
        "username": username,
        "hostname": hostname,
    }


# ----------------------------------------
# Parse Complete File (Optional)
# ----------------------------------------

def parse_log_file(file_path):
    """
    Reads an entire log file and returns
    all parsed log entries.
    """

    parsed_logs = []

    with open(file_path, "r", errors="ignore") as logfile:

        for line in logfile:

            data = parse_log_line(line)

            if data:
                parsed_logs.append(data)

    return parsed_logs