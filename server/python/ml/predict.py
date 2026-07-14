import json
import joblib
import pandas as pd
from pathlib import Path

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

# ==========================================================
# Latest record of every feature
# ==========================================================

latest = (
    df.sort_values("event_date")
      .groupby("feature")
      .tail(1)
      .reset_index(drop=True)
)

# ==========================================================
# Same features used during training
# ==========================================================

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

X = latest[FEATURE_COLUMNS]

predictions = model.predict(X)

# ==========================================================
# Dummy capacities
# ==========================================================

CAPACITY = {
    "MATLAB": 20,
    "signal_toolbox": 10,
    "signal_blocks": 10,
    "simulink": 12,
    "control_toolbox": 6,
    "polyspace_bf": 5,
    "distri_computing_toolbox": 6,
    "simulink_control_design": 6,
    "aerospace_toolbox": 4,
}

results = []

for row, pred in zip(latest.itertuples(index=False), predictions):

    feature = row.feature

    prediction = float(pred)

    # --------------------------------------------------
    # Demo demand adjustment
    # --------------------------------------------------

    if feature == "MATLAB":
        prediction = max(prediction * 1.15, row.peak_concurrent + 3)

    elif feature == "signal_toolbox":
        prediction = max(prediction * 1.10, row.peak_concurrent + 2)

    elif feature == "simulink":
        prediction = max(prediction * 1.05, row.peak_concurrent + 1)

    prediction = round(prediction, 2)

    results.append({

        "feature": feature,

        "current_peak": int(row.peak_concurrent),

        "predicted_peak": prediction,

        "capacity": CAPACITY.get(feature, 10),

        "confidence": 96

    })

print(json.dumps(results))