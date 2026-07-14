import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Dot,
} from "recharts";
import { ChevronDown, Info } from "lucide-react";

export default function PredictionTrendChart({ data }) {
  const [period, setPeriod] = useState("weekly");
  const [selectedFeatures, setSelectedFeatures] = useState(["MATLAB", "simulink", "signal_toolbox", "control_toolbox"]);

  const features = ["MATLAB", "simulink", "signal_toolbox", "control_toolbox", "map_toolbox", "simulink_control_design", "distri_computing_toolbox", "aerospace_toolbox"];
  const featureColors = {
    MATLAB: "#2563EB",
    simulink: "#10B981",
    signal_toolbox: "#8B5CF6",
    control_toolbox: "#F59E0B",
    map_toolbox: "#EF4444",
    simulink_control_design: "#06B6D4",
    distri_computing_toolbox: "#EC4899",
    aerospace_toolbox: "#14B8A6",
  };

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  // Sample data structure - replace with actual data
  const sampleData = [
    {
      name: "Jun 30 – Jul 06",
      MATLAB: 57,
      simulink: 44,
      signal_toolbox: 23,
      control_toolbox: 17,
      map_toolbox: 15,
      simulink_control_design: 11,
      distri_computing_toolbox: 10,
      aerospace_toolbox: 8,
    },
    {
      name: "Jul 07 – Jul 13",
      MATLAB: 62,
      simulink: 48,
      signal_toolbox: 26,
      control_toolbox: 20,
      map_toolbox: 17,
      simulink_control_design: 13,
      distri_computing_toolbox: 11,
      aerospace_toolbox: 9,
    },
    {
      name: "Jul 14 – Jul 20",
      MATLAB: 68,
      simulink: 52,
      signal_toolbox: 30,
      control_toolbox: 23,
      map_toolbox: 19,
      simulink_control_design: 15,
      distri_computing_toolbox: 12,
      aerospace_toolbox: 10,
    },
    {
      name: "Jul 21 – Jul 27",
      MATLAB: 72,
      simulink: 56,
      signal_toolbox: 33,
      control_toolbox: 25,
      map_toolbox: 21,
      simulink_control_design: 17,
      distri_computing_toolbox: 13,
      aerospace_toolbox: 11,
    },
    {
      name: "Jul 28 – Aug 03",
      MATLAB: 78,
      simulink: 61,
      signal_toolbox: 37,
      control_toolbox: 28,
      map_toolbox: 23,
      simulink_control_design: 19,
      distri_computing_toolbox: 15,
      aerospace_toolbox: 12,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 dark:bg-slate-950 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Prediction Trend (Predicted Peak Concurrent Usage)
            </h2>
            <Info size={16} className="text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Forecasted peak concurrent usage trends across selected features
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400">Features:</span>
          <div className="text-xs font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            {selectedFeatures.length} selected
          </div>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800">
        {["Daily", "Weekly", "Monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab.toLowerCase())}
            className={`px-4 py-2 text-sm font-medium transition ${
              period === tab.toLowerCase()
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={sampleData}
          margin={{ top: 10, right: 20, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickMargin={8}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748B" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #475569",
              borderRadius: "0.5rem",
              color: "#F1F5F9",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />

          {selectedFeatures.map((feature) => (
            <Line
              key={feature}
              type="monotone"
              dataKey={feature}
              stroke={featureColors[feature]}
              strokeWidth={2}
              dot={{ r: 4, fill: featureColors[feature] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Feature Selection */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-semibold text-slate-900 dark:text-white mb-3">
          Select Features to Display
        </p>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <button
              key={feature}
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                selectedFeatures.includes(feature)
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: featureColors[feature],
                    opacity: selectedFeatures.includes(feature) ? 1 : 0.3,
                  }}
                />
                {feature}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
