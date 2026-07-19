import React from "react";

const RecommendationCard = ({
  selectedModule,
  predictions = [],
}) => {

  const data =
    predictions.find(
      (item) =>
        item.feature === selectedModule ||
        item.displayName === selectedModule ||
        item.module === selectedModule
    ) || {};

  const getBadgeStyle = () => {

    switch (data.priority) {

      case "High":
        return "bg-red-100 text-red-700 border-red-200";

      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "Low":
        return "bg-green-100 text-green-700 border-green-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";

    }

  };

  const getReasons = () => {

    if (!data.module) return [];

    return [
      `Current licenses available: ${data.currentLicenses}.`,
      `Current peak usage: ${data.currentPeak}.`,
      `Predicted peak usage: ${data.predictedPeak}.`,
      `Denied requests: ${data.currentDenied}.`,
      ,
    ];

  };

  const getActions = () => {

    if (!data.module) return [];

    if (data.licensesToAdd > 0) {

      return [
        `Add ${data.licensesToAdd} additional license(s).`,
        "Monitor peak utilization after deployment.",
        "Review future demand trends.",
      ];

    }

    if (data.licensesToRemove > 0) {

      return [
        `Remove ${data.licensesToRemove} unused license(s).`,
        "Review under-utilized licenses.",
        "Consider license reallocation.",
      ];

    }

    if (data.currentDenied > 0) {

      return [
        "Monitor denied requests closely.",
        "Investigate temporary license contention.",
        "Retrain the prediction model periodically.",
      ];

    }

    return [
      "Current allocation appears sufficient.",
      "Continue monitoring utilization.",
      "Retrain the model after new data is available.",
    ];

  };

  return (

    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl shadow-md border dark:border-slate-700 p-6 ${getBadgeStyle().split(" ")[2]}`}
    >

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
        AI Recommendation
      </h2>

      <div className="flex items-center justify-between">

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeStyle()}`}
        >
          {data.priority || "N/A"} Priority
        </span>

        <span className="text-sm text-slate-500 dark:text-slate-400">

          Change

          <span className="ml-2 font-bold text-slate-900 dark:text-white">

            {data.change ?? "-"}%

          </span>

        </span>

      </div>

      <div className="mt-6">

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">

          {data.recommendation || "No Recommendation"}

        </h3>

        {data.module && (

          <div className="grid grid-cols-2 gap-4">

            
            

          </div>

        )}

      </div>

      <div className="mt-6">

        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">

          Why?

        </h4>

        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc ml-5">

          {getReasons().map((reason) => (

            <li key={reason}>
              {reason}
            </li>

          ))}

        </ul>

      </div>

      <div className="mt-6">

        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">

          Suggested Actions

        </h4>

        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc ml-5">

          {getActions().map((action) => (

            <li key={action}>
              {action}
            </li>

          ))}

        </ul>

      </div>

    </div>

  );

};

export default RecommendationCard;