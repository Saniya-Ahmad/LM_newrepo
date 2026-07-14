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

const lineColors = [
  "#2563EB", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Dark Orange
  "#EC4899", // Pink
  "#84CC16", // Lime
  "#14B8A6", // Teal
];

const PredictionTrend = ({
  selectedPeriod,
  selectedModules,
  trendData = [],
  loading,
}) => {
  const data = trendData;

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md p-6 h-[520px] flex items-center justify-center text-slate-700 dark:text-slate-300">
        Loading predictions...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md p-6 h-[520px] flex items-center justify-center text-slate-700 dark:text-slate-300">
        No trend data available.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Prediction Trend ({selectedPeriod})
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Forecasted peak concurrent license demand
          </p>
        </div>
      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />

          <XAxis
            dataKey="label"
            tick={{
              fontSize: 12,
              fill: "#64748B",
            }}
            axisLine={{
              stroke: "#CBD5E1",
            }}
            tickLine={{
              stroke: "#CBD5E1",
            }}
          />

          <YAxis
            tick={{
              fontSize: 12,
              fill: "#64748B",
            }}
            axisLine={{
              stroke: "#CBD5E1",
            }}
            tickLine={{
              stroke: "#CBD5E1",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #CBD5E1",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              fontSize: "15px",
              fontWeight: 600,
              color: "#0F172A",
              padding: "10px 14px",
            }}
            labelStyle={{
              color: "#475569",
              fontWeight: 500,
            }}
            itemStyle={{
              color: "#0F172A",
              fontWeight: 600,
            }}
          />

          <Legend />

          {selectedModules.map((module, index) => (
            <Line
              key={module}
              type="monotone"
              dataKey={module}
              stroke={lineColors[index % lineColors.length]}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionTrend;
