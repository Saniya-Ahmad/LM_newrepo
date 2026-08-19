import { pool } from "../config/mysql.js";
function calculateChange(current, previous) {
  if (previous === null || previous === undefined || previous === 0) {
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

            (
              SELECT MAX(peak_concurrent)
              FROM daily_comsol_modules
              WHERE module_date = (
                SELECT MAX(module_date)
                FROM daily_comsol_modules
              )
            ) AS peakConcurrent,

            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,

            (
              SELECT COUNT(*)
              FROM daily_comsol_modules
              WHERE module_date = (
                SELECT MAX(module_date)
                FROM daily_comsol_modules
              )
              AND (
                out_count > 0 OR
                in_count > 0 OR
                denied_count > 0 OR
                queued_count > 0 OR
                dequeued_count > 0
              )
            ) AS uniqueModules,

            SUM(out_count) AS outRequests

          FROM daily_comsol_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_comsol_features
          );
        `;

      previousQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,

            (
              SELECT MAX(peak_concurrent)
              FROM daily_comsol_modules
              WHERE module_date = (
                SELECT MAX(module_date)
                FROM daily_comsol_modules
                WHERE module_date < (
                  SELECT MAX(module_date)
                  FROM daily_comsol_modules
                )
              )
            ) AS peakConcurrent,

            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,

            (
              SELECT COUNT(*)
              FROM daily_comsol_modules
              WHERE module_date = (
                SELECT MAX(module_date)
                FROM daily_comsol_modules
                WHERE module_date < (
                  SELECT MAX(module_date)
                  FROM daily_comsol_modules
                )
              )
              AND (
                out_count > 0 OR
                in_count > 0 OR
                denied_count > 0 OR
                queued_count > 0 OR
                dequeued_count > 0
              )
            ) AS uniqueModules,

            SUM(out_count) AS outRequests

          FROM daily_comsol_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_comsol_features
            WHERE feature_date <
            (
              SELECT MAX(feature_date)
              FROM daily_comsol_features
            )
          );
        `;
    } else if (period === "Weekly") {
      currentQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,

            (
              SELECT MAX(peak_concurrent)
              FROM weekly_comsol_modules
              WHERE (year, week)=(
                SELECT year, week
                FROM (
                  SELECT DISTINCT year, week
                  FROM weekly_comsol_modules
                ) t
                ORDER BY year DESC, week DESC
                LIMIT 1
              )
            ) AS peakConcurrent,

            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,

            (
              SELECT COUNT(*)
              FROM weekly_comsol_modules
              WHERE (year, week)=(
                SELECT year, week
                FROM (
                  SELECT DISTINCT year, week
                  FROM weekly_comsol_modules
                ) t
                ORDER BY year DESC, week DESC
                LIMIT 1
              )
              AND (
                out_count > 0 OR
                in_count > 0 OR
                denied_count > 0 OR
                queued_count > 0 OR
                dequeued_count > 0
              )
            ) AS uniqueModules,

            SUM(out_count) AS outRequests

          FROM weekly_comsol_features
          WHERE (year, week)=(
    SELECT year, week
    FROM (
        SELECT DISTINCT year, week
        FROM weekly_comsol_features
    ) t
    ORDER BY year DESC, week DESC
    LIMIT 1
)
        `;

      previousQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,

            (
              SELECT MAX(peak_concurrent)
              FROM weekly_comsol_modules
              WHERE (year, week)=(
                SELECT year, week
                FROM (
                  SELECT DISTINCT year, week
                  FROM weekly_comsol_modules
                ) t
                ORDER BY year DESC, week DESC
                LIMIT 1 OFFSET 1
              )
            ) AS peakConcurrent,

            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,

            (
              SELECT COUNT(*)
              FROM weekly_comsol_modules
              WHERE (year, week)=(
                SELECT year, week
                FROM (
                  SELECT DISTINCT year, week
                  FROM weekly_comsol_modules
                ) t
                ORDER BY year DESC, week DESC
                LIMIT 1 OFFSET 1
              )
              AND (
                out_count > 0 OR
                in_count > 0 OR
                denied_count > 0 OR
                queued_count > 0 OR
                dequeued_count > 0
              )
            ) AS uniqueModules,

            SUM(out_count) AS outRequests

          FROM weekly_comsol_features
          WHERE (year, week)=(
    SELECT year, week
    FROM (
        SELECT DISTINCT year, week
        FROM weekly_comsol_features
    ) t
    ORDER BY year DESC, week DESC
    LIMIT 1 OFFSET 1
)
        `;
    } else if (period === "Monthly") {
      currentQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,

            (
              SELECT MAX(peak_concurrent)
              FROM monthly_comsol_modules
              WHERE (year, month)=(
                SELECT year, month
                FROM (
                  SELECT DISTINCT year, month
                  FROM monthly_comsol_modules
                ) t
                ORDER BY year DESC, month DESC
                LIMIT 1
              )
            ) AS peakConcurrent,

            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,

            (
              SELECT COUNT(*)
              FROM monthly_comsol_modules
              WHERE (year, month)=(
                SELECT year, month
                FROM (
                  SELECT DISTINCT year, month
                  FROM monthly_comsol_modules
                ) t
                ORDER BY year DESC, month DESC
                LIMIT 1
              )
              AND (
                out_count > 0 OR
                in_count > 0 OR
                denied_count > 0 OR
                queued_count > 0 OR
                dequeued_count > 0
              )
            ) AS uniqueModules,

            SUM(out_count) AS outRequests

          FROM monthly_comsol_features
          WHERE (year, month)=(
            SELECT year, month
FROM (
    SELECT DISTINCT year, month
    FROM monthly_comsol_features
) t
            ORDER BY year DESC, month DESC
            LIMIT 1
          );
        `;

      previousQuery = `
          SELECT
            SUM(out_count + in_count + denied_count + queued_count + dequeued_count) AS totalRequests,

            (
              SELECT MAX(peak_concurrent)
              FROM monthly_comsol_modules
              WHERE (year, month)=(
                SELECT year, month
                FROM (
                  SELECT DISTINCT year, month
                  FROM monthly_comsol_modules
                ) t
                ORDER BY year DESC, month DESC
                LIMIT 1 OFFSET 1
              )
            ) AS peakConcurrent,

            SUM(denied_count) AS deniedRequests,
            SUM(unique_users) AS uniqueUsers,

            (
              SELECT COUNT(*)
              FROM monthly_comsol_modules
              WHERE (year, month)=(
                SELECT year, month
                FROM (
                  SELECT DISTINCT year, month
                  FROM monthly_comsol_modules
                ) t
                ORDER BY year DESC, month DESC
                LIMIT 1 OFFSET 1
              )
              AND (
                out_count > 0 OR
                in_count > 0 OR
                denied_count > 0 OR
                queued_count > 0 OR
                dequeued_count > 0
              )
            ) AS uniqueModules,

            SUM(out_count) AS outRequests

          FROM monthly_comsol_features
          WHERE (year, month)=(
            SELECT year, month
FROM (
    SELECT DISTINCT year, month
    FROM monthly_comsol_features
) t
            ORDER BY year DESC, month DESC
            LIMIT 1 OFFSET 1
          );
        `;
    } else {
      return res.status(400).json({
        message: "Invalid period",
      });
    }

    const [currentRows] = await pool.query(currentQuery);
    const [previousRows] = await pool.query(previousQuery);

    const current = currentRows[0] || {};
    const previous = previousRows[0] || {};

    res.json({
      totalRequests: calculateChange(
        current.totalRequests,
        previous.totalRequests,
      ),

      peakConcurrent: calculateChange(
        current.peakConcurrent,
        previous.peakConcurrent,
      ),

      deniedRequests: calculateChange(
        current.deniedRequests,
        previous.deniedRequests,
      ),

      uniqueUsers: calculateChange(current.uniqueUsers, previous.uniqueUsers),

      uniqueModules: calculateChange(
        current.uniqueModules,
        previous.uniqueModules,
      ),

      outRequests: calculateChange(current.outRequests, previous.outRequests),
    });
  } catch (err) {
    console.error("Error fetching KPIs:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch KPI data",
      error: err.message,
    });
  }
};
export const getTrendData = async (req, res) => {
  try {
    const period = req.query.period || "Daily";
    const module = req.query.module || "All";

    let query = "";

    if (period === "Daily") {
      if (module === "All") {
        query = `
          SELECT
            DATE_FORMAT(module_date,'%d %b') AS day,
            MAX(peak_concurrent) AS value
          FROM daily_comsol_modules
          GROUP BY module_date
          ORDER BY module_date;
        `;
      } else {
        query = `
          SELECT
            DATE_FORMAT(module_date,'%d %b') AS day,
            peak_concurrent AS value
          FROM daily_comsol_modules
          WHERE module_name = ?
          ORDER BY module_date;
        `;
      }
    } else if (period === "Weekly") {
      if (module === "All") {
        query = `
          SELECT
            CONCAT('Week ', week) AS day,
            MAX(peak_concurrent) AS value
          FROM weekly_comsol_modules
          GROUP BY year, week
          ORDER BY year, week;
        `;
      } else {
        query = `
          SELECT
            CONCAT('Week ', week) AS day,
            peak_concurrent AS value
          FROM weekly_comsol_modules
          WHERE module_name = ?
          ORDER BY year, week;
        `;
      }
    } else if (period === "Monthly") {
      if (module === "All") {
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
FROM monthly_comsol_modules
GROUP BY year, month
ORDER BY year, month;
        `;
      } else {
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
  peak_concurrent AS value
FROM monthly_comsol_modules
WHERE module_name = ?
ORDER BY year, month;
        `;
      }
    } else {
      return res.status(400).json({
        message: "Invalid period",
      });
    }

    let rows;
    if (module === "All") {
      [rows] = await pool.query(query);
    } else {
      [rows] = await pool.query(query, [module]);
    }

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
    const type = req.query.type || "Feature";

    let table = "";
    let whereClause = "";

    if (type === "Feature") {
      if (period === "Daily") {
        table = "daily_comsol_features";
        whereClause = `
          feature_date = (
            SELECT MAX(feature_date)
            FROM daily_comsol_features
          )
        `;
      } else if (period === "Weekly") {
        table = "weekly_comsol_features";
        whereClause = `
          (year, week) = (
            SELECT year, week
            FROM (
              SELECT DISTINCT year, week
              FROM weekly_comsol_features
            ) t
            ORDER BY year DESC, week DESC
            LIMIT 1
          )
        `;
      } else if (period === "Monthly") {
        table = "monthly_comsol_features";
        whereClause = `
          (year, month) = (
            SELECT year, month
            FROM (
              SELECT DISTINCT year, month
              FROM monthly_comsol_features
            ) t
            ORDER BY year DESC, month DESC
            LIMIT 1
          )
        `;
      }
    } else {
      if (period === "Daily") {
        table = "daily_comsol_modules";
        whereClause = `
          module_date = (
            SELECT MAX(module_date)
            FROM daily_comsol_modules
          )
        `;
      } else if (period === "Weekly") {
        table = "weekly_comsol_modules";
        whereClause = `
          (year, week) = (
            SELECT year, week
            FROM (
              SELECT DISTINCT year, week
              FROM weekly_comsol_modules
            ) t
            ORDER BY year DESC, week DESC
            LIMIT 1
          )
        `;
      } else if (period === "Monthly") {
        table = "monthly_comsol_modules";
        whereClause = `
          (year, month) = (
            SELECT year, month
            FROM (
              SELECT DISTINCT year, month
              FROM monthly_comsol_modules
            ) t
            ORDER BY year DESC, month DESC
            LIMIT 1
          )
        `;
      }
    }

    if (!table) {
      return res.status(400).json({
        message: "Invalid period",
      });
    }

    let query = "";

    if (type === "Feature") {
      query = `
        SELECT
          fm.feature_display_name AS name,
          t.peak_concurrent AS value
        FROM ${table} t
        JOIN comsol_feature_mapping fm
          ON t.feature_name = fm.feature_name
        WHERE ${whereClause}
        ORDER BY t.peak_concurrent DESC
        LIMIT 8;
      `;
    } else {
      query = `
        SELECT
          module_name AS name,
          peak_concurrent AS value
        FROM ${table}
        WHERE ${whereClause}
        ORDER BY peak_concurrent DESC
        LIMIT 8;
      `;
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
          FROM daily_comsol_features
          WHERE feature_date = (
            SELECT MAX(feature_date)
            FROM daily_comsol_features
          );
        `;
    } else if (period === "Weekly") {
      query = `
          SELECT
            SUM(out_count) AS out_count,
            SUM(in_count) AS in_count,
            SUM(denied_count) AS denied_count,
            SUM(queued_count) AS queued_count,
            SUM(dequeued_count) AS dequeued_count
          FROM weekly_comsol_features
          WHERE (year, week)=(
            SELECT year, week
            FROM (
              SELECT DISTINCT year, week
              FROM weekly_comsol_features
            ) weeks
            ORDER BY year DESC, week DESC
            LIMIT 1
          );
        `;
    } else if (period === "Monthly") {
      query = `
          SELECT
            SUM(out_count) AS out_count,
            SUM(in_count) AS in_count,
            SUM(denied_count) AS denied_count,
            SUM(queued_count) AS queued_count,
            SUM(dequeued_count) AS dequeued_count
          FROM monthly_comsol_features
          WHERE (year, month)=(
            SELECT year, month
            FROM (
              SELECT DISTINCT year, month
              FROM monthly_comsol_features
            ) months
            ORDER BY year DESC, month DESC
            LIMIT 1
          );
        `;
    } else {
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
            fm.feature_display_name AS feature,
            fm.module_name AS module,
            d.out_count AS outCount,
            d.in_count AS inCount,
            d.denied_count AS denied,
            d.queued_count AS queued,
            d.dequeued_count AS dequeued,
            d.peak_concurrent AS peak,
            d.unique_users AS users
          FROM daily_comsol_features d
          JOIN comsol_feature_mapping fm
            ON d.feature_name = fm.feature_name
          WHERE d.feature_date = (
            SELECT MAX(feature_date)
            FROM daily_comsol_features
          )
          ORDER BY d.out_count DESC;
        `;
    } else if (period === "Weekly") {
      query = `
          SELECT
            fm.feature_display_name AS feature,
            fm.module_name AS module,
            w.out_count AS outCount,
            w.in_count AS inCount,
            w.denied_count AS denied,
            w.queued_count AS queued,
            w.dequeued_count AS dequeued,
            w.peak_concurrent AS peak,
            w.unique_users AS users
          FROM weekly_comsol_features w
          JOIN comsol_feature_mapping fm
            ON w.feature_name = fm.feature_name
          WHERE (w.year, w.week) = (
            SELECT year, week
            FROM (
              SELECT DISTINCT year, week
              FROM weekly_comsol_features
            ) weeks
            ORDER BY year DESC, week DESC
            LIMIT 1
          )
          ORDER BY w.out_count DESC;
        `;
    } else if (period === "Monthly") {
      query = `
          SELECT
            fm.feature_display_name AS feature,
            fm.module_name AS module,
            m.out_count AS outCount,
            m.in_count AS inCount,
            m.denied_count AS denied,
            m.queued_count AS queued,
            m.dequeued_count AS dequeued,
            m.peak_concurrent AS peak,
            m.unique_users AS users
          FROM monthly_comsol_features m
          JOIN comsol_feature_mapping fm
            ON m.feature_name = fm.feature_name
          WHERE (m.year, m.month) = (
            SELECT year, month
            FROM (
              SELECT DISTINCT year, month
              FROM monthly_comsol_features
            ) months
            ORDER BY year DESC, month DESC
            LIMIT 1
          )
          ORDER BY m.out_count DESC;
        `;
    } else {
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

export const getModules = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT module_name
      FROM comsol_feature_mapping
      ORDER BY module_name;
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
