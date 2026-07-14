import express from "express";

import {
  getPredictions,
  getTrend,
} from "../controllers/xgboostController.js";

const router = express.Router();

router.get("/predictions", getPredictions);

router.get("/trend", getTrend);

export default router;