import {
  KeyRound,
  Layers3,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react";

import { statsData } from "../../data/excelDummyData";

const cards = [
  {
    title: "Total Microsoft Licenses",
    value: statsData.totalLicenses,
    icon: KeyRound,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/40",
  },
  {
    title: "License Types",
    value: statsData.licenseTypes,
    icon: Layers3,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  {
    title: "Total Labs",
    value: statsData.totalLabs,
    icon: Building2,
    color: "text-orange-600",
    bg: "bg-orange-100 dark:bg-orange-900/40",
  },
  {
    title: "Total Consumers",
    value: statsData.totalConsumers,
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/40",
  },
];

const StatCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Top */}

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </h2>
              </div>

              <div
                className={`h-14 w-14 rounded-2xl ${card.bg} flex items-center justify-center`}
              >
                <Icon
                  size={28}
                  className={card.color}
                />
              </div>
            </div>

            {/* Bottom */}

            <div className="mt-6 flex items-center justify-between">

              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                <TrendingUp size={14} />
                Active
              </div>

              <span className="text-xs text-slate-400">
                Updated now
              </span>

            </div>

            {/* Hover Border */}

            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;