import os
import sys
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
from urllib.parse import quote_plus

# ----------------------------------
# Read Period
# ----------------------------------

if len(sys.argv) != 2:
    print("Usage: python prepare_training_data.py <Daily|Weekly|Monthly>")
    sys.exit(1)

period = sys.argv[1].capitalize()

if period not in ["Daily", "Weekly", "Monthly"]:
    print("Invalid period.")
    sys.exit(1)

# ----------------------------------
# Load Environment Variables
# ----------------------------------

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD"))
DB_NAME = os.getenv("DB_NAME")

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}"
)

# ----------------------------------
# Table Selection
# ----------------------------------

table_map = {
    "Daily": "daily_msc_features",
    "Weekly": "weekly_msc_features",
    "Monthly": "monthly_msc_features",
}

table_name = table_map[period]

# ----------------------------------
# Query
# ----------------------------------

if period == "Daily":

    query = f"""
    SELECT *
    FROM {table_name}
    ORDER BY feature_name, feature_date;
    """

elif period == "Weekly":

    query = f"""
    SELECT *
    FROM {table_name}
    ORDER BY feature_name, year, week;
    """

else:

    query = f"""
    SELECT *
    FROM {table_name}
    ORDER BY feature_name, year, month;
    """

df = pd.read_sql(query, engine)

print(f"\nOriginal {period} Dataset")
print(df.head())
print("\nShape:", df.shape)

# ----------------------------------
# Calendar Features
# ----------------------------------

if period == "Daily":

    df["feature_date"] = pd.to_datetime(df["feature_date"])

    df["calendar1"] = df["feature_date"].dt.dayofweek
    df["calendar2"] = df["feature_date"].dt.month

elif period == "Weekly":

    df["calendar1"] = df["week"]
    df["calendar2"] = df["year"]

else:

    df["calendar1"] = df["month"]
    df["calendar2"] = df["year"]

# ----------------------------------
# Lag Features
# ----------------------------------

df["previous_peak"] = (
    df.groupby("feature_name")["peak_concurrent"]
      .shift(1)
)

df["previous_out"] = (
    df.groupby("feature_name")["out_count"]
      .shift(1)
)

df["previous_denied"] = (
    df.groupby("feature_name")["denied_count"]
      .shift(1)
)

# ----------------------------------
# Target
# ----------------------------------

df["target_peak"] = (
    df.groupby("feature_name")["peak_concurrent"]
      .shift(-1)
)

# ----------------------------------
# Remove Invalid Rows
# ----------------------------------

df = df.dropna(
    subset=[
        "previous_peak",
        "previous_out",
        "previous_denied",
        "target_peak",
    ]
)

# ----------------------------------
# Convert Types
# ----------------------------------

int_columns = [
    "previous_peak",
    "previous_out",
    "previous_denied",
    "target_peak",
]

for col in int_columns:
    df[col] = df[col].astype(int)

# ----------------------------------
# Final Dataset
# ----------------------------------

df = df[
    [
        "feature_name",
        "calendar1",
        "calendar2",
        "previous_peak",
        "previous_out",
        "previous_denied",
        "out_count",
        "denied_count",
        "queued_count",
        "unique_users",
        "peak_concurrent",
        "target_peak",
    ]
]

# ----------------------------------
# Rename Calendar Columns
# ----------------------------------

if period == "Daily":

    df.rename(
        columns={
            "calendar1": "day_of_week",
            "calendar2": "month",
        },
        inplace=True,
    )

elif period == "Weekly":

    df.rename(
        columns={
            "calendar1": "week",
            "calendar2": "year",
        },
        inplace=True,
    )

else:

    df.rename(
        columns={
            "calendar1": "month",
            "calendar2": "year",
        },
        inplace=True,
    )

# ----------------------------------
# Save CSV
# ----------------------------------

os.makedirs("ml/data", exist_ok=True)

output_file = f"ml/data/{period.lower()}_training.csv"

df.to_csv(
    output_file,
    index=False,
)

print(f"\n{period} Training Dataset Created Successfully!")

print(df.head())

print("\nTraining Shape:", df.shape)

print(f"\nSaved to: {output_file}")