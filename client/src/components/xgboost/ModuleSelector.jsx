import React from "react";

const ModuleSelector = ({
  predictions = [],
  selectedModule,
  setSelectedModule,
}) => {

  const modules = predictions.map((item) => item.module);

  const stats =
    predictions.find(
      (item) => item.module === selectedModule
    ) || {};

  const getStatus = () => {
    if (!stats.recommendation) return "No Data";

    if (stats.recommendation === "Increase Licenses")
      return "High Demand";

    if (stats.recommendation === "Reduce Licenses")
      return "Low Demand";

    return "Stable";
  };

  const getStatusStyle = () => {
    if (stats.recommendation === "Increase Licenses")
      return "bg-red-100 text-red-700";

    if (stats.recommendation === "Reduce Licenses")
      return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-lg font-semibold mb-5">
        Select Module
      </h2>

      <select
        value={selectedModule}
        onChange={(e) =>
          setSelectedModule(e.target.value)
        }
        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="mt-8 space-y-5">

        <div>

          <p className="text-sm text-slate-500">
            Current Peak
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            {stats.currentPeak ?? "-"}
          </h2>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Predicted Peak
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-1">
            {stats.predictedPeak ?? "-"}
          </h2>

        </div>

        <div>

          <p className="text-sm text-slate-500 mb-2">
            Status
          </p>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle()}`}
          >
            {getStatus()}
          </span>

        </div>

      </div>

    </div>
  );
};

export default ModuleSelector;