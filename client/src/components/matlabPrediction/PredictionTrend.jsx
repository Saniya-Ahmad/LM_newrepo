import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#F97316",
  "#14B8A6",
];

const PredictionTrend = ({
  trendData = [],
  selectedModules = [],
  selectedPeriod,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 h-[520px] flex items-center justify-center">
        <span className="text-slate-500 text-lg">
          Loading Prediction Trend...
        </span>
      </div>
    );
  }

  if (!trendData.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 h-[520px] flex items-center justify-center">
        <span className="text-slate-500 text-lg">
          No prediction data available.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Prediction Trend ({selectedPeriod})
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Forecasted Peak Concurrent License Usage
          </p>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={420}
      >
        <LineChart data={trendData}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#CBD5E1"
          />

          <XAxis
            dataKey="label"
            tick={{
              fontSize: 12,
              fill: "#64748B",
            }}
          />

          <YAxis
            tick={{
              fontSize: 12,
              fill: "#64748B",
            }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #CBD5E1",
              background: "#fff",
            }}
          />

          <Legend />

          {selectedModules.map((module, index) => (
            <Line
              key={module}
              type="monotone"
              dataKey={module}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={{
                r: 3,
              }}
              activeDot={{
                r: 6,
              }}
            />
          ))}

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default PredictionTrend;