import React from "react";

const ModuleOverview = ({
  predictions = [],
  selectedModule,
  setSelectedModule,
}) => {

  const data =
    predictions.find(
      (item) => item.feature === selectedModule
    ) || {};

  const getStatus = () => {
    if (!data.recommendation) return "No Data";

    if (data.recommendation === "Increase Licenses")
      return "High Demand";

    if (data.recommendation === "Reduce Licenses")
      return "Low Demand";

    return "Stable";
  };

  const getStatusColor = () => {
    if (data.recommendation === "Increase Licenses")
      return "bg-red-100 text-red-700";

    if (data.recommendation === "Reduce Licenses")
      return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  const getPriorityColor = () => {
    if (data.priority === "High")
      return "bg-red-100 text-red-700";

    if (data.priority === "Low")
      return "bg-yellow-100 text-yellow-700";

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6 h-full">

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
        Module Overview
      </h2>

      <select
        value={selectedModule}
        onChange={(e) => setSelectedModule(e.target.value)}
        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {predictions.map((item) => (
          <option
            key={item.feature}
            value={item.feature}
          >
            {item.displayName}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current Peak
          </p>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {data.currentPeak ?? "-"}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Predicted Peak
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {data.predictedPeak ?? "-"}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Difference
          </p>

          <h2
            className={`text-xl font-bold mt-1 ${
              data.difference >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {data.difference > 0
              ? `+${data.difference}`
              : data.difference ?? "-"}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Expected Change
          </p>

          <h2
  className={`text-xl font-bold mt-1 ${
    data.change == null
      ? "text-slate-500"
      : data.change >= 0
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {data.change == null
    ? "N/A"
    : `${data.change > 0 ? "+" : ""}${data.change}%`}
</h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Status
          </p>

          <span
            className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}
          >
            {getStatus()}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Priority
          </p>

          <span
            className={`px-3 py-2 rounded-full text-sm font-semibold ${getPriorityColor()}`}
          >
            {data.priority ?? "-"}
          </span>
        </div>

      </div>

    </div>
  );
};

export default ModuleOverview;