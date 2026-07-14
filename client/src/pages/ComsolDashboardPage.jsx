import React, { useState } from "react";
import KPICards from "../components/comsoldashboard/KPICards";
import AnalyticsCharts from "../components/comsoldashboard/AnalyticsCharts";

export default function ComsolDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  return (
    <div className="space-y-8 text-slate-900 dark:text-white">
      <div className="rounded-3xl border p-6 shadow-xl bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">COMSOL Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              COMSOL license analytics adapted to the website dashboard
              experience.
            </p>
          </div>
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
            {["Daily", "Weekly", "Monthly"].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <KPICards selectedPeriod={selectedPeriod} />
      <AnalyticsCharts selectedPeriod={selectedPeriod} />
    </div>
  );
}
