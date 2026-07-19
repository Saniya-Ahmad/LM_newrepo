import time
import subprocess
from pathlib import Path

from aggregation_service import (
    update_daily,
    update_weekly,
    update_monthly,
)

BASE_DIR = Path(__file__).resolve().parent.parent


def retrain_models():
    """Run the complete ML training pipeline."""

    train_script = BASE_DIR / "train_all_models.py"

    print("Starting model retraining...")

    subprocess.run(
        ["python", str(train_script)],
        check=True,
    )

    print("Model retraining completed.")


def run_pipeline():

    print("Updating feature tables...")

    update_daily()
    update_weekly()
    update_monthly()

    retrain_models()


if __name__ == "__main__":

    print("Hourly scheduler started...")

    while True:

        try:

            run_pipeline()

        except Exception as e:

            print(f"Pipeline Error: {e}")

        print("Sleeping for 1 hour...")

        time.sleep(60 * 60)