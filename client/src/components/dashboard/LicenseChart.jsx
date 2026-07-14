import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  licenseDistribution,
} from "../../data/excelDummyData";

import {
  licenseColors,
} from "../../utils/chartColors";

const totalLicenses = licenseDistribution.reduce(
  (sum, item) => sum + item.value,
  0
);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const license = payload[0].payload;

  const percentage = (
    (license.value / totalLicenses) *
    100
  ).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3">

      <p className="text-black font-bold text-base">
        {license.name}
      </p>

      <div className="mt-2 flex justify-between gap-8 text-sm">
        <span className="text-black">
          Allocated
        </span>

        <span className="font-semibold text-black">
          {license.value}
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

const LicenseChart = ({
  setSelectedLicense,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          License Distribution
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Distribution of software licenses across products.
        </p>

      </div>

      <div className="h-[390px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={licenseDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              outerRadius={120}
              paddingAngle={3}
              stroke="#fff"
              strokeWidth={2}
              activeOuterRadius={128}
              label={false}
              labelLine={false}
              onClick={(data) =>
                setSelectedLicense(data)
              }
            >

              {licenseDistribution.map(
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
                paddingTop: 15,
                fontSize: 13,
              }}
            />

            <text
              x="50%"
              y="47%"
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
              y="57%"
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

export default LicenseChart;