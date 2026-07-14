import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { totalColor } from "../../utils/chartColors";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const program = payload[0].payload;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">
      <p className="font-bold text-black">
        {program.name}
      </p>

      <div className="mt-2 flex justify-between gap-8">
        <span className="text-slate-600">
          Active Users
        </span>

        <span className="font-semibold text-black">
          {program.users}
        </span>
      </div>
    </div>
  );
};

const ProgramBarChart = ({ selectedLicense }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {selectedLicense.name}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Active users utilizing programs under this license.
        </p>

      </div>

      <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={selectedLicense.programs}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
            barCategoryGap="35%"
          >

            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "#F8FAFC",
              }}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="users"
              name="Users"
              fill={totalColor}
              radius={[8, 8, 0, 0]}
              barSize={28}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default ProgramBarChart;