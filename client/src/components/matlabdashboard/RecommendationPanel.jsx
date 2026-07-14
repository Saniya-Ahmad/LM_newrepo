import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

export default function RecommendationPanel({ data = [] }) {
  const [selectedFeature, setSelectedFeature] = useState("");

  useEffect(() => {
    if (data.length > 0 && !selectedFeature) {
      setSelectedFeature(data[0].feature);
    }
  }, [data]);

  const recommendation = data.find(
    (item) => item.feature === selectedFeature
  );

  const getIcon = (severity) => {
    switch (severity) {
      case "high":
        return AlertTriangle;
      case "medium":
        return TrendingUp;
      default:
        return CheckCircle;
    }
  };

  const getBorder = (severity) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20";
      default:
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20";
    }
  };

  const getText = (severity) => {
    switch (severity) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  const Icon = recommendation
    ? getIcon(recommendation.severity)
    : CheckCircle;

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">

      <div className="flex items-center gap-2 mb-6">
        <CheckCircle className="text-green-600" size={20} />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recommendation
        </h2>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No recommendations available.
        </div>
      ) : (
        <>
          {/* Feature Dropdown */}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              MATLAB Feature
            </label>

            <div className="relative">
              <select
                value={selectedFeature}
                onChange={(e) =>
                  setSelectedFeature(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 appearance-none"
              >
                {data.map((item) => (
                  <option
                    key={item.feature}
                    value={item.feature}
                  >
                    {item.feature}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="absolute right-3 top-3 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {recommendation && (
            <div
              className={`rounded-xl border p-5 ${getBorder(
                recommendation.severity
              )}`}
            >
              <div className="flex gap-3">

                <Icon
                  size={22}
                  className={getText(recommendation.severity)}
                />

                <div className="flex-1">

                  <h3
                    className={`font-semibold text-lg ${getText(
                      recommendation.severity
                    )}`}
                  >
                    {recommendation.feature}
                  </h3>

                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                    {recommendation.recommendation}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-5">

                    <div>
                      <div className="text-xs text-slate-500">
                        Current Peak
                      </div>
                      <div className="font-semibold text-lg">
                        {recommendation.current_peak}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        Predicted Peak
                      </div>
                      <div className="font-semibold text-lg">
                        {recommendation.predicted_peak}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        Capacity
                      </div>
                      <div className="font-semibold text-lg">
                        {recommendation.capacity}
                      </div>
                    </div>

                  </div>

                  <div className="mt-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getText(
                        recommendation.severity
                      )}`}
                    >
                      {recommendation.severity.toUpperCase()} PRIORITY
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500">
          Recommendations are generated automatically using the trained XGBoost model.
        </p>
      </div>
    </div>
  );
}