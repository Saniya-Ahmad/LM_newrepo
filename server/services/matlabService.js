import { pool } from "../config/mysql.js";

function getSummaryTable(period) {
  switch (period) {
    case "weekly":
      return "weekly_matlab_summary";

    case "daily":
      return "daily_matlab_summary";

    default:
      return null; // hourly uses raw log
  }
}

function buildWhereClause(period, month) {
  let where = "";
  const params = [];

  if (period === "daily") {
    where = "WHERE MONTH(event_date)=?";
    params.push(month);
  }

  else if (period === "weekly") {
    where = "WHERE month=?";
    params.push(month);
  }

  return { where, params };
}



// ==========================================
// KPI CARDS
// ==========================================

// export async function fetchKPIs(view, filter = {}) {

//   let query = "";
//   let params = [];

//   // ----------------------------------
//   // HOURLY (Selected Date)
//   // ----------------------------------

//   if (view === "hourly") {

//     query = `
//       SELECT
//         COALESCE(SUM(checkout_count),0) AS checkout,
//         COALESCE(SUM(checkin_count),0) AS checkin,
//         COALESCE(SUM(denied_count),0) AS denied,
//         COALESCE(SUM(unique_users),0) AS users,
//         COALESCE(SUM(active_sessions),0) AS active,
//         COALESCE(MAX(peak_concurrent),0) AS peak
//       FROM daily_matlab_summary
//       WHERE event_date = ?
//     `;

//     params = [filter.date];
//   }

//   // ----------------------------------
//   // DAILY (Selected Month)
//   // ----------------------------------

//   else if (view === "daily") {

//     query = `
//       SELECT
//         COALESCE(SUM(checkout_count),0) AS checkout,
//         COALESCE(SUM(checkin_count),0) AS checkin,
//         COALESCE(SUM(denied_count),0) AS denied,
//         COALESCE(SUM(unique_users),0) AS users,
//         COALESCE(SUM(active_sessions),0) AS active,
//         COALESCE(MAX(peak_concurrent),0) AS peak
//       FROM daily_matlab_summary
//       WHERE YEAR(event_date)=?
//       AND MONTH(event_date)=?
//     `;

//     params = [filter.year, filter.month];
//   }

//   // ----------------------------------
//   // WEEKLY (Selected Month)
//   // ----------------------------------

//   else {

//     query = `
//       SELECT
//         COALESCE(SUM(checkout_count),0) AS checkout,
//         COALESCE(SUM(checkin_count),0) AS checkin,
//         COALESCE(SUM(denied_count),0) AS denied,
//         COALESCE(SUM(unique_users),0) AS users,
//         COALESCE(SUM(active_sessions),0) AS active,
//         COALESCE(MAX(peak_concurrent),0) AS peak
//       FROM weekly_matlab_summary
//       WHERE year=?
//       AND month=?
//     `;

//     params = [filter.year, filter.month];
//   }

//   const [rows] = await pool.query(query, params);

//   return rows[0];
// }
export async function fetchKPIs(view = "daily", filter = {}) {

  let query = "";
  let params = [];

  // ==========================================================
  // DAILY (Selected Date)
  // ==========================================================
  if (view === "daily") {

    query = `
      SELECT
        COALESCE(SUM(checkout_count),0) AS checkout,
        COALESCE(SUM(checkin_count),0) AS checkin,
        COALESCE(SUM(denied_count),0) AS denied,
        COALESCE(SUM(unique_users),0) AS users,
        COALESCE(SUM(active_sessions),0) AS active,
        COALESCE(MAX(peak_concurrent),0) AS peak
      FROM daily_matlab_summary
      WHERE event_date = ?
    `;

    const date =
      `${filter.year || 2026}-${String(filter.month || 5).padStart(2, "0")}-${String(filter.date || 25).padStart(2, "0")}`;

    params = [date];
  }

  // ==========================================================
  // WEEKLY (Selected Week)
  // ==========================================================
  else if (view === "weekly") {

    query = `
      SELECT
        COALESCE(SUM(checkout_count),0) AS checkout,
        COALESCE(SUM(checkin_count),0) AS checkin,
        COALESCE(SUM(denied_count),0) AS denied,
        COALESCE(SUM(unique_users),0) AS users,
        COALESCE(SUM(active_sessions),0) AS active,
        COALESCE(MAX(peak_concurrent),0) AS peak
      FROM weekly_matlab_summary
      WHERE year = ?
        AND month = ?
        AND week_no = ?
    `;

    params = [
      filter.year || 2026,
      filter.month || 5,
      filter.week || 4,
    ];
  }

  // ==========================================================
  // MONTHLY (Selected Month)
  // ==========================================================
  else if (view === "monthly") {

    query = `
      SELECT
        COALESCE(SUM(checkout_count),0) AS checkout,
        COALESCE(SUM(checkin_count),0) AS checkin,
        COALESCE(SUM(denied_count),0) AS denied,
        COALESCE(SUM(unique_users),0) AS users,
        COALESCE(SUM(active_sessions),0) AS active,
        COALESCE(MAX(peak_concurrent),0) AS peak
      FROM monthly_matlab_summary
      WHERE year = ?
        AND month = ?
    `;

    params = [
      filter.year || 2026,
      filter.month || 5,
    ];
  }

  const [rows] = await pool.query(query, params);

  return rows[0];
}
// ======================================================
// MODULE USAGE
// ======================================================


