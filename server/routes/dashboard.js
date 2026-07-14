import express from "express";
import {
  getKPIs,
  getTrendData,
  getTopModules,
  getEventDistribution,
  getFeatureSummary,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/kpis", getKPIs);
router.get("/trend", getTrendData);
router.get("/top-modules", getTopModules);
router.get("/event-distribution", getEventDistribution);
router.get("/feature-summary", getFeatureSummary);

export default router;