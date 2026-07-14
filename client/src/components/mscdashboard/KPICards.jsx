import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { kpiData } from "../../data/dashboardData";


const KPICards = ({ selectedPeriod }) => {

  const cards = kpiData[selectedPeriod];
  return (
    <div className="px-8 mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}
                >
                  <Icon
                    size={18}
                    className={card.iconColor}
                  />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-4">
                    {card.title}
                  </p>

                  <h2 className="text-[22px] font-bold text-slate-900 dark:text-white mt-1">
                    {card.value}
                  </h2>

                </div>

              </div>

              <div className="flex items-center mt-4 text-xs">

                {card.positive ? (
                  <TrendingUp
                    size={13}
                    className="text-green-600"
                  />
                ) : (
                  <TrendingDown
                    size={13}
                    className="text-slate-400"
                  />
                )}

                <span
                  className={`ml-1 font-semibold ${
                    card.positive
                      ? "text-green-600"
                      : "text-slate-500"
                  }`}
                >
                  {card.change}
                </span>

                <span className="ml-1 text-slate-400">
                  vs last month
                </span>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KPICards;