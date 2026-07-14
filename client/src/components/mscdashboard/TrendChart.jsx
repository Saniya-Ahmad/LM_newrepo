import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { trendData } from "../../data/dashboardData";

const TrendChart = ({ selectedPeriod }) => {
  const data = trendData[selectedPeriod];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 dark:bg-slate-900 dark:border dark:border-slate-800">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Peak Concurrent Trend ({selectedPeriod})
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Peak concurrent license usage
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Metric:
          </span>

          <select
            className="border border-slate-300 rounded-lg px-2 py-1 text-xs"
            value="Peak Concurrent"
            readOnly
          >
            <option>Peak Concurrent</option>
          </select>

        </div>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="peakGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#2563EB"
                stopOpacity={0.25}
              />

              <stop
                offset="95%"
                stopColor="#2563EB"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 11 }}
            tickMargin={6}
          />

          <YAxis
            tick={{ fontSize: 11 }}
            tickMargin={2}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563EB"
            strokeWidth={3}
            fill="url(#peakGradient)"
            dot={{
              r: 3,
              fill: "#2563EB",
            }}
            activeDot={{
              r: 5,
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
};

export default TrendChart;