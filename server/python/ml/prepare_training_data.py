import mysql.connector
import pandas as pd
import os

# ==========================================================
# MySQL Connection
# ==========================================================

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="saniya_2306139",
    database="license_analytics"
)

# ==========================================================
# Read historical data
# ==========================================================

query = """
SELECT
    event_date,
    feature,
    checkout_count,
    checkin_count,
    denied_count,
    unique_users,
    active_sessions,
    peak_concurrent
FROM daily_matlab_summary
ORDER BY event_date ASC;
"""

df = pd.read_sql(query, connection)

connection.close()

# ==========================================================
# Feature Engineering
# ==========================================================

df["event_date"] = pd.to_datetime(df["event_date"])

df["year"] = df["event_date"].dt.year
df["month"] = df["event_date"].dt.month
df["day"] = df["event_date"].dt.day
df["day_of_week"] = df["event_date"].dt.dayofweek
df["week"] = df["event_date"].dt.isocalendar().week.astype(int)

# ==========================================================
# Lag Features
# ==========================================================

df = df.sort_values(["feature", "event_date"])

df["lag1"] = (
    df.groupby("feature")["peak_concurrent"]
    .shift(1)
    .fillna(0)
)

df["lag7"] = (
    df.groupby("feature")["peak_concurrent"]
    .shift(7)
    .fillna(0)
)

df["rolling_mean_7"] = (
    df.groupby("feature")["peak_concurrent"]
    .rolling(7)
    .mean()
    .reset_index(level=0, drop=True)
    .fillna(0)
)

# ==========================================================
# Target Variable
# ==========================================================

df["target"] = df["peak_concurrent"]

# ==========================================================
# Save CSV
# ==========================================================

output_dir = os.path.join(
    os.path.dirname(__file__),
    "dataset"
)

os.makedirs(output_dir, exist_ok=True)

output_file = os.path.join(
    output_dir,
    "training.csv"
)

df.to_csv(output_file, index=False)

print(f"Training dataset created successfully.")

print(f"Rows : {len(df)}")

print(f"Saved : {output_file}")