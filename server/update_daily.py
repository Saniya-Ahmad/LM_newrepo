import os
from collections import defaultdict
from dotenv import load_dotenv
import mysql.connector

load_dotenv()


# -----------------------------
# DATABASE CONNECTION
# -----------------------------
def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )


# -----------------------------
# INITIALIZE METRICS
# -----------------------------
def init_stats():
    return {
        "out": 0,
        "in": 0,
        "denied": 0,
        "queued": 0,
        "dequeued": 0,
        "current": 0,
        "peak": 0,
        "users": set()
    }


# -----------------------------
# FETCH LOGS
# -----------------------------
def fetch_logs(cursor):

    cursor.execute("""
        SELECT
            l.event_date,
            l.event_time,
            l.feature_name,
            l.username,
            l.event_type,
            fm.module_name
        FROM MSC_logs l
        JOIN feature_mapping fm
            ON l.feature_name = fm.feature_name
        ORDER BY
            l.event_date,
            l.event_time
    """)

    return cursor.fetchall()


# -----------------------------
# PROCESS LOGS
# -----------------------------
def process_logs(rows):

    feature_summary = defaultdict(init_stats)
    module_summary = defaultdict(init_stats)

    for row in rows:

        event_date = row["event_date"]
        feature = row["feature_name"]
        module = row["module_name"]
        user = row["username"]
        event = row["event_type"]

        feature_key = (event_date, feature)
        module_key = (event_date, module)

        f = feature_summary[feature_key]
        m = module_summary[module_key]

        # Track users
        f["users"].add(user)
        m["users"].add(user)

        # -------------------------
        # OUT
        # -------------------------
        if event == "OUT":

            f["out"] += 1
            m["out"] += 1

            f["current"] += 1
            m["current"] += 1

            if f["current"] > f["peak"]:
                f["peak"] = f["current"]

            if m["current"] > m["peak"]:
                m["peak"] = m["current"]

        # -------------------------
        # IN
        # -------------------------
        elif event == "IN":

            f["in"] += 1
            m["in"] += 1

            if f["current"] > 0:
                f["current"] -= 1

            if m["current"] > 0:
                m["current"] -= 1

        # -------------------------
        # DENIED
        # -------------------------
        elif event == "DENIED":

            f["denied"] += 1
            m["denied"] += 1

        # -------------------------
        # QUEUED
        # -------------------------
        elif event == "QUEUED":

            f["queued"] += 1
            m["queued"] += 1

        # -------------------------
        # DEQUEUED
        # -------------------------
        elif event == "DEQUEUED":

            f["dequeued"] += 1
            m["dequeued"] += 1

    return feature_summary, module_summary

# -----------------------------
# SAVE FEATURE SUMMARY
# -----------------------------
def save_feature_summary(cursor, feature_summary):

    sql = """
    INSERT INTO daily_msc_features
    (
        feature_date,
        feature_name,
        out_count,
        in_count,
        denied_count,
        queued_count,
        dequeued_count,
        peak_concurrent,
        unique_users
    )
    VALUES
    (%s,%s,%s,%s,%s,%s,%s,%s,%s)

    ON DUPLICATE KEY UPDATE

        out_count=VALUES(out_count),
        in_count=VALUES(in_count),
        denied_count=VALUES(denied_count),
        queued_count=VALUES(queued_count),
        dequeued_count=VALUES(dequeued_count),
        peak_concurrent=VALUES(peak_concurrent),
        unique_users=VALUES(unique_users)
    """

    data = []

    for (event_date, feature), stats in feature_summary.items():

        data.append((
            event_date,
            feature,
            stats["out"],
            stats["in"],
            stats["denied"],
            stats["queued"],
            stats["dequeued"],
            stats["peak"],
            len(stats["users"])
        ))

    cursor.executemany(sql, data)


# -----------------------------
# SAVE MODULE SUMMARY
# -----------------------------
def save_module_summary(cursor, module_summary):

    sql = """
    INSERT INTO daily_msc_modules
    (
        module_date,
        module_name,
        out_count,
        in_count,
        denied_count,
        queued_count,
        dequeued_count,
        peak_concurrent,
        unique_users
    )
    VALUES
    (%s,%s,%s,%s,%s,%s,%s,%s,%s)

    ON DUPLICATE KEY UPDATE

        out_count=VALUES(out_count),
        in_count=VALUES(in_count),
        denied_count=VALUES(denied_count),
        queued_count=VALUES(queued_count),
        dequeued_count=VALUES(dequeued_count),
        peak_concurrent=VALUES(peak_concurrent),
        unique_users=VALUES(unique_users)
    """

    data = []

    for (event_date, module), stats in module_summary.items():

        data.append((
            event_date,
            module,
            stats["out"],
            stats["in"],
            stats["denied"],
            stats["queued"],
            stats["dequeued"],
            stats["peak"],
            len(stats["users"])
        ))

    cursor.executemany(sql, data)

# -----------------------------
# MAIN
# -----------------------------
def main():

    conn = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        print("Fetching logs...")

        rows = fetch_logs(cursor)

        print(f"Total Logs : {len(rows)}")

        print("Processing logs...")

        feature_summary, module_summary = process_logs(rows)

        print(f"Feature Records : {len(feature_summary)}")
        print(f"Module Records  : {len(module_summary)}")

        print("Saving feature summary...")

        save_feature_summary(cursor, feature_summary)

        print("Saving module summary...")

        save_module_summary(cursor, module_summary)

        conn.commit()

        print("--------------------------------")
        print("Daily aggregation completed.")
        print("--------------------------------")

    except Exception as e:

        if conn:
            conn.rollback()

        print("ERROR :", e)

    finally:

        if conn:
            conn.close()


# -----------------------------
# ENTRY POINT
# -----------------------------
if __name__ == "__main__":
    main()