import React from "react";

export default function MscPredictions() {
  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="rounded-3xl border p-6 shadow-xl bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">MSC Predictions</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Forecast MSC license usage and prepare for upcoming peak demand.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Forecast Requests", value: "8,841", change: "+16%" },
          { title: "Expected Peak", value: "115", change: "+9%" },
          { title: "Model Accuracy", value: "94%", change: "+4%" },
        ].map((card) => (
          <div key={card.title} className="rounded-3xl border p-5 shadow-sm bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{card.title}</p>
            <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">{card.change} vs last period</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border p-6 shadow-sm bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-300">Prediction output and trends for MSC licenses will be displayed here.</p>
      </div>
    </div>
  );
}
