import json
import joblib
import pandas as pd
from pathlib import Path
from datetime import timedelta

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "xgboost.pkl"
DATASET_PATH = BASE_DIR / "dataset" / "training.csv"

# ==========================================================
# Load
# ==========================================================

model = joblib.load(MODEL_PATH)
df = pd.read_csv(DATASET_PATH)

df["event_date"] = pd.to_datetime(df["event_date"])

FEATURE_COLUMNS = [
    "checkout_count",
    "checkin_count",
    "denied_count",
    "unique_users",
    "active_sessions",
    "month",
    "day",
    "day_of_week",
    "week",
    "lag1",
    "lag7",
    "rolling_mean_7",
]

trend = []

# ==========================================================
# Predict next 7 days for every feature
# ==========================================================

for feature in sorted(df["feature"].unique()):

    feature_df = (
        df[df["feature"] == feature]
        .sort_values("event_date")
        .copy()
    )

    if feature_df.empty:
        continue

    last = feature_df.iloc[-1].copy()

    current_date = pd.to_datetime(last["event_date"])

    for _ in range(7):

        current_date += timedelta(days=1)

        last["day"] = current_date.day
        last["month"] = current_date.month
        last["day_of_week"] = current_date.dayofweek
        last["week"] = int(current_date.isocalendar().week)

        X = pd.DataFrame([last[FEATURE_COLUMNS]])

        prediction = float(model.predict(X)[0])

        trend.append({
            "date": current_date.strftime("%d %b"),
            "feature": feature,
            "predicted_peak": round(prediction, 2),
        })

        # Update lag values recursively
        last["lag7"] = last["lag1"]
        last["lag1"] = prediction
        last["rolling_mean_7"] = (
            last["rolling_mean_7"] * 6 + prediction
        ) / 7

        last["checkout_count"] = prediction
        last["checkin_count"] = prediction
        last["active_sessions"] = prediction

print(json.dumps(trend))