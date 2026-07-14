import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const pieColors = [
    "#2563EB", // Blue - OUT
    "#22C55E", // Green - IN
    "#EF4444", // Red - DENIED
    "#F59E0B", // Amber - QUEUED
    "#8B5CF6", // Purple - DEQUEUED
  ];

const EventDistribution = ({ selectedPeriod }) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDistribution();
  }, [selectedPeriod]);

  const fetchDistribution = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5001/api/dashboard/event-distribution?period=${selectedPeriod}`
      );

      setData(response.data);

    } catch (err) {

      console.error(err);

    }

  };

  const totalEvents = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full">

      <h2 className="text-lg font-semibold mb-6">
        Event Distribution ({selectedPeriod})
      </h2>

      <div className="flex items-center justify-center gap-8">

        <div className="relative w-[240px] h-[240px] flex-shrink-0">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={1}
                stroke="#fff"
                strokeWidth={2}
              >

                {data.map((entry, index) => (

                  <Cell
                    key={entry.name}
                    fill={pieColors[index % pieColors.length]}
                  />

                ))}

              </Pie>

              <Tooltip
                cursor={false}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  fontSize: "13px",
                }}
                formatter={(value, name) => [
                  `${Number(value).toLocaleString()} Events`,
                  name,
                ]}
              />

            </PieChart>

          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

            <p className="text-xs text-slate-500">
              Total Events
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {totalEvents.toLocaleString()}
            </h3>

          </div>

        </div>

        <div className="flex-1">

          <div className="space-y-4">

            {data.map((item, index) => {

              const percentage =
                totalEvents === 0
                  ? 0
                  : ((item.value / totalEvents) * 100).toFixed(1);

              return (

                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor:
                          pieColors[index % pieColors.length],
                      }}
                    />

                    <span className="w-20 text-sm font-medium text-slate-700">
                      {item.name}
                    </span>

                  </div>

                  <div className="text-right">

                    <div className="font-semibold text-slate-900 text-sm">
                      {item.value.toLocaleString()}
                    </div>

                    <div className="text-sm text-slate-500">
                      ({percentage}%)
                    </div>

                  </div>

                </div>

              );

            })}

          </div>

          <p className="text-xs text-slate-400 mt-8 leading-5">
            * Percentages may not total exactly 100% due to rounding.
          </p>

        </div>

      </div>

    </div>
  );
};

export default EventDistribution;