export async function fetchModuleUsage(view = "daily", filter = {}) {

  let query = "";
  let params = [];

  // ==========================================================
  // DAILY (Selected Date)
  // ==========================================================
  if (view === "daily") {

    query = `
      SELECT
          feature,
          SUM(checkout_count) AS total_usage
      FROM daily_matlab_summary
      WHERE event_date = ?
      GROUP BY feature
      ORDER BY total_usage DESC
      LIMIT 10
    `;

    const date =
      `${filter.year || 2026}-${String(filter.month || 5).padStart(2, "0")}-${String(filter.date || 25).padStart(2, "0")}`;

    params = [date];
  }

  // ==========================================================
  // WEEKLY (Selected Week)
  // ==========================================================
  else if (view === "weekly") {

    query = `
      SELECT
          feature,
          SUM(checkout_count) AS total_usage
      FROM weekly_matlab_summary
      WHERE year = ?
        AND month = ?
        AND week_no = ?
      GROUP BY feature
      ORDER BY total_usage DESC
      LIMIT 10
    `;

    params = [
      filter.year || 2026,
      filter.month || 5,
      filter.week || 4
    ];
  }

  // ==========================================================
  // MONTHLY (Selected Month)
  // ==========================================================
  else if (view === "monthly") {

    query = `
      SELECT
          feature,
          SUM(checkout_count) AS total_usage
      FROM monthly_matlab_summary
      WHERE year = ?
        AND month = ?
      GROUP BY feature
      ORDER BY total_usage DESC
      LIMIT 10
    `;

    params = [
      filter.year || 2026,
      filter.month || 5
    ];
  }

  const [rows] = await pool.query(query, params);

  return rows;
}


// ==========================================
// FEATURE SUMMARY
// ==========================================

export async function fetchFeatureSummary(view = "daily", filter = {}) {

  let query = "";
  let params = [];

  // ==========================================================
  // DAILY (Selected Date)
  // ==========================================================
  if (view === "daily") {

    query = `
      SELECT
          feature,

          SUM(checkout_count) AS checkout_count,
          SUM(checkin_count) AS checkin_count,
          SUM(denied_count) AS denied_count,
          SUM(unique_users) AS unique_users,
          SUM(active_sessions) AS active_sessions,
          MAX(peak_concurrent) AS peak_concurrent

      FROM daily_matlab_summary

      WHERE event_date = ?

      GROUP BY feature

      ORDER BY checkout_count DESC
    `;

    const date =
      `${filter.year || 2026}-${String(filter.month || 5).padStart(2, "0")}-${String(filter.date || 25).padStart(2, "0")}`;

    params = [date];

  }

  // ==========================================================
  // WEEKLY (Selected Week)
  // ==========================================================
  else if (view === "weekly") {

    query = `
      SELECT
          feature,

          SUM(checkout_count) AS checkout_count,
          SUM(checkin_count) AS checkin_count,
          SUM(denied_count) AS denied_count,
          SUM(unique_users) AS unique_users,
          SUM(active_sessions) AS active_sessions,
          MAX(peak_concurrent) AS peak_concurrent

      FROM weekly_matlab_summary

      WHERE year = ?
        AND month = ?
        AND week_no = ?

      GROUP BY feature

      ORDER BY checkout_count DESC
    `;

    params = [
      filter.year || 2026,
      filter.month || 5,
      filter.week || 4,
    ];

  }

  // ==========================================================
  // MONTHLY (Selected Month)
  // ==========================================================
  else if (view === "monthly") {

    query = `
      SELECT
          feature,

          SUM(checkout_count) AS checkout_count,
          SUM(checkin_count) AS checkin_count,
          SUM(denied_count) AS denied_count,
          SUM(unique_users) AS unique_users,
          SUM(active_sessions) AS active_sessions,
          MAX(peak_concurrent) AS peak_concurrent

      FROM monthly_matlab_summary

      WHERE year = ?
        AND month = ?

      GROUP BY feature

      ORDER BY checkout_count DESC
    `;

    params = [
      filter.year || 2026,
      filter.month || 5,
    ];

  }

  const [rows] = await pool.query(query, params);

  return rows;
}

// ==========================================
// EVENT DISTRIBUTION
// ==========================================



