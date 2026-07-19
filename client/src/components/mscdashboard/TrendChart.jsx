import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const TrendChart = ({ selectedPeriod }) => {
  const [data, setData] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("All");

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    fetchTrend();
  }, [selectedPeriod, selectedModule]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/msc/modules"
      );

      setModules([
        { module_name: "All" },
        ...response.data,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrend = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/msc/trend?period=${selectedPeriod}&module=${selectedModule}`
      );

      setData(response.data);
    } catch (err) {
      console.error("Trend Error:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Peak Concurrent Trend ({selectedPeriod})
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Peak concurrent license usage
          </p>

        </div>

        <div className="flex items-center gap-4">

          

          <div className="flex items-center gap-2">

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Module:
            </span>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-2 py-1 text-xs"
            >
              {modules.map((module) => (
                <option
                  key={module.module_name}
                  value={module.module_name}
                >
                  {module.module_name}
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>
      {data.length === 0 ? (
  <div className="h-[320px] flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
    No record for this module.
  </div>
)  : (
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
            stroke="#CBD5E1"
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickMargin={6}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={{ stroke: "#CBD5E1" }}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickMargin={2}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={{ stroke: "#CBD5E1" }}
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
)}
    </div>
  );
};

export default TrendChart;