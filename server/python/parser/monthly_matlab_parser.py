import mysql.connector

# -----------------------------
# Database Connection
# -----------------------------

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="saniya_2306139",
    database="license_analytics"
)

cursor = conn.cursor()

# -----------------------------
# Create Monthly Summary Table
# -----------------------------

cursor.execute("""

CREATE TABLE IF NOT EXISTS monthly_matlab_summary(

    id INT AUTO_INCREMENT PRIMARY KEY,

    year INT,

    month INT,

    feature VARCHAR(100),

    checkout_count INT,

    checkin_count INT,

    denied_count INT,

    unique_users INT,

    active_sessions INT,

    peak_concurrent INT

)

""")

conn.commit()

# -----------------------------
# Remove Old Data
# -----------------------------

cursor.execute("TRUNCATE TABLE monthly_matlab_summary")

# -----------------------------
# Aggregate Monthly Data
# -----------------------------

cursor.execute("""

SELECT

YEAR(event_date) AS year,

MONTH(event_date) AS month,

feature,

SUM(CASE WHEN event_type='CHECKOUT' THEN 1 ELSE 0 END) AS checkout_count,

SUM(CASE WHEN event_type='CHECKIN' THEN 1 ELSE 0 END) AS checkin_count,

SUM(CASE WHEN event_type='DENIED' THEN 1 ELSE 0 END) AS denied_count,

COUNT(DISTINCT username) AS unique_users

FROM matlab_license_log

GROUP BY YEAR(event_date), MONTH(event_date), feature

ORDER BY year, month, feature

""")

rows = cursor.fetchall()

# -----------------------------
# Insert Summary
# -----------------------------

insert_query = """

INSERT INTO monthly_matlab_summary(

year,

month,

feature,

checkout_count,

checkin_count,

denied_count,

unique_users,

active_sessions,

peak_concurrent

)

VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)

"""

for row in rows:

    year = row[0]
    month = row[1]
    feature = row[2]
    checkout_count = row[3]
    checkin_count = row[4]
    denied_count = row[5]
    unique_users = row[6]

    # Temporary values (replace later using session_builder)
    active_sessions = max(checkout_count - checkin_count, 0)
    peak_concurrent = checkout_count

    cursor.execute(
        insert_query,
        (
            year,
            month,
            feature,
            checkout_count,
            checkin_count,
            denied_count,
            unique_users,
            active_sessions,
            peak_concurrent
        )
    )

conn.commit()

cursor.close()
conn.close()

print("Monthly MATLAB summary created successfully.")