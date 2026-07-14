import os
import json
import joblib
import pandas as pd

from datetime import datetime

from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "training.csv",
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models",
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "xgboost.pkl",
)

MODEL_INFO_PATH = os.path.join(
    MODEL_DIR,
    "model_info.json",
)

os.makedirs(MODEL_DIR, exist_ok=True)

# ==========================================================
# Load Dataset
# ==========================================================

df = pd.read_csv(DATASET_PATH)

print(f"Total Rows : {len(df)}")

# ==========================================================
# Train only MATLAB feature
# ==========================================================

df = df[df["feature"] == "MATLAB"].copy()

print(f"MATLAB Rows : {len(df)}")

# ==========================================================
# Remove rows with insufficient lag values
# ==========================================================

df = df.dropna().reset_index(drop=True)

# ==========================================================
# Features
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

TARGET = "target"

X = df[FEATURE_COLUMNS]
y = df[TARGET]

# ==========================================================
# Train Test Split
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
)

# ==========================================================
# XGBoost Model
# ==========================================================

model = XGBRegressor(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.90,
    colsample_bytree=0.90,
    objective="reg:squarederror",
    random_state=42,
)

model.fit(X_train, y_train)

# ==========================================================
# Evaluation
# ==========================================================

predictions = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions,
)

mse = mean_squared_error(
    y_test,
    predictions,
)

rmse = mse ** 0.5
r2 = r2_score(
    y_test,
    predictions,
)

print("\n========== MODEL METRICS ==========")
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.3f}")

# ==========================================================
# Save Model
# ==========================================================

joblib.dump(model, MODEL_PATH)

print("\nModel Saved Successfully")
print(MODEL_PATH)

# ==========================================================
# Save Model Information
# ==========================================================

model_info = {
    "algorithm": "XGBoost Regressor",
    "target": "Peak Concurrent Licenses",
    "training_rows": int(len(df)),
    "features": len(FEATURE_COLUMNS),
    "feature_names": FEATURE_COLUMNS,
    "mae": round(float(mae), 3),
    "rmse": round(float(rmse), 3),
    "r2": round(float(r2), 3),
    "trained_on": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "model_file": "xgboost.pkl",
}

with open(MODEL_INFO_PATH, "w") as f:
    json.dump(model_info, f, indent=4)

print("\nModel information saved.")
print(MODEL_INFO_PATH)