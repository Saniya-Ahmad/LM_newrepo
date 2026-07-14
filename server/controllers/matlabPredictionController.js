import {
  fetchPredictionTrend,
  fetchFuturePredictions,
  fetchPredictionSummary,
  fetchRecommendations,
  fetchModelInformation,
} from "../services/matlabPredictionService.js";

/* ==========================================================
   Prediction Trend
========================================================== */

export async function getPredictionTrend(req, res) {
  try {
    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 7,
      feature: req.query.feature || "MATLAB",
    };

    const data = await fetchPredictionTrend(filter);

    res.status(200).json(data);
  } catch (err) {
    console.error("Prediction Trend Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch prediction trend.",
    });
  }
}

/* ==========================================================
   Future Predictions
========================================================== */

export async function getFuturePredictions(req, res) {
  try {
    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 7,
    };

    const data = await fetchFuturePredictions(filter);

    res.status(200).json(data);
  } catch (err) {
    console.error("Future Prediction Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch future predictions.",
    });
  }
}

/* ==========================================================
   Prediction Summary
========================================================== */

export async function getPredictionSummary(req, res) {
  try {
    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 7,
    };

    const data = await fetchPredictionSummary(filter);

    res.status(200).json(data);
  } catch (err) {
    console.error("Prediction Summary Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch prediction summary.",
    });
  }
}

/* ==========================================================
   Recommendations
========================================================== */

export async function getRecommendations(req, res) {
  try {
    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 7,
    };

    const data = await fetchRecommendations(filter);

    res.status(200).json(data);
  } catch (err) {
    console.error("Recommendation Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations.",
    });
  }
}

/* ==========================================================
   Model Information
========================================================== */

export async function getModelInformation(req, res) {
  try {
    const data = await fetchModelInformation();

    res.status(200).json(data);
  } catch (err) {
    console.error("Model Information Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch model information.",
    });
  }
}