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
# Drop old table (only once while developing)
# -----------------------------
cursor.execute("DROP TABLE IF EXISTS weekly_matlab_summary")

# -----------------------------
# Create Weekly Summary Table
# -----------------------------
cursor.execute("""

CREATE TABLE weekly_matlab_summary(

    id INT AUTO_INCREMENT PRIMARY KEY,

    year INT,

    month INT,

    week_no INT,

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
# Aggregate Weekly Data
# -----------------------------
cursor.execute("""

SELECT

YEAR(event_date) AS year,

MONTH(event_date) AS month,

FLOOR((DAY(event_date)-1)/7)+1 AS week_no,

feature,

SUM(CASE WHEN event_type='CHECKOUT' THEN 1 ELSE 0 END) AS checkout_count,

SUM(CASE WHEN event_type='CHECKIN' THEN 1 ELSE 0 END) AS checkin_count,

SUM(CASE WHEN event_type='DENIED' THEN 1 ELSE 0 END) AS denied_count,

COUNT(DISTINCT username) AS unique_users

FROM matlab_license_log

GROUP BY

YEAR(event_date),

MONTH(event_date),

FLOOR((DAY(event_date)-1)/7)+1,

feature

ORDER BY

year,

month,

week_no,

feature

""")
rows = cursor.fetchall()

# -----------------------------
# Insert Weekly Summary
# -----------------------------
insert_query = """

INSERT INTO weekly_matlab_summary(

year,

month,

week_no,

feature,

checkout_count,

checkin_count,

denied_count,

unique_users,

active_sessions,

peak_concurrent

)

VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)

"""

for row in rows:

    year = row[0]
    month = row[1]
    week_no = row[2]
    feature = row[3]
    checkout_count = row[4]
    checkin_count = row[5]
    denied_count = row[6]
    unique_users = row[7]

    active_sessions = max(checkout_count - checkin_count, 0)

    peak_concurrent = checkout_count

    cursor.execute(
        insert_query,
        (
            year,
            month,
            week_no,
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

print("Weekly MATLAB summary created successfully.")