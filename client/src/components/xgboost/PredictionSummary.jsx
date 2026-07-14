import React from "react";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const PredictionSummary = ({
  selectedModule,
  predictions = [],
  metrics = {},
}) => {

  const data =
    predictions.find(
      (item) => item.module === selectedModule
    ) || {};

  if (!data.module) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Prediction Summary
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-4">
          No prediction data available.
        </p>
      </div>
    );
  }

  const calculateChange = (current, predicted) => {

    if (current === 0) return "0%";

    const value =
      ((predicted - current) / current) * 100;

    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

  };

  const rows = [

    {
      metric: "Peak Concurrent",
      current: data.currentPeak,
      predicted: data.predictedPeak,
      change: calculateChange(
        data.currentPeak,
        data.predictedPeak
      ),
      positive:
        data.predictedPeak >= data.currentPeak,
    },

    {
      metric: "OUT Requests",
      current: data.currentOut,
      predicted: data.predictedOut,
      change: calculateChange(
        data.currentOut,
        data.predictedOut
      ),
      positive:
        data.predictedOut >= data.currentOut,
    },

    {
      metric: "Denied Requests",
      current: data.currentDenied,
      predicted: data.predictedDenied,
      change: calculateChange(
        data.currentDenied,
        data.predictedDenied
      ),
      positive:
        data.predictedDenied <= data.currentDenied,
    },

    {
      metric: "Active Users",
      current: data.currentUsers,
      predicted: data.predictedUsers,
      change: calculateChange(
        data.currentUsers,
        data.predictedUsers
      ),
      positive:
        data.predictedUsers >= data.currentUsers,
    },

  ];

  return (

    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Prediction Summary
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Current vs Predicted values
          </p>

        </div>

        <div className="text-right">

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Model R²
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {metrics.r2 ?? "-"}
          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200 dark:border-slate-700">

              <th className="text-left py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Metric
              </th>

              <th className="text-center py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Current
              </th>

              <th className="text-center py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Predicted
              </th>

              <th className="text-center py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Change
              </th>

            </tr>

          </thead>

          <tbody>

            {rows.map((row) => (

              <tr
                key={row.metric}
                className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >

                <td className="py-4 font-medium text-slate-900 dark:text-white">
                  {row.metric}
                </td>

                <td className="text-center text-slate-700 dark:text-slate-300">
                  {row.current}
                </td>

                <td className="text-center font-semibold text-slate-900 dark:text-white">
                  {row.predicted}
                </td>

                <td className="text-center">

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      row.positive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {row.positive ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}

                    {row.change}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default PredictionSummary;