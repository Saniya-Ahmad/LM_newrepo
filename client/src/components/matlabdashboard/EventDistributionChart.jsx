import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = [
  "#22c55e", // Checkout
  "#3b82f6", // Checkin
  "#ef4444", // Denied
];

export default function EventDistributionChart({ data }) {

  const chartData = [
    {
      name: "Checkout",
      value: Number(data?.checkout || 0),
    },
    {
      name: "Checkin",
      value: Number(data?.checkin || 0),
    },
    {
      name: "Denied",
      value: Number(data?.denied || 0),
    },
  ];

  const totalEvents = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Event Distribution
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Checkout vs Checkin vs Denied Requests
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">

        {/* Donut Chart */}
        <div className="relative w-[260px] h-[260px] flex-shrink-0">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  Number(value).toLocaleString(),
                  name,
                ]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                }}
              />

            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Events
            </p>

            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {totalEvents.toLocaleString()}
            </h3>

          </div>

        </div>

        {/* Right Side Legend */}
        <div className="flex-1 w-full max-w-xs">

          <div className="space-y-5">

            {chartData.map((item, index) => (

              <div
                key={item.name}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-3">

                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: COLORS[index],
                    }}
                  />

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {item.name}
                  </span>

                </div>

                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {item.value.toLocaleString()}
                </span>

              </div>

            ))}

          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-8">
            Total checkout, checkin and denied license events for the selected period.
          </p>

        </div>

      </div>

    </div>
  );
}