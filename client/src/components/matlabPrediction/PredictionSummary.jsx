import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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

        <p className="mt-5 text-slate-500 dark:text-slate-400">
          No prediction data available.
        </p>
      </div>
    );
  }

  const rows = [
    {
      metric: "Current Peak",
      value: data.currentPeak,
    },
    {
      metric: "Predicted Peak",
      value: data.predictedPeak,
    },
    {
      metric: "Capacity",
      value: data.capacity,
    },
    {
      metric: "Difference",
value:
  Number(data.difference) > 0
    ? `+${Number(data.difference).toFixed(2)}`
    : Number(data.difference).toFixed(2),
    },
    {
      metric: "Expected Change",
      value: `${data.change}%`,
    },
    {
      metric: "Confidence",
      value: `${data.confidence}%`,
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
            Model Prediction Details
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Avg Confidence
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {metrics.averageConfidence ?? "-"}%
          </p>
        </div>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b border-slate-200 dark:border-slate-700">

            <th className="text-left py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Metric
            </th>

            <th className="text-center py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Value
            </th>

            <th className="text-center py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Trend
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row) => (

            <tr
              key={row.metric}
              className="border-b border-slate-200 dark:border-slate-700 last:border-0"
            >

              <td className="py-4 font-medium text-slate-900 dark:text-white">
                {row.metric}
              </td>

              <td className="text-center text-slate-700 dark:text-slate-300">
                {row.value}
              </td>

              <td className="text-center">

                {row.metric === "Difference" ? (

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      data.difference >= 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {data.difference >= 0 ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}

                    {data.change}%

                  </span>

                ) : (
                  "-"
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default PredictionSummary;