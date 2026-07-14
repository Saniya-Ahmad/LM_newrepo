import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  ChartNoAxesCombined,
  ShieldAlert,
  Users,
  LayoutGrid,
  PieChart,
} from "lucide-react";

const KPICards = ({ selectedPeriod }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchKPIs();
  }, [selectedPeriod]);

  const fetchKPIs = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5001/api/dashboard/kpis?period=${selectedPeriod}`
      );

      
      setCards([
        {
          title: "Total Requests",
          value: data.totalRequests.value,
          change: data.totalRequests.change,
          positive: data.totalRequests.positive,
          icon: ArrowLeftRight,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        },
        {
          title: "Peak Concurrent",
          value: data.peakConcurrent.value,
          change: data.peakConcurrent.change,
          positive: data.peakConcurrent.positive,
          icon: ChartNoAxesCombined,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        },
        {
          title: "Denied Requests",
          value: data.deniedRequests.value,
          change: data.deniedRequests.change,
          positive: data.deniedRequests.positive,
          icon: ShieldAlert,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
        },
        {
          title: "Unique Users",
          value: data.uniqueUsers.value,
          change: data.uniqueUsers.change,
          positive: data.uniqueUsers.positive,
          icon: Users,
          iconBg: "bg-violet-100",
          iconColor: "text-violet-600",
        },
        {
          title: "Unique Features",
          value: data.uniqueFeatures.value,
          change: data.uniqueFeatures.change,
          positive: data.uniqueFeatures.positive,
          icon: LayoutGrid,
          iconBg: "bg-orange-100",
          iconColor: "text-orange-500",
        },
        {
          title: "OUT Requests",
          value: data.outRequests.value,
          change: data.outRequests.change,
          positive: data.outRequests.positive,
          icon: PieChart,
          iconBg: "bg-cyan-100",
          iconColor: "text-cyan-600",
        },
      ]);
    } catch (err) {
      console.error("Error fetching KPI data:", err);
    }
  };

  return (
    <div className="px-8 mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 shadow-sm hover:shadow-md transition"
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
                  <p className="text-[11px] font-semibold text-slate-500 leading-4">
                    {card.title}
                  </p>

                  <h2 className="text-[22px] font-bold text-slate-900 mt-1">
                    {Number(card.value).toLocaleString()}
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
  {selectedPeriod === "Daily"
    ? "vs previous day"
    : selectedPeriod === "Weekly"
    ? "vs last week"
    : "vs last month"}
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