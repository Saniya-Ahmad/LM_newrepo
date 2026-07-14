import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  labDistribution,
} from "../../data/excelDummyData";

import {
  licenseColors,
} from "../../utils/chartColors";

const totalLicenses = labDistribution.reduce(
  (sum, lab) => sum + lab.value,
  0
);

const CustomTooltip = ({
  active,
  payload,
}) => {
  if (!active || !payload || !payload.length) return null;

  const lab = payload[0].payload;

  const percentage = (
    (lab.value / totalLicenses) *
    100
  ).toFixed(1);

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 shadow-xl px-4 py-3"
      style={{
        minWidth: 180,
      }}
    >
      <div className="text-black font-bold text-base">
        {lab.lab}
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <span className="text-black">
          Allocated
        </span>

        <span className="font-semibold text-black">
          {lab.value}
        </span>
      </div>

      <div className="mt-1 flex justify-between text-sm">
        <span className="text-slate-500">
          Share
        </span>

        <span className="font-semibold text-slate-700">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const LabDistribution = ({
  setSelectedLab,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Lab Distribution
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          License allocation across laboratories.
        </p>
      </div>

      <div className="h-[400px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={labDistribution}
              dataKey="value"
              nameKey="lab"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={2}
              activeOuterRadius={128}
              labelLine={false}
              label={false}
              onClick={(lab) =>
                setSelectedLab(lab)
              }
            >
              {labDistribution.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      licenseColors[
                        index %
                          licenseColors.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: 20,
                fontSize: 13,
              }}
            />

            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-900 dark:fill-white"
              style={{
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {totalLicenses}
            </text>

            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-500 dark:fill-slate-400"
              style={{
                fontSize: 13,
              }}
            >
              Licenses
            </text>

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default LabDistribution;