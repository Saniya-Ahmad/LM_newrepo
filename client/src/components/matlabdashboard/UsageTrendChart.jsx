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

export default function UsageTrendChart({ data, period }) {

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 dark:bg-slate-900 dark:border dark:border-slate-800">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Peak Concurrent Trend
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Peak concurrent MATLAB license usage ({period})
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Metric:
          </span>

          <select
            value="Peak Concurrent"
            readOnly
            className="
              border border-slate-300
              bg-white text-slate-700
              rounded-lg px-2 py-1 text-xs
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-200
            "
          >
            <option>
              Peak Concurrent
            </option>
          </select>

        </div>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -20,
            bottom: 20,
          }}
        >

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
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickMargin={8}
            interval="preserveStartEnd"
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11 }}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="peak"
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
}