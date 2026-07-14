import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const colors = [
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE",
  "#DBEAFE",
  "#E0E7FF",
  "#F1F5F9",
];

const TopModulesChart = ({ selectedPeriod }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      fetchModules();
    }, [selectedPeriod]);
    
    const fetchModules = async () => {
      try {
    
        const response = await axios.get(
          `http://localhost:5001/api/dashboard/top-modules?period=${selectedPeriod}`
        );
    
        setData(response.data);
    
      } catch (err) {
    
        console.error(err);
    
      }
    };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-base font-semibold">
            Top Modules by Peak Concurrent ({selectedPeriod})
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Most frequently used software modules
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span className="text-xs text-slate-500">
            View by:
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

        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 15,
            bottom: 5,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
          />

          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={95}
            tick={{ fontSize: 11 }}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default TopModulesChart;