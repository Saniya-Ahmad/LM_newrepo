import {
  fetchKPIs,
  fetchUsageTrend,
  fetchModuleUsage,
  fetchFeatureSummary,
  fetchEventDistribution,
  fetchTopUsers,
} from "../services/matlabService.js";

// =======================================
// KPI CARDS
// =======================================
// export async function getKPIs(req, res) {
//   try {
//     const period = req.query.period || "daily";

//     const filter = {
//       year: Number(req.query.year) || 2026,
//       month: Number(req.query.month) || 5,
//       day: Number(req.query.day) || 25,
//     };

//     const data = await fetchKPIs(period, filter);

//     res.status(200).json(data);
//   } catch (err) {
//     console.error("Error fetching KPIs:", err);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch KPI data",
//     });
//   }
// }
export async function getKPIs(req, res) {

  try {

    const period = req.query.period || "daily";

    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 5,
      date: Number(req.query.date) || 25,
      week: Number(req.query.week) || 4,
    };

    const data = await fetchKPIs(period, filter);

    res.status(200).json(data);

  } catch (err) {

    console.error("Error fetching KPIs:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch KPIs",
    });

  }

}

// =======================================
// USAGE TREND
// =======================================
export async function getUsageTrend(req, res) {
  try {
    console.log("QUERY RECEIVED:", req.query);

    const period = req.query.period || "hourly";

    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 5,
      date: Number(req.query.date) || 25,
    };
 console.log("FILTER SENT TO SERVICE:", filter);

    const data = await fetchUsageTrend(period, filter);

    res.status(200).json(data);

  } catch (err) {

    console.error("Error fetching usage trend:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch usage trend",
    });

  }
}

// =======================================
// MODULE USAGE
// =======================================
export async function getModuleUsage(req, res) {
  try {

    const view = req.query.period || "daily";

    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 5,
      date: Number(req.query.date) || 25,
      week: Number(req.query.week) || 4,
    };

    const data = await fetchModuleUsage(view, filter);

    res.status(200).json(data);

  } catch (err) {

    console.error("Error fetching module usage:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch module usage",
    });

  }
}
// =======================================
// FEATURE SUMMARY
// =======================================

export async function getFeatureSummary(req, res) {
  try {

    const period = req.query.period || "daily";

    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 5,
      date: Number(req.query.date) || 25,
      week: Number(req.query.week) || 4,
    };

    console.log("QUERY:", req.query);
    console.log("FILTER:", filter);

    const data = await fetchFeatureSummary(period, filter);

    console.log("FEATURE DATA:", data);

    res.status(200).json(data);

  } catch (err) {

    console.error("Error fetching feature summary:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch feature summary",
    });

  }
}

// =======================================
// EVENT DISTRIBUTION
// =======================================
// export async function getEventDistribution(req, res) {
//   try {
//     const period = req.query.period || "daily";

//     const filter = {
//       year: Number(req.query.year) || 2026,
//       month: Number(req.query.month) || 5,
//       day: Number(req.query.day) || 25,
//     };

//     const data = await fetchEventDistribution(period, filter);

//     res.status(200).json(data);
//   } catch (err) {
//     console.error("Error fetching event distribution:", err);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch event distribution",
//     });
//   }
// }

export async function getEventDistribution(req, res) {

  try {

    const period = req.query.period || "daily";

    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 5,
      date: Number(req.query.date) || 25,
      week: Number(req.query.week) || 4,
    };

    const data = await fetchEventDistribution(period, filter);

    res.status(200).json(data);

  } catch (err) {

    console.error("Error fetching event distribution:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event distribution",
    });

  }
}

// =======================================
// TOP USERS
// =======================================
export async function getTopUsers(req, res) {
  try {
    const period = req.query.period || "daily";

    const filter = {
      year: Number(req.query.year) || 2026,
      month: Number(req.query.month) || 5,
      day: Number(req.query.day) || 25,
    };

    const data = await fetchTopUsers(period, filter);

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching top users:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top users",
    });
  }
}