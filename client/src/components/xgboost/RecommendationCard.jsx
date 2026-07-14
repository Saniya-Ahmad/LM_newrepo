import React from "react";

const RecommendationCard = ({
  selectedModule,
  predictions = [],
}) => {

  const data =
    predictions.find(
      (item) => item.module === selectedModule
    ) || {};

  const getBadgeStyle = () => {

    switch (data.priority) {

      case "High":
        return "bg-red-100 text-red-700 border-red-200";

      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      default:
        return "bg-green-100 text-green-700 border-green-200";

    }

  };

  const getReasons = () => {

    if (!data.module) return [];

    return [
      `Current peak usage is ${data.currentPeak}.`,
      `Predicted peak usage is ${data.predictedPeak}.`,
      `Expected change is ${data.change}%.`,
    ];

  };

  const getActions = () => {

    switch (data.recommendation) {

      case "Increase Licenses":
        return [
          "Procure additional licenses.",
          "Monitor peak utilization closely.",
          "Review upcoming workload demand.",
        ];

      case "Reduce Licenses":
        return [
          "Review under-utilized licenses.",
          "Consider license reallocation.",
          "Avoid unnecessary renewals.",
        ];

      default:
        return [
          "Current allocation appears sufficient.",
          "Continue monitoring utilization.",
          "Retrain the model after new data is available.",
        ];

    }

  };

  return (

    <div
      className={`bg-white rounded-2xl shadow-sm p-6 border ${getBadgeStyle().split(" ")[2]}`}
    >

      <h2 className="text-lg font-semibold mb-5">
        AI Recommendation
      </h2>

      <div className="flex items-center justify-between">

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeStyle()}`}
        >
          {data.priority || "N/A"} Priority
        </span>

        <span className="text-sm text-slate-500">

          Change

          <span className="ml-2 font-bold text-slate-900">

            {data.change ?? "-"}%

          </span>

        </span>

      </div>

      <div className="mt-6">

        <h3 className="text-xl font-bold text-slate-900">

          {data.recommendation || "No Recommendation"}

        </h3>

      </div>

      <div className="mt-3">

        <h4 className="font-semibold text-slate-700 mb-3">

          Why?

        </h4>

        <ul className="space-y-2 text-sm text-slate-600 list-disc ml-5">

          {getReasons().map((reason) => (

            <li key={reason}>
              {reason}
            </li>

          ))}

        </ul>

      </div>

      <div className="mt-6">

        <h4 className="font-semibold text-slate-700 mb-3">

          Suggested Actions

        </h4>

        <ul className="space-y-2 text-sm text-slate-600 list-disc ml-5">

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