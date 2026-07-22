import React from "react";

const ModuleOverview = ({
  predictions = [],
  selectedModule,
  setSelectedModule,
}) => {
  const modules = predictions.map((item) => item.module);

  const data =
    predictions.find(
      (item) => item.module === selectedModule
    ) || {};

  const getStatus = () => {
    if (!data.module) return "No Data";

    if (data.utilization >= 95) return "Critical";

    if (data.utilization >= 80) return "High";

    if (data.utilization >= 60) return "Moderate";

    return "Healthy";
  };

  const getStatusColor = () => {
    if (data.utilization >= 95)
      return "bg-red-100 text-red-700";

    if (data.utilization >= 80)
      return "bg-orange-100 text-orange-700";

    if (data.utilization >= 60)
      return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  const getPriorityColor = () => {
    switch (data.priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6 h-full">

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-5">
        Module Overview
      </h2>

      <select
        value={selectedModule}
        onChange={(e) => setSelectedModule(e.target.value)}
        className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 mb-6"
      >
        {modules.map((module) => (
          <option
            key={module}
            value={module}
          >
            {module}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Current Peak
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {data.currentPeak ?? "-"}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Predicted Peak
          </p>

          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {data.predictedPeak ?? "-"}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Difference
          </p>

          <h2
            className={`text-2xl font-bold mt-2 ${
              data.difference >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {data.difference > 0 ? "+" : ""}
            {data.difference ?? "-"}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Expected Change
          </p>

          <h2
            className={`text-2xl font-bold mt-2 ${
              data.change >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {data.change > 0 ? "+" : ""}
            {data.change ?? "-"}%
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Capacity
          </p>

          <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            {data.capacity ?? "-"}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">
            Utilization
          </p>

          <h2 className="text-2xl font-bold mt-2 text-indigo-600">
            {data.utilization ?? "-"}%
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500 mb-3">
            Status
          </p>

          <span
            className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}
          >
            {getStatus()}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500 mb-3">
            Priority
          </p>

          <span
            className={`px-3 py-2 rounded-full text-sm font-semibold ${getPriorityColor()}`}
          >
            {data.priority ?? "-"}
          </span>
        </div>

      </div>

      <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">

        <p className="text-sm text-slate-500">
          Model Confidence
        </p>

        <div className="flex items-center justify-between mt-2">

          <div className="w-full bg-slate-200 rounded-full h-3 mr-4">

            <div
              className="bg-green-500 h-3 rounded-full"
              style={{
                width: `${data.confidence ?? 0}%`,
              }}
            />

          </div>

          <span className="font-bold text-slate-900 dark:text-white">
            {data.confidence ?? 0}%
          </span>

        </div>

      </div>

    </div>
  );
};

export default ModuleOverview;