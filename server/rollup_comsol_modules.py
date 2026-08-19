import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )


def ensure_tables(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS daily_comsol_modules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            module_date DATE NOT NULL,
            module_name VARCHAR(150) NOT NULL,
            out_count INT DEFAULT 0,
            in_count INT DEFAULT 0,
            denied_count INT DEFAULT 0,
            queued_count INT DEFAULT 0,
            dequeued_count INT DEFAULT 0,
            peak_concurrent INT DEFAULT 0,
            unique_users INT DEFAULT 0,
            UNIQUE KEY uniq_date_module (module_date, module_name)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS weekly_comsol_modules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            year INT NOT NULL,
            week INT NOT NULL,
            module_name VARCHAR(150) NOT NULL,
            out_count INT DEFAULT 0,
            in_count INT DEFAULT 0,
            denied_count INT DEFAULT 0,
            queued_count INT DEFAULT 0,
            dequeued_count INT DEFAULT 0,
            peak_concurrent INT DEFAULT 0,
            unique_users INT DEFAULT 0,
            UNIQUE KEY uniq_week_module (year, week, module_name)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS monthly_comsol_modules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            year INT NOT NULL,
            month INT NOT NULL,
            module_name VARCHAR(150) NOT NULL,
            out_count INT DEFAULT 0,
            in_count INT DEFAULT 0,
            denied_count INT DEFAULT 0,
            queued_count INT DEFAULT 0,
            dequeued_count INT DEFAULT 0,
            peak_concurrent INT DEFAULT 0,
            unique_users INT DEFAULT 0,
            UNIQUE KEY uniq_month_module (year, month, module_name)
        )
    """)


def rollup_daily(cursor):
    """
    NOTE on peak_concurrent and unique_users: these two metrics can't be
    correctly summed across features the way out_count/in_count/etc can
    (summing per-feature peaks overstates true concurrent module usage if
    different features peak at different times, and summing unique_users
    can double-count the same person using two features of one module).
    MAX() is used for peak_concurrent as a conservative estimate; unique_users
    is summed as an upper-bound approximation. Treat both as approximations,
    consistent with the same caveat raised earlier for the MSC master table.
    """
    cursor.execute("""
        INSERT INTO daily_comsol_modules
            (module_date, module_name, out_count, in_count, denied_count,
             queued_count, dequeued_count, peak_concurrent, unique_users)
        SELECT
            f.feature_date,
            fm.module_name,
            SUM(f.out_count),
            SUM(f.in_count),
            SUM(f.denied_count),
            SUM(f.queued_count),
            SUM(f.dequeued_count),
            MAX(f.peak_concurrent),
            SUM(f.unique_users)
        FROM daily_comsol_features f
        JOIN comsol_feature_mapping fm ON f.feature_name = fm.feature_name
        GROUP BY f.feature_date, fm.module_name
        ON DUPLICATE KEY UPDATE
            out_count = VALUES(out_count),
            in_count = VALUES(in_count),
            denied_count = VALUES(denied_count),
            queued_count = VALUES(queued_count),
            dequeued_count = VALUES(dequeued_count),
            peak_concurrent = VALUES(peak_concurrent),
            unique_users = VALUES(unique_users)
    """)


def rollup_weekly(cursor):
    cursor.execute("""
        INSERT INTO weekly_comsol_modules
            (year, week, module_name, out_count, in_count, denied_count,
             queued_count, dequeued_count, peak_concurrent, unique_users)
        SELECT
            w.year,
            w.week,
            fm.module_name,
            SUM(w.out_count),
            SUM(w.in_count),
            SUM(w.denied_count),
            SUM(w.queued_count),
            SUM(w.dequeued_count),
            MAX(w.peak_concurrent),
            SUM(w.unique_users)
        FROM weekly_comsol_features w
        JOIN comsol_feature_mapping fm ON w.feature_name = fm.feature_name
        GROUP BY w.year, w.week, fm.module_name
        ON DUPLICATE KEY UPDATE
            out_count = VALUES(out_count),
            in_count = VALUES(in_count),
            denied_count = VALUES(denied_count),
            queued_count = VALUES(queued_count),
            dequeued_count = VALUES(dequeued_count),
            peak_concurrent = VALUES(peak_concurrent),
            unique_users = VALUES(unique_users)
    """)


def rollup_monthly(cursor):
    cursor.execute("""
        INSERT INTO monthly_comsol_modules
            (year, month, module_name, out_count, in_count, denied_count,
             queued_count, dequeued_count, peak_concurrent, unique_users)
        SELECT
            m.year,
            m.month,
            fm.module_name,
            SUM(m.out_count),
            SUM(m.in_count),
            SUM(m.denied_count),
            SUM(m.queued_count),
            SUM(m.dequeued_count),
            MAX(m.peak_concurrent),
            SUM(m.unique_users)
        FROM monthly_comsol_features m
        JOIN comsol_feature_mapping fm ON m.feature_name = fm.feature_name
        GROUP BY m.year, m.month, fm.module_name
        ON DUPLICATE KEY UPDATE
            out_count = VALUES(out_count),
            in_count = VALUES(in_count),
            denied_count = VALUES(denied_count),
            queued_count = VALUES(queued_count),
            dequeued_count = VALUES(dequeued_count),
            peak_concurrent = VALUES(peak_concurrent),
            unique_users = VALUES(unique_users)
    """)


if __name__ == "__main__":
    conn = get_connection()
    cursor = conn.cursor()

    ensure_tables(cursor)
    rollup_daily(cursor)
    rollup_weekly(cursor)
    rollup_monthly(cursor)
    conn.commit()

    print("COMSOL module rollups (daily/weekly/monthly) refreshed.")
    cursor.close()
    conn.close()
