import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#22c55e",
  "#84cc16",
  "#f59e0b",
  "#f97316",
  "#ef4444",
];

export default function ModuleUsageChart({ data, period }) {

  const title =
    period === "daily"
      ? "Top Modules (Selected Date)"
      : period === "weekly"
      ? "Top Modules (Selected Week)"
      : "Top Modules (Selected Month)";

  const subtitle =
    period === "daily"
      ? "Most frequently used MATLAB toolboxes on the selected date."
      : period === "weekly"
      ? "Most frequently used MATLAB toolboxes during the selected week."
      : "Most frequently used MATLAB toolboxes during the selected month.";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 10,
            right: 20,
            left: 40,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal
            vertical={false}
          />

          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            type="category"
            dataKey="feature"
            width={180}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(value) => [`${value} Checkouts`, "Usage"]}
          />

          <Bar
            dataKey="total_usage"
            radius={[0, 8, 8, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.feature}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}