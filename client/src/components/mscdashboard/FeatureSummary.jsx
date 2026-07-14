import React from "react";
import { featureSummary } from "../../data/dashboardData";

const FeatureSummary = ({ selectedPeriod }) => {
  const data = featureSummary[selectedPeriod];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">

      <div className="flex justify-between items-center mb-5">

        <div>

          <h2 className="text-base font-semibold">
            Feature Summary ({selectedPeriod})
          </h2>

          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Software license activity overview
          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-xs">

          <thead>

            <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">

              <th className="text-left py-3 font-semibold">
                Feature
              </th>

              <th className="text-center font-semibold">
                OUT
              </th>

              <th className="text-center font-semibold">
                IN
              </th>

              <th className="text-center font-semibold">
                Denied
              </th>

              <th className="text-center font-semibold">
                Queued
              </th>

              <th className="text-center font-semibold">
                Dequeued
              </th>

              <th className="text-center font-semibold">
                Peak
              </th>

              <th className="text-center font-semibold">
                Users
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((row) => (

              <tr
                key={row.feature}
                className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >

                <td className="py-3 font-medium text-slate-700 dark:text-slate-100">
                  {row.feature}
                </td>

                <td className="text-center text-slate-700 dark:text-slate-200">
                  {row.out.toLocaleString()}
                </td>

                <td className="text-center text-slate-700 dark:text-slate-200">
                  {row.in.toLocaleString()}
                </td>

                <td className="text-center text-rose-600 font-semibold dark:text-rose-400">
                  {row.denied}
                </td>

                <td className="text-center text-slate-700 dark:text-slate-200">
                  {row.queued}
                </td>

                <td className="text-center text-slate-700 dark:text-slate-200">
                  {row.dequeued}
                </td>

                <td className="text-center font-semibold text-slate-700 dark:text-slate-200">
                  {row.peak}
                </td>

                <td className="text-center text-slate-700 dark:text-slate-200">
                  {row.users}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
        * Utilization requires purchased license count and is omitted.
      </p>

    </div>
  );
};

export default FeatureSummary;