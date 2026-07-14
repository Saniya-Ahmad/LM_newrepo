import express from "express";
import {
  getKPIs,
  getUsageTrend,
  getModuleUsage,
  getFeatureSummary,
  getTopUsers,
  getEventDistribution,
} from "../controllers/matlabController.js";

const router = express.Router();

router.get("/kpis", getKPIs);

router.get("/usage-trend", getUsageTrend);

router.get("/module-usage", getModuleUsage);

router.get("/feature-summary", getFeatureSummary);

router.get("/top-users", getTopUsers);

router.get("/event-distribution", getEventDistribution);

export default router;