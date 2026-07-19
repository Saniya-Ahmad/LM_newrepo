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
    print("Usage: python predict.py <Daily|Weekly|Monthly>")
    sys.exit(1)

period = sys.argv[1].capitalize()

if period not in ["Daily", "Weekly", "Monthly"]:
    print("Invalid period.")
    sys.exit(1)


# ----------------------------------
# Model / Table Mapping
# ----------------------------------

MODEL_PATH = f"ml/models/xgb_{period.lower()}_peak.pkl"
ENCODER_PATH = f"ml/models/{period.lower()}_encoder.pkl"
METRICS_PATH = f"ml/models/{period.lower()}_metrics.json"

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

with open(METRICS_PATH, "r") as f:
    metrics = json.load(f)


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
# Get Features + License Information
# ----------------------------------

modules = pd.read_sql(
    f"""
    SELECT DISTINCT
        t.feature_name,
        fm.feature_display_name,
        fm.module_name,
        fm.module_quantity
    FROM {TABLE} t
    INNER JOIN feature_mapping fm
        ON UPPER(t.feature_name) = UPPER(fm.feature_name)
    ORDER BY t.feature_name;
    """,
    engine,
)

results = []


# ----------------------------------
# Predict Each Feature
# ----------------------------------

for _, row in modules.iterrows():

    feature_name = row["feature_name"]
    feature_display = row["feature_display_name"]
    module_name = row["module_name"]
    current_licenses = int(row["module_quantity"])


    if period == "Daily":

        query = f"""
        SELECT *
        FROM {TABLE}
        WHERE feature_name='{feature_name}'
        ORDER BY feature_date DESC
        LIMIT 2;
        """

    elif period == "Weekly":

        query = f"""
        SELECT *
        FROM {TABLE}
        WHERE feature_name='{feature_name}'
        ORDER BY year DESC, week DESC
        LIMIT 2;
        """

    else:

        query = f"""
        SELECT *
        FROM {TABLE}
        WHERE feature_name='{feature_name}'
        ORDER BY year DESC, month DESC
        LIMIT 2;
        """

    df = pd.read_sql(query, engine)

    if len(df) < 2:
        continue

    current = df.iloc[0]
    previous = df.iloc[1]

    module_encoded = encoder.transform([feature_name])[0]


    if period == "Daily":

        input_df = pd.DataFrame([{
            "feature_name": module_encoded,
            "day_of_week": pd.to_datetime(current["feature_date"]).dayofweek,
            "month": pd.to_datetime(current["feature_date"]).month,
            "previous_peak": previous["peak_concurrent"],
            "previous_out": previous["out_count"],
            "previous_denied": previous["denied_count"],
            "out_count": current["out_count"],
            "denied_count": current["denied_count"],
            "queued_count": current["queued_count"],
            "unique_users": current["unique_users"],
            "peak_concurrent": current["peak_concurrent"],
        }])

    elif period == "Weekly":

        input_df = pd.DataFrame([{
            "feature_name": module_encoded,
            "week": current["week"],
            "year": current["year"],
            "previous_peak": previous["peak_concurrent"],
            "previous_out": previous["out_count"],
            "previous_denied": previous["denied_count"],
            "out_count": current["out_count"],
            "denied_count": current["denied_count"],
            "queued_count": current["queued_count"],
            "unique_users": current["unique_users"],
            "peak_concurrent": current["peak_concurrent"],
        }])

    else:

        input_df = pd.DataFrame([{
            "feature_name": module_encoded,
            "month": current["month"],
            "year": current["year"],
            "previous_peak": previous["peak_concurrent"],
            "previous_out": previous["out_count"],
            "previous_denied": previous["denied_count"],
            "out_count": current["out_count"],
            "denied_count": current["denied_count"],
            "queued_count": current["queued_count"],
            "unique_users": current["unique_users"],
            "peak_concurrent": current["peak_concurrent"],
        }])

    prediction = float(model.predict(input_df)[0])
    # ----------------------------------
    # Derived Metrics
    # ----------------------------------

    ratio = (
        prediction / current["peak_concurrent"]
        if current["peak_concurrent"] > 0
        else 1
    )

    predicted_out = round(current["out_count"] * ratio)

    predicted_denied = round(current["denied_count"] * ratio)

    predicted_users = round(current["unique_users"] * ratio)

    difference = round(
        prediction - current["peak_concurrent"]
    )

    if current["peak_concurrent"] == 0:
        change = None
    else:
        change = round(
            (
                (prediction - current["peak_concurrent"])
                / current["peak_concurrent"]
            ) * 100,
            1,
        )


    # ----------------------------------
    # License Recommendation
    # ----------------------------------

    prediction = round(prediction)

    licenses_to_add = 0
    licenses_to_remove = 0

    if prediction > current_licenses:

        licenses_to_add = prediction - current_licenses

        recommendation = (
            f"Add {licenses_to_add} license(s)"
        )

        priority = "High"

    elif prediction < current_licenses and current["denied_count"] == 0:

        licenses_to_remove = current_licenses - prediction

        recommendation = (
            f"Remove {licenses_to_remove} unused license(s)"
        )

        priority = "Low"

    elif current["denied_count"] > 0:

        recommendation = (
            "Monitor usage due to denied requests"
        )

        priority = "Medium"

    else:

        recommendation = (
            "Current license allocation is sufficient"
        )

        priority = "Medium"


    # ----------------------------------
    # Save Result
    # ----------------------------------

    results.append({

        "feature": feature_name,
        "displayName": feature_display,
        "module": module_name,

        "currentLicenses": current_licenses,

        "licensesToAdd": licenses_to_add,
        "licensesToRemove": licenses_to_remove,

        "currentPeak": int(current["peak_concurrent"]),
        "predictedPeak": prediction,

        "currentOut": int(current["out_count"]),
        "predictedOut": predicted_out,

        "currentDenied": int(current["denied_count"]),
        "predictedDenied": predicted_denied,

        "currentUsers": int(current["unique_users"]),
        "predictedUsers": predicted_users,

        "difference": difference,
        "change": change,

        "recommendation": recommendation,
        "priority": priority,

    })


# ----------------------------------
# Sort Predictions
# ----------------------------------

results.sort(
    key=lambda x: (
        x["priority"] == "High",
        x["predictedPeak"]
    ),
    reverse=True,
)


# ----------------------------------
# Output JSON
# ----------------------------------

print(json.dumps({

    "period": period,

    "metrics": metrics,

    "predictions": results,

}))