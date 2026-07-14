import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  totalColor,
  usedColor,
} from "../../utils/chartColors";

const ProgramConsumption = ({ selectedLab }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Program Consumption
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            License allocation vs. usage for software installed in{" "}
            <span className="font-semibold">{selectedLab.lab}</span>.
          </p>
        </div>
      </div>

      <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={selectedLab.programs}
            margin={{
              top: 10,
              right: 25,
              left: 10,
              bottom: 5,
            }}
            barCategoryGap="38%"
          >

            <CartesianGrid
              vertical={false}
              stroke="#E5E7EB"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: "#64748B",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 12,
                fill: "#64748B",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #CBD5E1",
                boxShadow:
                  "0 8px 20px rgba(15,23,42,0.12)",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: 20,
              }}
            />

            <Bar
              dataKey="total"
              name="Allocated"
              fill={totalColor}
              radius={[6, 6, 0, 0]}
              barSize={18}
            />

            <Bar
              dataKey="consumed"
              name="Used"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default ProgramConsumption;