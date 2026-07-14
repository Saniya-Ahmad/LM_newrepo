import React from "react";
import { Search, Bell, Menu } from "lucide-react";

const PredictionHeader = ({
  selectedPeriod,
  setSelectedPeriod,
}) => {
  const periods = ["Daily", "Weekly", "Monthly"];

  return (
    <>
      {/* Top Navbar */}

      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 h-20 shadow-sm px-8 flex items-center justify-between">

        <div className="flex items-center gap-5">

          <button className="lg:hidden text-slate-700 dark:text-slate-200">
            <Menu />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              XGBoost Prediction Dashboard
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Predict future software license demand using machine learning
            </p>

          </div>

        </div>

      </header>

      {/* Period Toggle */}

      <div className="px-8 pt-6">

        <div className="inline-flex bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-1">

          {periods.map((period) => (

            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {period}
            </button>

          ))}

        </div>

      </div>
    </>
  );
};

export default PredictionHeader;