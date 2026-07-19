import os
import time
from datetime import datetime

from pygtail import Pygtail

from config import LOG_BASE_DIR
from parser import parse_log_line
from db import insert_log


def get_today_log_path():
    """
    Returns today's log file path.
    Assumes today's folder contains exactly one log file.
    """

    today = datetime.now().strftime("%Y-%m-%d")

    today_folder = os.path.join(LOG_BASE_DIR, today)

    if not os.path.exists(today_folder):
        raise FileNotFoundError(
            f"Today's log folder not found: {today_folder}"
        )

    files = [
        f for f in os.listdir(today_folder)
        if os.path.isfile(os.path.join(today_folder, f))
    ]

    if len(files) != 1:
        raise Exception(
            f"Expected one log file in {today_folder}, found {len(files)}"
        )

    return os.path.join(today_folder, files[0])


def process_new_logs():

    log_path = get_today_log_path()

    print(f"Watching: {log_path}")

    while True:

        try:

            for line in Pygtail(log_path):

                parsed = parse_log_line(line)

                if parsed:

                    insert_log(
                        parsed["event_date"],
                        parsed["event_time"],
                        parsed["event_type"],
                        parsed["feature_name"],
                        parsed["username"],
                        parsed["hostname"],
                    )

                    print(
                        f"Inserted: {parsed['feature_name']} "
                        f"{parsed['event_type']}"
                    )

        except Exception as e:
            print(e)

        time.sleep(2)


if __name__ == "__main__":
    process_new_logs()