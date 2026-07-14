import os
import sys
import json
import joblib
import pandas as pd

from sqlalchemy import create_engine
from dotenv import load_dotenv
from urllib.parse import quote_plus


# ----------------------------------
# Read Period
# ----------------------------------

if len(sys.argv) != 2:
    print("Usage: python predict_trend.py <Daily|Weekly|Monthly>")
    sys.exit(1)

period = sys.argv[1].capitalize()

if period not in ["Daily", "Weekly", "Monthly"]:
    print("Invalid period.")
    sys.exit(1)


# ----------------------------------
# Configuration
# ----------------------------------

FUTURE_STEPS = 5


# ----------------------------------
# Model / Table Mapping
# ----------------------------------

MODEL_PATH = f"ml/models/xgb_{period.lower()}_peak.pkl"
ENCODER_PATH = f"ml/models/{period.lower()}_encoder.pkl"

TABLE_MAP = {
    "Daily": "daily_msc_features",
    "Weekly": "weekly_msc_features",
    "Monthly": "monthly_msc_features",
}

TABLE = TABLE_MAP[period]


# ----------------------------------
# Check Model
# ----------------------------------

if not os.path.exists(MODEL_PATH):

    print(json.dumps({
        "status": "insufficient_data",
        "message": f"{period} model has not been trained."
    }))

    sys.exit(0)


# ----------------------------------
# Load Model
# ----------------------------------

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)


# ----------------------------------
# Database Connection
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
# Fetch Modules
# ----------------------------------

modules = pd.read_sql(
    f"""
    SELECT DISTINCT feature_name
    FROM {TABLE}
    ORDER BY feature_name;
    """,
    engine,
)

module_predictions = {}


# ----------------------------------
# Labels
# ----------------------------------

if period == "Daily":

    labels = [
        "Today",
        "+1 Day",
        "+2 Days",
        "+3 Days",
        "+4 Days",
        "+5 Days",
    ]

elif period == "Weekly":

    labels = [
        "Current",
        "+1 Week",
        "+2 Weeks",
        "+3 Weeks",
        "+4 Weeks",
        "+5 Weeks",
    ]

else:

    labels = [
        "Current",
        "+1 Month",
        "+2 Months",
        "+3 Months",
        "+4 Months",
        "+5 Months",
    ]
# ----------------------------------
# Predict Trend for Every Module
# ----------------------------------

for module_name in modules["feature_name"]:

    # ------------------------------
    # Fetch Latest 2 Records
    # ------------------------------

    if period == "Daily":

        query = f"""
        SELECT *
        FROM {TABLE}
        WHERE feature_name='{module_name}'
        ORDER BY feature_date DESC
        LIMIT 2;
        """

    elif period == "Weekly":

        query = f"""
        SELECT *
        FROM {TABLE}
        WHERE feature_name='{module_name}'
        ORDER BY year DESC, week DESC
        LIMIT 2;
        """

    else:

        query = f"""
        SELECT *
        FROM {TABLE}
        WHERE feature_name='{module_name}'
        ORDER BY year DESC, month DESC
        LIMIT 2;
        """

    df = pd.read_sql(query, engine)

    if len(df) < 2:
        continue

    current = df.iloc[0]
    previous = df.iloc[1]

    module_encoded = encoder.transform([module_name])[0]

    # ------------------------------
    # Initial Values
    # ------------------------------

    current_peak = int(current["peak_concurrent"])

    previous_peak = int(previous["peak_concurrent"])

    current_out = int(current["out_count"])

    current_denied = int(current["denied_count"])

    current_users = int(current["unique_users"])

    queued_count = int(current["queued_count"])

    trend = [current_peak]

    # ------------------------------
    # Recursive Forecast
    # ------------------------------

    for step in range(FUTURE_STEPS):

        if period == "Daily":

            future_date = (
                pd.to_datetime(current["feature_date"])
                + pd.Timedelta(days=step + 1)
            )

            input_df = pd.DataFrame([{

                "feature_name": module_encoded,

                "day_of_week": future_date.dayofweek,

                "month": future_date.month,

                "previous_peak": previous_peak,

                "previous_out": current_out,

                "previous_denied": current_denied,

                "out_count": current_out,

                "denied_count": current_denied,

                "queued_count": queued_count,

                "unique_users": current_users,

                "peak_concurrent": current_peak,

            }])

        elif period == "Weekly":

            week = current["week"] + step + 1
            year = current["year"]

            if week > 52:
                week -= 52
                year += 1

            input_df = pd.DataFrame([{

                "feature_name": module_encoded,

                "week": week,

                "year": year,

                "previous_peak": previous_peak,

                "previous_out": current_out,

                "previous_denied": current_denied,

                "out_count": current_out,

                "denied_count": current_denied,

                "queued_count": queued_count,

                "unique_users": current_users,

                "peak_concurrent": current_peak,

            }])

        else:

            month = current["month"] + step + 1
            year = current["year"]

            while month > 12:
                month -= 12
                year += 1

            input_df = pd.DataFrame([{

                "feature_name": module_encoded,

                "month": month,

                "year": year,

                "previous_peak": previous_peak,

                "previous_out": current_out,

                "previous_denied": current_denied,

                "out_count": current_out,

                "denied_count": current_denied,

                "queued_count": queued_count,

                "unique_users": current_users,

                "peak_concurrent": current_peak,

            }])

        prediction = round(
            float(
                model.predict(input_df)[0]
            )
        )

        trend.append(prediction)

        # --------------------------------
        # Update values for next prediction
        # --------------------------------

        previous_peak = current_peak
        current_peak = prediction

        ratio = (
            prediction / max(previous_peak, 1)
        )

        current_out = round(current_out * ratio)

        current_denied = round(current_denied * ratio)

        current_users = round(current_users * ratio)

    module_predictions[module_name] = trend
# ----------------------------------
# Convert to Recharts Format
# ----------------------------------

trend_data = []

for i in range(len(labels)):

    row = {
        "label": labels[i]
    }

    for module_name, values in module_predictions.items():

        row[module_name] = values[i]

    trend_data.append(row)


# ----------------------------------
# Output JSON
# ----------------------------------

print(json.dumps({

    "period": period,

    "trend": trend_data

}))