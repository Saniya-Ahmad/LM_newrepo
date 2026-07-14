import subprocess
import sys

periods = ["Daily", "Weekly", "Monthly"]

summary = []

print("=" * 60)
print("TRAINING ALL XGBOOST MODELS")
print("=" * 60)

for period in periods:

    print(f"\nPreparing {period} Training Dataset...")

    prepare = subprocess.run(
        [sys.executable, "ml/prepare_training_data.py", period]
    )

    if prepare.returncode != 0:
        print(f"Failed to prepare {period} dataset.")
        summary.append((period, "Preparation Failed"))
        continue

    print(f"\nTraining {period} Model...")

    train = subprocess.run(
        [sys.executable, "ml/train_xgboost.py", period]
    )

    if train.returncode == 0:
        summary.append((period, "Success"))
    else:
        summary.append((period, "Skipped / Failed"))

print("\n" + "=" * 60)
print("TRAINING SUMMARY")
print("=" * 60)

for period, status in summary:
    print(f"{period:<10} : {status}")

print("\nDone!")