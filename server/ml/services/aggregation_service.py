from db import get_connection

def update_daily():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM MSC_logs
        ORDER BY event_date, feature_name, event_time
    """)

    rows = cursor.fetchall()

    summary = {}

    for row in rows:

        key = (
            row["event_date"],
            row["feature_name"]
        )

        if key not in summary:

            summary[key] = {
                "out": 0,
                "in": 0,
                "denied": 0,
                "queued": 0,
                "dequeued": 0,
                "current": 0,
                "peak": 0,
                "users": set(),
            }

        event = row["event_type"]

        if event == "OUT":

            summary[key]["out"] += 1
            summary[key]["current"] += 1

            if summary[key]["current"] > summary[key]["peak"]:
                summary[key]["peak"] = summary[key]["current"]

        elif event == "IN":

            summary[key]["in"] += 1

            if summary[key]["current"] > 0:
                summary[key]["current"] -= 1

        elif event == "DENIED":

            summary[key]["denied"] += 1

        elif event == "QUEUED":

            summary[key]["queued"] += 1

        elif event == "DEQUEUED":

            summary[key]["dequeued"] += 1

        summary[key]["users"].add(row["username"])

    query = """
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
    (
        %s,%s,%s,%s,%s,%s,%s,%s,%s
    )

    ON DUPLICATE KEY UPDATE

        out_count = VALUES(out_count),
        in_count = VALUES(in_count),
        denied_count = VALUES(denied_count),
        queued_count = VALUES(queued_count),
        dequeued_count = VALUES(dequeued_count),
        peak_concurrent = VALUES(peak_concurrent),
        unique_users = VALUES(unique_users)
    """

    for key, value in summary.items():

        feature_date, feature_name = key

        cursor.execute(
            query,
            (
                feature_date,
                feature_name,
                value["out"],
                value["in"],
                value["denied"],
                value["queued"],
                value["dequeued"],
                value["peak"],
                len(value["users"]),
            ),
        )

    conn.commit()

    cursor.close()
    conn.close()

    print("✅ Daily aggregation completed.")

def update_weekly():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM MSC_logs
        ORDER BY event_date, feature_name, event_time
    """)

    rows = cursor.fetchall()

    summary = {}

    for row in rows:

        year, week, _ = row["event_date"].isocalendar()

        key = (
            year,
            week,
            row["feature_name"]
        )

        if key not in summary:

            summary[key] = {
                "out": 0,
                "in": 0,
                "denied": 0,
                "queued": 0,
                "dequeued": 0,
                "current": 0,
                "peak": 0,
                "users": set(),
            }

        event = row["event_type"]

        if event == "OUT":

            summary[key]["out"] += 1
            summary[key]["current"] += 1
            summary[key]["peak"] = max(
                summary[key]["peak"],
                summary[key]["current"]
            )

        elif event == "IN":

            summary[key]["in"] += 1

            if summary[key]["current"] > 0:
                summary[key]["current"] -= 1

        elif event == "DENIED":
            summary[key]["denied"] += 1

        elif event == "QUEUED":
            summary[key]["queued"] += 1

        elif event == "DEQUEUED":
            summary[key]["dequeued"] += 1

        summary[key]["users"].add(row["username"])

    query = """
    INSERT INTO weekly_msc_features
    (
        year,
        week,
        feature_name,
        out_count,
        in_count,
        denied_count,
        queued_count,
        dequeued_count,
        peak_concurrent,
        unique_users
    )
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)

    ON DUPLICATE KEY UPDATE

        out_count = VALUES(out_count),
        in_count = VALUES(in_count),
        denied_count = VALUES(denied_count),
        queued_count = VALUES(queued_count),
        dequeued_count = VALUES(dequeued_count),
        peak_concurrent = VALUES(peak_concurrent),
        unique_users = VALUES(unique_users)
    """

    for key, value in summary.items():

        year, week, feature_name = key

        cursor.execute(
            query,
            (
                year,
                week,
                feature_name,
                value["out"],
                value["in"],
                value["denied"],
                value["queued"],
                value["dequeued"],
                value["peak"],
                len(value["users"]),
            ),
        )

    conn.commit()

    cursor.close()
    conn.close()

    print("✅ Weekly aggregation completed.")

def update_monthly():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM MSC_logs
        ORDER BY event_date, feature_name, event_time
    """)

    rows = cursor.fetchall()

    summary = {}

    for row in rows:

        year = row["event_date"].year
        month = row["event_date"].month

        key = (
            year,
            month,
            row["feature_name"]
        )

        if key not in summary:

            summary[key] = {
                "out": 0,
                "in": 0,
                "denied": 0,
                "queued": 0,
                "dequeued": 0,
                "current": 0,
                "peak": 0,
                "users": set(),
            }

        event = row["event_type"]

        if event == "OUT":

            summary[key]["out"] += 1
            summary[key]["current"] += 1
            summary[key]["peak"] = max(
                summary[key]["peak"],
                summary[key]["current"]
            )

        elif event == "IN":

            summary[key]["in"] += 1

            if summary[key]["current"] > 0:
                summary[key]["current"] -= 1

        elif event == "DENIED":
            summary[key]["denied"] += 1

        elif event == "QUEUED":
            summary[key]["queued"] += 1

        elif event == "DEQUEUED":
            summary[key]["dequeued"] += 1

        summary[key]["users"].add(row["username"])

    query = """
    INSERT INTO monthly_msc_features
    (
        year,
        month,
        feature_name,
        out_count,
        in_count,
        denied_count,
        queued_count,
        dequeued_count,
        peak_concurrent,
        unique_users
    )
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)

    ON DUPLICATE KEY UPDATE

        out_count = VALUES(out_count),
        in_count = VALUES(in_count),
        denied_count = VALUES(denied_count),
        queued_count = VALUES(queued_count),
        dequeued_count = VALUES(dequeued_count),
        peak_concurrent = VALUES(peak_concurrent),
        unique_users = VALUES(unique_users)
    """

    for key, value in summary.items():

        year, month, feature_name = key

        cursor.execute(
            query,
            (
                year,
                month,
                feature_name,
                value["out"],
                value["in"],
                value["denied"],
                value["queued"],
                value["dequeued"],
                value["peak"],
                len(value["users"]),
            ),
        )

    conn.commit()

    cursor.close()
    conn.close()

    print("✅ Monthly aggregation completed.")

    if __name__ == "__main__":

        update_daily()
        update_weekly()
        update_monthly()