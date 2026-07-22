import React from "react";
import { Brain, Boxes, ShieldCheck } from "lucide-react";

const PredictionHeader = ({
  selectedPeriod,
  setSelectedPeriod,
  metrics = {},
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            MATLAB License Prediction
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            XGBoost based prediction of future MATLAB license demand.
          </p>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <select
            value={selectedPeriod}
            onChange={(e) =>
              setSelectedPeriod(e.target.value)
            }
            className="border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Modules
              </p>

              <h2 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
                {metrics.totalModules ?? 0}
              </h2>

            </div>

            <Boxes
              size={42}
              className="text-blue-600"
            />

          </div>

        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Avg. Confidence
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-600">
                {metrics.averageConfidence ?? 0}%
              </h2>

            </div>

            <Brain
              size={42}
              className="text-green-600"
            />

          </div>

        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Avg. Utilization
              </p>

              <h2 className="text-3xl font-bold mt-2 text-orange-600">
                {metrics.averageUtilization ?? 0}%
              </h2>

            </div>

            <ShieldCheck
              size={42}
              className="text-orange-600"
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default PredictionHeader;