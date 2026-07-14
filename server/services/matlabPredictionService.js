import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execFileAsync = promisify(execFile);

const PYTHON = process.platform === "win32"
  ? "python"
  : "python3";

// Root python folder
const ML_PATH = path.join(process.cwd(), "python", "ml");

/* ==========================================================
   Helper Function
========================================================== */

async function runPython(script, args = []) {
  try {
    const scriptPath = path.join(ML_PATH, script);

    const { stdout, stderr } = await execFileAsync(
      PYTHON,
      [scriptPath, ...args],
      {
        maxBuffer: 1024 * 1024 * 10,
      }
    );

    if (stderr && stderr.trim() !== "") {
      console.error(stderr);
    }

    return JSON.parse(stdout);

  } catch (err) {

    console.error("Python Error:", err);

    throw err;
  }
}

/* ==========================================================
   Prediction Trend Chart
========================================================== */

export async function fetchPredictionTrend(filter) {

  return await runPython("predict_trend.py", [
    filter.year,
    filter.month,
    filter.feature,
  ]);

}

/* ==========================================================
   Future Prediction Table
========================================================== */

export async function fetchFuturePredictions(filter) {

  return await runPython("predict.py", [
    filter.year,
    filter.month,
  ]);

}

/* ==========================================================
   Prediction Summary
========================================================== */

export async function fetchPredictionSummary(filter) {

  const predictions = await runPython("predict.py", [
    filter.year,
    filter.month,
  ]);

  return predictions.map((row) => ({

    feature: row.feature,

    current_peak: row.current_peak,

    predicted_peak: row.predicted_peak,

    growth:
      (
        ((row.predicted_peak - row.current_peak) /
          Math.max(row.current_peak, 1)) *
        100
      ).toFixed(1) + "%",

    confidence: row.confidence + "%",

  }));

}

/* ==========================================================
   Recommendations
========================================================== */

export async function fetchRecommendations(filter) {

  const predictions = await runPython("predict.py", [
    filter.year,
    filter.month,
  ]);

  return predictions.map((row) => {

    let recommendation = "";
    let severity = "low";

    if (row.predicted_peak >= row.capacity * 0.95) {

      severity = "high";

      recommendation =
        `Increase ${row.feature} licenses before next month.`;

    }

    else if (row.predicted_peak >= row.capacity * 0.80) {

      severity = "medium";

      recommendation =
        `Monitor ${row.feature} usage closely.`;

    }

    else {

      recommendation =
        `${row.feature} license pool is sufficient.`;

    }

    return {

      feature: row.feature,

      current_peak: row.current_peak,

      predicted_peak: row.predicted_peak,

      capacity: row.capacity,

      severity,

      recommendation,

    };

  });

}

/* ==========================================================
   Model Information
========================================================== */

export async function fetchModelInformation() {

  const infoPath = path.join(
    ML_PATH,
    "models",
    "model_info.json"
  );

  if (!fs.existsSync(infoPath)) {

    return {

      algorithm: "XGBoost",

      version: "1.0",

      trained_on: "-",

      rmse: "-",

      mae: "-",

      accuracy: "-",

    };

  }

  return JSON.parse(
    fs.readFileSync(infoPath, "utf8")
  );

}