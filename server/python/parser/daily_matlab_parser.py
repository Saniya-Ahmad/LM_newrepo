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
# Create Table
# -----------------------------

cursor.execute("""

CREATE TABLE IF NOT EXISTS daily_matlab_summary(

id INT AUTO_INCREMENT PRIMARY KEY,

event_date DATE,

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
# Aggregate Raw Data
# -----------------------------

cursor.execute("""

SELECT

event_date,

feature,

SUM(CASE WHEN event_type='CHECKOUT' THEN 1 ELSE 0 END) AS checkout_count,

SUM(CASE WHEN event_type='CHECKIN' THEN 1 ELSE 0 END) AS checkin_count,

SUM(CASE WHEN event_type='DENIED' THEN 1 ELSE 0 END) AS denied_count,

COUNT(DISTINCT username) AS unique_users

FROM matlab_license_log

GROUP BY event_date, feature

ORDER BY event_date, feature

""")

rows = cursor.fetchall()

# -----------------------------
# Insert Summary
# -----------------------------

insert_query = """

INSERT INTO daily_matlab_summary(

event_date,

feature,

checkout_count,

checkin_count,

denied_count,

unique_users,

active_sessions,

peak_concurrent

)

VALUES(%s,%s,%s,%s,%s,%s,%s,%s)

"""

for row in rows:

    event_date = row[0]
    feature = row[1]
    checkout_count = row[2]
    checkin_count = row[3]
    denied_count = row[4]
    unique_users = row[5]

    # Approximation for dashboard demo
    active_sessions = max(checkout_count - checkin_count, 0)

    # Approximation for dashboard demo
    peak_concurrent = checkout_count

    cursor.execute(
        insert_query,
        (
            event_date,
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

print("Daily matlab summary table created successfully.")