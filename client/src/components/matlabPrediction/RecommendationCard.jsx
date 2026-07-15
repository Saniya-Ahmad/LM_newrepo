import React from "react";

const RecommendationCard = ({
  selectedModule,
  predictions = [],
}) => {
  const data =
    predictions.find(
      (item) => item.module === selectedModule
    ) || {};

  if (!data.module) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          AI Recommendation
        </h2>

        <p className="mt-5 text-slate-500 dark:text-slate-400">
          No recommendation available.
        </p>
      </div>
    );
  }

  const badgeColor = () => {
    switch (data.severity) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  const badgeText = () => {
    switch (data.severity) {
      case "high":
        return "High Priority";

      case "medium":
        return "Medium Priority";

      default:
        return "Low Priority";
    }
  };

  const reasons = [
    `Current peak usage is ${data.currentPeak}.`,
    `Predicted peak usage is ${data.predictedPeak}.`,
    `License capacity is ${data.capacity}.`,
    `Expected change is ${data.change}%.`,
  ];

  let actions = [];

  if (data.severity === "high") {
    actions = [
      "Increase available licenses.",
      "Monitor upcoming demand.",
      "Review concurrent usage during peak hours.",
    ];
  } else if (data.severity === "medium") {
    actions = [
      "Monitor license utilization.",
      "Review demand next week.",
      "Keep spare licenses ready.",
    ];
  } else {
    actions = [
      "Current allocation is sufficient.",
      "Continue periodic monitoring.",
      "Retrain model when new logs arrive.",
    ];
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        AI Recommendation
      </h2>

      <div className="flex justify-between items-center mt-5">

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor()}`}
        >
          {badgeText()}
        </span>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          Confidence
          <span className="ml-2 font-bold text-slate-900 dark:text-white">
            {data.confidence}%
          </span>
        </span>

      </div>

      <div className="mt-6">

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {data.recommendation}
        </h3>

      </div>

      <div className="mt-6">

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
          Why?
        </h4>

        <ul className="space-y-2 list-disc ml-5 text-sm text-slate-600 dark:text-slate-400">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

      </div>

      <div className="mt-6">

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
          Suggested Actions
        </h4>

        <ul className="space-y-2 list-disc ml-5 text-sm text-slate-600 dark:text-slate-400">
          {actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>

      </div>

    </div>
  );
};

export default RecommendationCard;