import mysql.connector

from config import (
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
)


def get_connection():
    """
    Create and return a MySQL database connection.
    """
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
    )


def insert_log(
    event_date,
    event_time,
    event_type,
    feature_name,
    username,
    hostname,
):
    """
    Insert one parsed log entry into MSC_logs.
    """

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO MSC_logs
    (
        event_date,
        event_time,
        event_type,
        feature_name,
        username,
        hostname
    )
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (
        event_date,
        event_time,
        event_type,
        feature_name,
        username,
        hostname,
    )

    cursor.execute(query, values)

    conn.commit()

    cursor.close()
    conn.close()