import os
import sys
import json
import joblib
import pandas as pd
from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from xgboost import XGBRegressor

# ------------------------------------
# Read Period
# ------------------------------------

if len(sys.argv) != 2:
    print("Usage: python train_xgboost.py <Daily|Weekly|Monthly>")
    sys.exit(1)

period = sys.argv[1].capitalize()

if period not in ["Daily", "Weekly", "Monthly"]:
    print("Invalid period.")
    sys.exit(1)

# ------------------------------------
# Load Dataset
# ------------------------------------

dataset_path = f"ml/data/{period.lower()}_training.csv"

if not os.path.exists(dataset_path):
    print(f"{dataset_path} not found.")
    sys.exit(1)

df = pd.read_csv(dataset_path)

print(f"\n{period} Training Dataset")
print(df.head())
print("\nShape:", df.shape)

# ------------------------------------
# Check Dataset Size
# ------------------------------------

if len(df) < 20:
    print(f"\nNot enough data to train {period} model.")
    sys.exit(0)

# ------------------------------------
# Encode Module Names
# ------------------------------------

encoder = LabelEncoder()

df["feature_name"] = encoder.fit_transform(df["feature_name"])

# ------------------------------------
# Features & Target
# ------------------------------------

X = df.drop(columns=["target_peak"])
y = df["target_peak"]

# ------------------------------------
# Train Test Split
# ------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

print("\nTraining Samples:", len(X_train))
print("Testing Samples :", len(X_test))

# ------------------------------------
# Train Model
# ------------------------------------

model = XGBRegressor(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    objective="reg:squarederror",
    random_state=42,
)

print("\nTraining XGBoost Model...")

model.fit(X_train, y_train)

print("Training Complete!")

# ------------------------------------
# Evaluate
# ------------------------------------

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("\n========== MODEL PERFORMANCE ==========")
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.4f}")

# ------------------------------------
# Feature Importance
# ------------------------------------

importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_,
})

importance = importance.sort_values(
    by="Importance",
    ascending=False,
)

print("\n========== FEATURE IMPORTANCE ==========")
print(importance)

# ------------------------------------
# Save Model
# ------------------------------------

os.makedirs("ml/models", exist_ok=True)

model_path = f"ml/models/xgb_{period.lower()}_peak.pkl"
encoder_path = f"ml/models/{period.lower()}_encoder.pkl"
metrics_path = f"ml/models/{period.lower()}_metrics.json"

joblib.dump(model, model_path)
joblib.dump(encoder, encoder_path)

metrics = {
    "period": period,
    "mae": round(float(mae), 2),
    "rmse": round(float(rmse), 2),
    "r2": round(float(r2), 4),
    "trainingSamples": len(X_train),
    "testingSamples": len(X_test),
    "trainingRows": len(df),
    "trainedOn": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
}

with open(metrics_path, "w") as f:
    json.dump(metrics, f, indent=4)

print("\nModel Saved Successfully!")
print(model_path)

print("\nEncoder Saved Successfully!")
print(encoder_path)

print("\nMetrics Saved Successfully!")
print(metrics_path)