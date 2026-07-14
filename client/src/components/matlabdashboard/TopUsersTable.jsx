export default function TopUsersTable({ data }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Top Active Users
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Users consuming the highest number of licenses
        </p>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b border-slate-300 dark:border-slate-700">

              <th className="text-left py-3 px-2">
                User
              </th>

              <th className="text-center py-3 px-2">
                Host
              </th>

              <th className="text-center py-3 px-2">
                Checkouts
              </th>

              <th className="text-center py-3 px-2">
                Denied
              </th>

              <th className="text-center py-3 px-2">
                Features Used
              </th>

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="text-center py-6 text-slate-500"
                >
                  No users found
                </td>

              </tr>

            ) : (

              data.map((user, index) => (

                <tr
                  key={index}
                  className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                >

                  <td className="py-3 px-2 font-medium">
                    {user.username}
                  </td>

                  <td className="text-center">
                    {user.hostname}
                  </td>

                  <td className="text-center font-semibold text-green-600">
                    {user.checkout_count}
                  </td>

                  <td className="text-center text-red-600 font-semibold">
                    {user.denied_count}
                  </td>

                  <td className="text-center">
                    {user.features_used}
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