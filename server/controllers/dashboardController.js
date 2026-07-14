import { pool } from "../config/mysql.js";
function calculateChange(current, previous) {
    if (
      previous === null ||
      previous === undefined ||
      previous === 0
    ) {
      return {
        value: current,
        change: "0.00%",
        positive: true,
      };
    }
  
    const percent = ((current - previous) / previous) * 100;
  
    return {
      value: current,
      change: `${Math.abs(percent).toFixed(2)}%`,
      positive: percent >= 0,
    };
  }
  export const getKPIs = async (req, res) => {
    try {
      const period = req.query.period || "Daily";
  
      let currentQuery = "";
      let previousQuery = "";
  
      if (period === "Daily") {
  
        currentQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,
            MAX(peak_concurrent) AS peakConcurrent,
            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,
            COUNT(DISTINCT feature_name) AS uniqueFeatures,
            SUM(out_count) AS outRequests
          FROM daily_msc_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_msc_features
          );
        `;
  
        previousQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,
            MAX(peak_concurrent) AS peakConcurrent,
            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,
            COUNT(DISTINCT feature_name) AS uniqueFeatures,
            SUM(out_count) AS outRequests
          FROM daily_msc_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_msc_features
            WHERE feature_date <
            (
              SELECT MAX(feature_date)
              FROM daily_msc_features
            )
          );
        `;
  
      }
  
      else if (period === "Weekly") {
  
        currentQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,
            MAX(peak_concurrent) AS peakConcurrent,
            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,
            COUNT(DISTINCT feature_name) AS uniqueFeatures,
            SUM(out_count) AS outRequests
          FROM weekly_msc_features
          WHERE (year, week)=(
    SELECT year, week
    FROM (
        SELECT DISTINCT year, week
        FROM weekly_msc_features
    ) t
    ORDER BY year DESC, week DESC
    LIMIT 1
)
        `;
  
        previousQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,
            MAX(peak_concurrent) AS peakConcurrent,
            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,
            COUNT(DISTINCT feature_name) AS uniqueFeatures,
            SUM(out_count) AS outRequests
          FROM weekly_msc_features
          WHERE (year, week)=(
    SELECT year, week
    FROM (
        SELECT DISTINCT year, week
        FROM weekly_msc_features
    ) t
    ORDER BY year DESC, week DESC
    LIMIT 1 OFFSET 1
)
        `;
  
      }
  
      else if (period === "Monthly") {
  
        currentQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,
            MAX(peak_concurrent) AS peakConcurrent,
            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,
            COUNT(DISTINCT feature_name) AS uniqueFeatures,
            SUM(out_count) AS outRequests
          FROM monthly_msc_features
          WHERE (year, month)=(
            SELECT year, month
FROM (
    SELECT DISTINCT year, month
    FROM monthly_msc_features
) t
            ORDER BY year DESC, month DESC
            LIMIT 1
          );
        `;
  
        previousQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,
            MAX(peak_concurrent) AS peakConcurrent,
            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,
            COUNT(DISTINCT feature_name) AS uniqueFeatures,
            SUM(out_count) AS outRequests
          FROM monthly_msc_features
          WHERE (year, month)=(
            SELECT year, month
FROM (
    SELECT DISTINCT year, month
    FROM monthly_msc_features
) t
            ORDER BY year DESC, month DESC
            LIMIT 1 OFFSET 1
          );
        `;
  
      }
  
      else {
        return res.status(400).json({
          message: "Invalid period",
        });
      }
  
      const [currentRows] = await pool.query(currentQuery);
      const [previousRows] = await pool.query(previousQuery);
  
      const current = currentRows[0];
      const previous = previousRows[0];
  
      res.json({
        totalRequests: calculateChange(
          current.totalRequests,
          previous?.totalRequests
        ),
  
        peakConcurrent: calculateChange(
          current.peakConcurrent,
          previous?.peakConcurrent
        ),
  
        deniedRequests: calculateChange(
          current.deniedRequests,
          previous?.deniedRequests
        ),
  
        uniqueUsers: calculateChange(
          current.uniqueUsers,
          previous?.uniqueUsers
        ),
  
        uniqueFeatures: calculateChange(
          current.uniqueFeatures,
          previous?.uniqueFeatures
        ),
  
        outRequests: calculateChange(
          current.outRequests,
          previous?.outRequests
        ),
      });
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).json({
        message: "Server Error",
      });
  
    }
  };
  export const getTrendData = async (req, res) => {
    try {
      const period = req.query.period || "Daily";
  
      let query = "";
  
      if (period === "Daily") {
        query = `
          SELECT
            DATE_FORMAT(feature_date,'%d %b') AS day,
            MAX(peak_concurrent) AS value
          FROM daily_msc_features
          GROUP BY feature_date
          ORDER BY feature_date;
        `;
      }
  
      else if (period === "Weekly") {
        query = `
          SELECT
            CONCAT('Week ', week) AS day,
            MAX(peak_concurrent) AS value
          FROM weekly_msc_features
          GROUP BY year, week
          ORDER BY year, week;
        `;
      }
  
      else if (period === "Monthly") {
        query = `
          SELECT
  CASE month
    WHEN 1 THEN 'January'
    WHEN 2 THEN 'February'
    WHEN 3 THEN 'March'
    WHEN 4 THEN 'April'
    WHEN 5 THEN 'May'
    WHEN 6 THEN 'June'
    WHEN 7 THEN 'July'
    WHEN 8 THEN 'August'
    WHEN 9 THEN 'September'
    WHEN 10 THEN 'October'
    WHEN 11 THEN 'November'
    WHEN 12 THEN 'December'
  END AS day,
  MAX(peak_concurrent) AS value
FROM monthly_msc_features
GROUP BY year, month
ORDER BY year, month;
        `;
      }
  
      else {
        return res.status(400).json({
          message: "Invalid period",
        });
      }
  
      const [rows] = await pool.query(query);
  
      res.json(rows);
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).json({
        message: "Server Error",
      });
  
    }
  };
  export const getTopModules = async (req, res) => {
    try {
      const period = req.query.period || "Daily";
  
      let query = "";
  
      if (period === "Daily") {
  
        query = `
          SELECT
            feature_name AS name,
            MAX(peak_concurrent) AS value
          FROM daily_msc_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_msc_features
          )
          GROUP BY feature_name
          ORDER BY value DESC
          LIMIT 8;
        `;
  
      }
  
      else if (period === "Weekly") {
  
        query = `
          SELECT
            feature_name AS name,
            MAX(peak_concurrent) AS value
          FROM weekly_msc_features
          WHERE (year, week) = (
            SELECT year, week
            FROM (
              SELECT DISTINCT year, week
              FROM weekly_msc_features
            ) weeks
            ORDER BY year DESC, week DESC
            LIMIT 1
          )
          GROUP BY feature_name
          ORDER BY value DESC
          LIMIT 8;
        `;
  
      }
  
      else if (period === "Monthly") {
  
        query = `
          SELECT
            feature_name AS name,
            MAX(peak_concurrent) AS value
          FROM monthly_msc_features
          WHERE (year, month) = (
            SELECT year, month
            FROM (
              SELECT DISTINCT year, month
              FROM monthly_msc_features
            ) months
            ORDER BY year DESC, month DESC
            LIMIT 1
          )
          GROUP BY feature_name
          ORDER BY value DESC
          LIMIT 8;
        `;
  
      }
  
      else {
        return res.status(400).json({
          message: "Invalid period",
        });
      }
  
      const [rows] = await pool.query(query);
  
      res.json(rows);
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).json({
        message: "Server Error",
      });
  
    }
  };
  export const getEventDistribution = async (req, res) => {
    try {
      const period = req.query.period || "Daily";
  
      let query = "";
  
      if (period === "Daily") {
        query = `
          SELECT
            SUM(out_count) AS out_count,
            SUM(in_count) AS in_count,
            SUM(denied_count) AS denied_count,
            SUM(queued_count) AS queued_count,
            SUM(dequeued_count) AS dequeued_count
          FROM daily_msc_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_msc_features
          );
        `;
      }
  
      else if (period === "Weekly") {
        query = `
          SELECT
            SUM(out_count) AS out_count,
            SUM(in_count) AS in_count,
            SUM(denied_count) AS denied_count,
            SUM(queued_count) AS queued_count,
            SUM(dequeued_count) AS dequeued_count
          FROM weekly_msc_features
          WHERE (year, week)=(
            SELECT year, week
            FROM (
              SELECT DISTINCT year, week
              FROM weekly_msc_features
            ) weeks
            ORDER BY year DESC, week DESC
            LIMIT 1
          );
        `;
      }
  
      else if (period === "Monthly") {
        query = `
          SELECT
            SUM(out_count) AS out_count,
            SUM(in_count) AS in_count,
            SUM(denied_count) AS denied_count,
            SUM(queued_count) AS queued_count,
            SUM(dequeued_count) AS dequeued_count
          FROM monthly_msc_features
          WHERE (year, month)=(
            SELECT year, month
            FROM (
              SELECT DISTINCT year, month
              FROM monthly_msc_features
            ) months
            ORDER BY year DESC, month DESC
            LIMIT 1
          );
        `;
      }
  
      else {
        return res.status(400).json({
          message: "Invalid period",
        });
      }
  
      const [rows] = await pool.query(query);
  
      const data = [
        { name: "OUT", value: Number(rows[0].out_count) },
        { name: "IN", value: Number(rows[0].in_count) },
        { name: "DENIED", value: Number(rows[0].denied_count) },
        { name: "QUEUED", value: Number(rows[0].queued_count) },
        { name: "DEQUEUED", value: Number(rows[0].dequeued_count) },
      ];
  
      res.json(data);
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).json({
        message: "Server Error",
      });
  
    }
  };
  export const getFeatureSummary = async (req, res) => {
    try {
  
      const period = req.query.period || "Daily";
  
      let query = "";
  
      if (period === "Daily") {
  
        query = `
          SELECT
            feature_name AS feature,
            out_count AS outCount,
            in_count AS inCount,
            denied_count AS denied,
            queued_count AS queued,
            dequeued_count AS dequeued,
            peak_concurrent AS peak,
            unique_users AS users
          FROM daily_msc_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_msc_features
          )
          ORDER BY out_count DESC;
        `;
  
      }
  
      else if (period === "Weekly") {
  
        query = `
          SELECT
            feature_name AS feature,
            out_count AS outCount,
            in_count AS inCount,
            denied_count AS denied,
            queued_count AS queued,
            dequeued_count AS dequeued,
            peak_concurrent AS peak,
            unique_users AS users
          FROM weekly_msc_features
          WHERE (year, week) = (
            SELECT year, week
            FROM (
              SELECT DISTINCT year, week
              FROM weekly_msc_features
            ) weeks
            ORDER BY year DESC, week DESC
            LIMIT 1
          )
          ORDER BY out_count DESC;
        `;
  
      }
  
      else if (period === "Monthly") {
  
        query = `
          SELECT
            feature_name AS feature,
            out_count AS outCount,
            in_count AS inCount,
            denied_count AS denied,
            queued_count AS queued,
            dequeued_count AS dequeued,
            peak_concurrent AS peak,
            unique_users AS users
          FROM monthly_msc_features
          WHERE (year, month) = (
            SELECT year, month
            FROM (
              SELECT DISTINCT year, month
              FROM monthly_msc_features
            ) months
            ORDER BY year DESC, month DESC
            LIMIT 1
          )
          ORDER BY out_count DESC;
        `;
  
      }
  
      else {
  
        return res.status(400).json({
          message: "Invalid period",
        });
  
      }
  
      const [rows] = await pool.query(query);
  
      res.json(rows);
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).json({
        message: "Server Error",
      });
  
    }
  };