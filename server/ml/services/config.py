import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# -------------------------
# Database Configuration
# -------------------------

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# -------------------------
# Log Configuration
# -------------------------

# Base directory where DRDO stores date-wise log folders
# Replace this with the actual path once you get it.
LOG_BASE_DIR = "/var/log/licenses"

# -------------------------
# Scheduler Configuration
# -------------------------

# Update feature tables every 5 minutes
AGGREGATION_INTERVAL = 5 * 60

# Retrain models every 1 hour
TRAIN_INTERVAL = 60 * 60