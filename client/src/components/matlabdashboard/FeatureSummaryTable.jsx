export default function FeatureSummaryTable({ data, period }) {
  const subtitle =
    period === "daily"
      ? "Feature summary for selected date"
      : period === "weekly"
      ? "Feature summary for selected week"
      : "Feature summary for selected month";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">

      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-semibold">
            Feature Summary
          </h2>

          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-xs">

          <thead>
            <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">

              <th className="text-left py-3 font-semibold">
                Feature
              </th>

              <th className="text-center font-semibold">
                OUT
              </th>

              <th className="text-center font-semibold">
                IN
              </th>

              <th className="text-center font-semibold">
                Denied
              </th>

              <th className="text-center font-semibold">
                Peak
              </th>

              <th className="text-center font-semibold">
                Users
              </th>

            </tr>
          </thead>

          <tbody>

            {(!data || data.length === 0) ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-slate-500"
                >
                  No data available
                </td>
              </tr>

            ) : (

              data.map((row, index) => (

                <tr
                  key={index}
                  className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                >

                  <td className="py-3 font-medium">
                    {row.feature}
                  </td>

                  <td className="text-center">
                    {row.checkout_count}
                  </td>

                  <td className="text-center">
                    {row.checkin_count}
                  </td>

                  <td className="text-center text-red-600 font-semibold">
                    {row.denied_count}
                  </td>

                  <td className="text-center font-semibold">
                    {row.peak_concurrent}
                  </td>

                  <td className="text-center">
                    {row.unique_users}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}