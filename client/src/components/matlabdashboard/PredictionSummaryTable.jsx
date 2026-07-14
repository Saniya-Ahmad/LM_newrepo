import React from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  BarChart3,
} from "lucide-react";

export default function PredictionSummaryTable({ data }) {
  const features = data?.map((d) => d.feature) || [];

  const [selectedFeature, setSelectedFeature] = React.useState(
    features[0] || ""
  );

  React.useEffect(() => {
    if (features.length && !selectedFeature) {
      setSelectedFeature(features[0]);
    }
  }, [data]);

  const current =
    data.find((x) => x.feature === selectedFeature) || {};

  if (!current)
    return null;

  const increase =
    current.predicted_peak - current.current_peak;

  const percent =
    current.current_peak > 0
      ? (increase / current.current_peak) * 100
      : 0;

  const rows = [
    {
      metric: "Current Peak Usage",
      value: current.current_peak,
    },
    {
      metric: "Predicted Peak Usage",
      value: current.predicted_peak,
    },
    {
      metric: "Expected Increase",
      value: increase.toFixed(2),
    },
    {
      metric: "Increase (%)",
      value: `${percent.toFixed(2)} %`,
    },
    {
      metric: "Prediction Confidence",
      value: `${current.confidence}%`,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

      {/* Header */}

      <div className="flex items-center gap-2 mb-6">

        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">

          <BarChart3
            size={18}
            className="text-blue-600"
          />

        </div>

        <div>

          <h2 className="font-semibold text-slate-900 dark:text-white">

            Prediction Summary

          </h2>

          <p className="text-xs text-slate-500">

            Compare current usage with predicted peak usage.

          </p>

        </div>

      </div>

      {/* Feature Dropdown */}

      <div className="mb-6">

        <label className="text-xs font-semibold text-slate-600 mb-2 block">

          Feature

        </label>

        <div className="relative">

          <select
            value={selectedFeature}
            onChange={(e) =>
              setSelectedFeature(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-2.5 bg-white dark:bg-slate-900 dark:border-slate-700 appearance-none"
          >
            {features.map((feature) => (
              <option
                key={feature}
                value={feature}
              >
                {feature}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="absolute right-3 top-3 text-slate-400 pointer-events-none"
          />

        </div>

      </div>

      {/* Summary Table */}

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

        <table className="w-full">

          <tbody>

            {rows.map((row, index) => (

              <tr
                key={index}
                className="border-b last:border-none dark:border-slate-700"
              >

                <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">

                  {row.metric}

                </td>

                <td className="px-4 py-4 text-right font-semibold text-slate-900 dark:text-white">

                  {row.value}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Growth */}

      <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

        <div className="flex justify-between items-center">

          <span className="font-medium">

            Overall Growth

          </span>

          <div className="flex items-center gap-2">

            {increase >= 0 ? (
              <TrendingUp className="text-green-600" size={18} />
            ) : (
              <TrendingDown className="text-red-600" size={18} />
            )}

            <span
              className={`font-bold ${
                increase >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {percent.toFixed(2)}%
            </span>

          </div>

        </div>

      </div>

      <p className="mt-4 text-xs text-slate-500">

        Predictions generated using the trained XGBoost model.

      </p>

    </div>
  );
}