export async function fetchEventDistribution(view = "daily", filter = {}) {

  let query = "";
  let params = [];

  // ==========================================================
  // DAILY (Selected Date)
  // ==========================================================
  if (view === "daily") {

    query = `
      SELECT

        COALESCE(SUM(checkout_count),0) AS checkout,
        COALESCE(SUM(checkin_count),0) AS checkin,
        COALESCE(SUM(denied_count),0) AS denied

      FROM daily_matlab_summary

      WHERE event_date = ?
    `;

    const date =
      `${filter.year || 2026}-${String(filter.month || 5).padStart(2, "0")}-${String(filter.date || 25).padStart(2, "0")}`;

    params = [date];
  }

  // ==========================================================
  // WEEKLY (Selected Week)
  // ==========================================================
  else if (view === "weekly") {

    query = `
      SELECT

        COALESCE(SUM(checkout_count),0) AS checkout,
        COALESCE(SUM(checkin_count),0) AS checkin,
        COALESCE(SUM(denied_count),0) AS denied

      FROM weekly_matlab_summary

      WHERE
        year = ?
        AND month = ?
        AND week_no = ?
    `;

    params = [
      filter.year || 2026,
      filter.month || 5,
      filter.week || 4
    ];
  }

  // ==========================================================
  // MONTHLY (Selected Month)
  // ==========================================================
  else if (view === "monthly") {

    query = `
      SELECT

        COALESCE(SUM(checkout_count),0) AS checkout,
        COALESCE(SUM(checkin_count),0) AS checkin,
        COALESCE(SUM(denied_count),0) AS denied

      FROM monthly_matlab_summary

      WHERE
        year = ?
        AND month = ?
    `;

    params = [
      filter.year || 2026,
      filter.month || 5
    ];
  }

  const [rows] = await pool.query(query, params);

  return rows[0];
}
// ======================================================
// TOP USERS
// ======================================================

export async function fetchTopUsers(period = "daily", filter = {}) {

  let where = "WHERE event_type = 'CHECKOUT'";
  const params = [];

  switch (period) {

    case "daily":

      if (filter.date) {
        where += " AND event_date = ?";
        params.push(filter.date);
      }

      break;

    case "weekly":

      if (filter.year && filter.week) {

        where += " AND YEAR(event_date) = ? AND WEEK(event_date,1) = ?";

        params.push(filter.year);
        params.push(filter.week);

      }

      break;

    case "monthly":

      if (filter.year && filter.month) {

        where += " AND YEAR(event_date) = ? AND MONTH(event_date) = ?";

        params.push(filter.year);
        params.push(filter.month);

      }

      break;

    default:
      break;
  }

  const [rows] = await pool.query(

    `
    SELECT

      username,

      COUNT(*) AS total_usage

    FROM matlab_license_log

    ${where}

    GROUP BY username

    ORDER BY total_usage DESC

    LIMIT 10
    `,
    params

  );

  return rows;

}
export async function fetchUsageTrend(period = "daily", filter = {}) {

  // ==========================================================
  // DAILY
  // ==========================================================
  if (period === "daily") {

    const [rows] = await pool.query(
      `
      SELECT
          DAY(event_date) AS day,
          MAX(peak_concurrent) AS peak
      FROM daily_matlab_summary
      WHERE YEAR(event_date) = ?
        AND MONTH(event_date) = ?
      GROUP BY DAY(event_date)
      ORDER BY DAY(event_date)
      `,
      [
        filter.year || 2026,
        filter.month || 5,
      ]
    );

    const dayMap = {};

    rows.forEach(row => {
      dayMap[row.day] = Number(row.peak);
    });

    const daysInMonth = new Date(
      filter.year || 2026,
      filter.month || 5,
      0
    ).getDate();

    const result = [];

    for (let d = 1; d <= daysInMonth; d++) {
      result.push({
        label: d,
        peak: dayMap[d] || 0,
      });
    }

    return result;
  }

// ==========================================================
// WEEKLY
// ==========================================================
if (period === "weekly") {

  const [rows] = await pool.query(
    `
    SELECT
        week_no,
        MAX(peak_concurrent) AS peak
    FROM weekly_matlab_summary
    WHERE year = ?
      AND month = ?
    GROUP BY week_no
    ORDER BY week_no
    `,
    [
      filter.year || 2026,
      filter.month || 5,
    ]
  );

  const weekMap = {};

  rows.forEach(row => {
    weekMap[row.week_no] = Number(row.peak);
  });

  const result = [];

  for (let week = 1; week <= 5; week++) {
    result.push({
      label: `Week ${week}`,
      peak: weekMap[week] || 0,
    });
  }

  return result;
}  

  // ==========================================================
  // MONTHLY
  // ==========================================================
  const [rows] = await pool.query(
    `
    SELECT
        month,
        MAX(peak_concurrent) AS peak
    FROM monthly_matlab_summary
    WHERE year = ?
    GROUP BY month
    ORDER BY month
    `,
    [
      filter.year || 2026,
    ]
  );

  const monthMap = {};

  rows.forEach(row => {
    monthMap[row.month] = Number(row.peak);
  });

  const monthNames = [
    "Jan","Feb","Mar","Apr",
    "May","Jun","Jul","Aug",
    "Sep","Oct","Nov","Dec"
  ];

  const result = [];

  for (let m = 1; m <= 12; m++) {
    result.push({
      label: monthNames[m - 1],
      peak: monthMap[m] || 0,
    });
  }

  return result;
}