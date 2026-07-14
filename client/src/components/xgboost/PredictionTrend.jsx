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

const lineColors = {
    ADAMS_View: "#2563EB",
    Patran: "#10B981",
    Solver: "#F59E0B",
    Marc: "#EF4444",
    SimManager: "#8B5CF6",
    Easy5: "#06B6D4",
    Nastran: "#F97316",
    Adams_Post: "#EC4899",
  };
  const PredictionTrend = ({
    selectedPeriod,
    selectedModules,
    trendData = [],
    loading,
  }) => {
  const data = trendData;
  if (loading) {

    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 h-[520px] flex items-center justify-center">
        Loading predictions...
      </div>
    );
  
  }
  
  if (data.length === 0) {
  
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 h-[520px] flex items-center justify-center">
        No trend data available.
      </div>
    );
  
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-lg font-semibold">
            Prediction Trend ({selectedPeriod})
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Forecasted peak concurrent license demand
          </p>

        </div>

        

      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={420}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
          />

          <Tooltip />

          <Legend />

          {selectedModules.map((module) => (

<Line
  key={module}
  type="monotone"
  dataKey={module}
  stroke={lineColors[module]}
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