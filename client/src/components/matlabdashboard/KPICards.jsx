import {
  Users,
  Activity,
  ShieldAlert,
  Layers,
  TrendingUp,
  Cpu,
} from "lucide-react";

export default function KPICards({ data = {} }) {
  const cards = [
    {
      title: "Total Requests",
      value:
        Number(data.checkout || 0) +
        Number(data.checkin || 0) +
        Number(data.denied || 0),
      icon: Activity,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600",
    },
    {
      title: "Checkout",
      value: Number(data.checkout || 0),
      icon: TrendingUp,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600",
    },
    {
      title: "Checkin",
      value: Number(data.checkin || 0),
      icon: Cpu,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600",
    },
    {
      title: "Denied",
      value: Number(data.denied || 0),
      icon: ShieldAlert,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600",
    },
    {
      title: "Unique Users",
      value: Number(data.users || 0),
      icon: Users,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600",
    },
    {
      title: "Peak Concurrent",
      value: Number(data.peak || 0),
      icon: Layers,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                bg-white
                dark:bg-slate-900
                border border-slate-200
                dark:border-slate-700
                rounded-2xl
                shadow-sm
                hover:shadow-md
                transition-all
                duration-200
                p-5
              "
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </h2>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}
                >
                  <Icon
                    size={22}
                    className={card.iconColor}
                  />
                </div>

              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Based on selected period
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}