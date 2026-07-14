import React, { useEffect, useState } from "react";
import axios from "axios";

const FeatureSummary = ({ selectedPeriod }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSummary();
  }, [selectedPeriod]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/msc/feature-summary?period=${selectedPeriod}`
      );

      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Feature Summary ({selectedPeriod})
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Software license activity overview
        </p>
      </div>

      <div className="h-[320px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">

        <table className="w-full text-xs">

          <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 shadow-sm">

            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">

              <th className="text-left py-3 pl-3 font-semibold">
                Feature
              </th>

              <th className="text-right py-3 pr-2 font-semibold">
                OUT
              </th>

              <th className="text-right py-3 pr-2 font-semibold">
                IN
              </th>

              <th className="text-right py-3 pr-2 font-semibold">
                Denied
              </th>

              <th className="text-right py-3 pr-2 font-semibold">
                Queued
              </th>

              <th className="text-right py-3 pr-2 font-semibold">
                Dequeued
              </th>

              <th className="text-right py-3 pr-2 font-semibold">
                Peak
              </th>

              <th className="text-right py-3 pr-3 font-semibold">
                Users
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((row) => (

              <tr
                key={row.feature}
                className="border-b border-slate-200 dark:border-slate-700 last:border-0 even:bg-slate-50 dark:even:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >

                <td
                  className="py-3 pl-3 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap"
                  title={row.feature}
                >
                  {row.feature}
                </td>

                <td className="text-right pr-2 text-slate-700 dark:text-slate-200">
                  {Number(row.outCount).toLocaleString()}
                </td>

                <td className="text-right pr-2 text-slate-700 dark:text-slate-200">
                  {Number(row.inCount).toLocaleString()}
                </td>

                <td className="text-right pr-2 text-red-600 font-semibold">
                  {Number(row.denied).toLocaleString()}
                </td>

                <td className="text-right pr-2 text-slate-700 dark:text-slate-200">
                  {Number(row.queued).toLocaleString()}
                </td>

                <td className="text-right pr-2 text-slate-700 dark:text-slate-200">
                  {Number(row.dequeued).toLocaleString()}
                </td>

                <td className="text-right pr-2 font-semibold text-slate-900 dark:text-white">
                  {Number(row.peak).toLocaleString()}
                </td>

                <td className="text-right pr-3 text-slate-700 dark:text-slate-200">
                  {Number(row.users).toLocaleString()}
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