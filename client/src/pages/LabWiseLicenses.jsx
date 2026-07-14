import { useState } from "react";
import {
  Package,
  Monitor,
  Activity,
  Building2,
} from "lucide-react";

import { labDistribution } from "../data/excelDummyData";
import ProgramConsumption from "../components/dashboard/ProgramConsumption";

const LabWiseLicenses = () => {
  const [selectedLab, setSelectedLab] = useState(labDistribution[0]);

  const selectedConsumed = selectedLab.programs.reduce(
    (sum, prog) => sum + prog.consumed,
    0
  );

  const selectedAvailable = selectedLab.value - selectedConsumed;

  const selectedUtilization = selectedLab.value
    ? Math.round((selectedConsumed / selectedLab.value) * 100)
    : 0;

  const cards = [
    {
      title: "Total Programs",
      value: selectedLab.programs.length,
      subtitle: "Installed Programs",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total License Count",
      value: selectedLab.value,
      subtitle: "Allocated Licenses",
      icon: Building2,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Available",
      value: selectedAvailable,
      subtitle: "Ready to Use",
      icon: Monitor,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Utilization",
      value: `${selectedUtilization}%`,
      subtitle: "Current Usage",
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Lab-wise Licenses
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Monitor software license distribution and utilization across laboratories.
        </p>
      </div>

      {/* Top */}

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] items-end">

        {/* Select Lab */}

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">

          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
            Select Lab
          </label>

          <select
            value={selectedLab.lab}
            onChange={(e) => {
              const lab = labDistribution.find(
                (l) => l.lab === e.target.value
              );

              if (lab) setSelectedLab(lab);
            }}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3"
          >
            {labDistribution.map((lab) => (
              <option key={lab.lab}>
                {lab.lab}
              </option>
            ))}
          </select>

        </div>

        {/* Selected Lab */}

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 min-w-[280px]">

          <p className="text-sm text-slate-500">
            Selected Lab
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {selectedLab.lab}
          </h2>

          <p className="text-sm mt-3 text-slate-500">
            Showing analytics and license consumption
            for the selected laboratory.
          </p>

        </div>

      </div>

      {/* Program Consumption + KPI */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {selectedLab.lab} - Program Consumption
          </h2>

          <ProgramConsumption
            selectedLab={selectedLab}
          />

        </div>

        {/* Right KPI */}

        <div className="space-y-5">

          {cards.map((card) => {

            const Icon = card.icon;

            return (

              <div
                key={card.title}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 hover:shadow-md transition"
              >

                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="text-3xl font-bold mt-3 text-slate-900 dark:text-white">
                      {card.value}
                    </h2>

                    <p className="text-xs mt-3 text-slate-500">
                      {card.subtitle}
                    </p>

                  </div>

                  <div
                    className={`h-14 w-14 rounded-xl flex items-center justify-center ${card.bg}`}
                  >

                    <Icon
                      size={28}
                      className={card.color}
                    />

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

      {/* Summary Table */}      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">

        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">

          <div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Lab Summary
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              License allocation and utilization across all laboratories.
            </p>

          </div>

          <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
            {labDistribution.length} Labs
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">

                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  Lab Name
                </th>

                <th className="px-6 py-4 text-center text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  Total Licenses
                </th>

                <th className="px-6 py-4 text-center text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  In Use
                </th>

                <th className="px-6 py-4 text-center text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  Available
                </th>

                <th className="px-6 py-4 text-center text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  Utilization
                </th>

              </tr>

            </thead>

            <tbody>

              {labDistribution.map((lab, index) => {

                const used = lab.programs.reduce(
                  (sum, p) => sum + p.consumed,
                  0
                );

                const available = lab.value - used;

                const utilization = Math.round(
                  (used / lab.value) * 100
                );

                return (

                  <tr
                    key={lab.lab}
                    className={`border-b border-slate-200 dark:border-slate-700 transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50/60 dark:bg-slate-800/40"
                    }`}
                  >

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-semibold text-slate-900 dark:text-white">
                          {lab.lab}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {lab.programs.length} Programs Installed
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-5 text-center">

                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Active
                      </span>

                    </td>

                    <td className="px-6 py-5 text-center font-semibold text-slate-900 dark:text-white">
                      {lab.value}
                    </td>

                    <td className="px-6 py-5 text-center text-blue-600 font-semibold">
                      {used}
                    </td>

                    <td className="px-6 py-5 text-center text-emerald-600 font-semibold">
                      {available}
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">

                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              utilization >= 85
                                ? "bg-red-500"
                                : utilization >= 70
                                ? "bg-amber-500"
                                : "bg-blue-600"
                            }`}
                            style={{
                              width: `${utilization}%`,
                            }}
                          />

                        </div>

                        <span className="w-12 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {utilization}%
                        </span>

                      </div>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default LabWiseLicenses;