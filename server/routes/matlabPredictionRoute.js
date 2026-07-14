import express from "express";

import {
  getPredictionTrend,
  getFuturePredictions,
  getPredictionSummary,
  getRecommendations,
  getModelInformation,
} from "../controllers/matlabPredictionController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Prediction Trend Chart
|--------------------------------------------------------------------------
*/

router.get("/trend", getPredictionTrend);

/*
|--------------------------------------------------------------------------
| Future Predictions Table
|--------------------------------------------------------------------------
*/

router.get("/future", getFuturePredictions);

/*
|--------------------------------------------------------------------------
| Prediction Summary Table
|--------------------------------------------------------------------------
*/

router.get("/summary", getPredictionSummary);

/*
|--------------------------------------------------------------------------
| Recommendation Panel
|--------------------------------------------------------------------------
*/

router.get("/recommendations", getRecommendations);

/*
|--------------------------------------------------------------------------
| Model Information Panel
|--------------------------------------------------------------------------
*/

router.get("/model-info", getModelInformation);

export default router;