import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )


def update_monthly_features(cursor):

    cursor.execute("""
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

        SELECT
            YEAR(feature_date),
            MONTH(feature_date),
            feature_name,

            SUM(out_count),
            SUM(in_count),
            SUM(denied_count),
            SUM(queued_count),
            SUM(dequeued_count),

            MAX(peak_concurrent),

            MAX(unique_users)

        FROM daily_msc_features

        GROUP BY
            YEAR(feature_date),
            MONTH(feature_date),
            feature_name

        ON DUPLICATE KEY UPDATE

            out_count = VALUES(out_count),
            in_count = VALUES(in_count),
            denied_count = VALUES(denied_count),
            queued_count = VALUES(queued_count),
            dequeued_count = VALUES(dequeued_count),
            peak_concurrent = VALUES(peak_concurrent),
            unique_users = VALUES(unique_users)
    """)


def update_monthly_modules(cursor):

    cursor.execute("""
        INSERT INTO monthly_msc_modules
        (
            year,
            month,
            module_name,
            out_count,
            in_count,
            denied_count,
            queued_count,
            dequeued_count,
            peak_concurrent,
            unique_users
        )

        SELECT
            YEAR(module_date),
            MONTH(module_date),
            module_name,

            SUM(out_count),
            SUM(in_count),
            SUM(denied_count),
            SUM(queued_count),
            SUM(dequeued_count),

            MAX(peak_concurrent),

            MAX(unique_users)

        FROM daily_msc_modules

        GROUP BY
            YEAR(module_date),
            MONTH(module_date),
            module_name

        ON DUPLICATE KEY UPDATE

            out_count = VALUES(out_count),
            in_count = VALUES(in_count),
            denied_count = VALUES(denied_count),
            queued_count = VALUES(queued_count),
            dequeued_count = VALUES(dequeued_count),
            peak_concurrent = VALUES(peak_concurrent),
            unique_users = VALUES(unique_users)
    """)


def main():

    conn = get_connection()
    cursor = conn.cursor()

    try:

        print("Updating monthly feature summary...")
        update_monthly_features(cursor)

        print("Updating monthly module summary...")
        update_monthly_modules(cursor)

        conn.commit()

        print("--------------------------------")
        print("Monthly aggregation completed.")
        print("--------------------------------")

    except Exception as e:

        conn.rollback()
        print(e)

    finally:

        cursor.close()
        conn.close()


if __name__ == "__main__":
    main()