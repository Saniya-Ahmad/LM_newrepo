import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

import { labDistribution } from "../../data/excelDummyData";
import { totalColor, usedColor } from "../../utils/chartColors";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl px-4 py-3">
      <p className="font-semibold text-slate-900 dark:text-white mb-2">
        {label}
      </p>

      <div className="space-y-1 text-sm">
        <p className="flex items-center justify-between gap-8">
          <span className="text-slate-500 dark:text-slate-400">
            Total Licenses
          </span>
          <span
            className="font-semibold"
            style={{ color: totalColor }}
          >
            {payload[0].value}
          </span>
        </p>

        <p className="flex items-center justify-between gap-8">
          <span className="text-slate-500 dark:text-slate-400">
            In Use
          </span>
          <span
            className="font-semibold"
            style={{ color: usedColor }}
          >
            {payload[1].value}
          </span>
        </p>

        <hr className="my-2 border-slate-200 dark:border-slate-700" />

        <p className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">
            Utilization
          </span>

          <span className="font-bold text-slate-900 dark:text-white">
            {Math.round((payload[1].value / payload[0].value) * 100)}%
          </span>
        </p>
      </div>
    </div>
  );
};

const LabWiseLicenseChart = () => {
  const data = labDistribution.map((lab) => ({
    name: lab.lab,
    licenses: lab.value,
    consumed: lab.programs.reduce(
      (sum, item) => sum + item.consumed,
      0
    ),
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Lab License Usage
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare allocated and consumed licenses across laboratories.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 py-6">
        <div className="h-[430px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 30,
                right: 15,
                left: 5,
                bottom: 10,
              }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                vertical={false}
                stroke="#E2E8F0"
                strokeDasharray="2 2"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 13,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(37,99,235,.06)",
                }}
                content={<CustomTooltip />}
              />

              <Legend
                iconType="circle"
                iconSize={10}
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  paddingBottom: 20,
                }}
              />

              <Bar
                dataKey="licenses"
                name="Allocated"
                fill={totalColor}
                radius={[10, 10, 0, 0]}
                maxBarSize={42}
              >
                <LabelList
                  dataKey="licenses"
                  position="top"
                  fill="#334155"
                  fontSize={11}
                  fontWeight={600}
                />
              </Bar>

              <Bar
                dataKey="consumed"
                name="In Use"
                fill={usedColor}
                radius={[10, 10, 0, 0]}
                maxBarSize={42}
              >
                <LabelList
                  dataKey="consumed"
                  position="top"
                  fill="#334155"
                  fontSize={11}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Total Labs
            </p>

            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {data.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Total Licenses
            </p>

            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {data.reduce((sum, item) => sum + item.licenses, 0)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              In Use
            </p>

            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {data.reduce((sum, item) => sum + item.consumed, 0)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Utilization
            </p>

            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {Math.round(
                (data.reduce((sum, item) => sum + item.consumed, 0) /
                  data.reduce((sum, item) => sum + item.licenses, 0)) *
                  100
              )}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabWiseLicenseChart;