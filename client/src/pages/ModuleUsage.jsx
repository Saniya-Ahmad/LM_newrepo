import { useEffect, useMemo, useState } from "react";
import {
  Layers,
  Monitor,
  Network,
  Database,
} from "lucide-react";
import api from "../api";

const StatCard = ({
  title,
  value,
  Icon,
  iconBg,
  iconColor,
}) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </h2>
      </div>

      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon className={iconColor} size={22} />
      </div>
    </div>
  </div>
);

export default function ModuleUsage() {
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");

  const [licenseFilter, setLicenseFilter] =
    useState("All");

  const [networkFilter, setNetworkFilter] =
    useState("All");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get(
        "/license/logs",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setLogs(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(err);
      setLogs([]);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        search === "" ||
        log.product
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesLicense =
        licenseFilter === "All" ||
        log.license_type ===
          licenseFilter;

      const matchesNetwork =
        networkFilter === "All" ||
        log.network_type ===
          networkFilter;

      return (
        matchesSearch &&
        matchesLicense &&
        matchesNetwork
      );
    });
  }, [
    logs,
    search,
    licenseFilter,
    networkFilter,
  ]);

  const stats = useMemo(() => {
    return {
      totalRequests:
        filteredLogs.length,

      uniqueProducts: new Set(
        filteredLogs.map(
          (item) => item.product
        )
      ).size,

      activeLabs: new Set(
        filteredLogs.map(
          (item) => item.ip_address
        )
      ).size,

      devices: new Set(
        filteredLogs.map(
          (item) => item.mac_address
        )
      ).size,
    };
  }, [filteredLogs]);  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Module Usage
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Monitor all Microsoft license requests submitted by users across
            different laboratories and systems.
          </p>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          Total Records :
          <span className="ml-2 font-semibold text-slate-900 dark:text-white">
            {filteredLogs.length}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          Icon={Database}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Unique Products"
          value={stats.uniqueProducts}
          Icon={Layers}
          iconBg="bg-indigo-100 dark:bg-indigo-900/40"
          iconColor="text-indigo-600"
        />

        <StatCard
          title="Active Labs"
          value={stats.activeLabs}
          Icon={Network}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="Devices"
          value={stats.devices}
          Icon={Monitor}
          iconBg="bg-orange-100 dark:bg-orange-900/40"
          iconColor="text-orange-600"
        />

      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6">

        <div className="grid gap-4 md:grid-cols-3">

          {/* Search */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Search Product
            </label>

            <input
              type="text"
              placeholder="Search by product..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* License Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              License Type
            </label>

            <select
              value={licenseFilter}
              onChange={(e) =>
                setLicenseFilter(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm"
            >
              <option>All</option>
              <option>Microsoft Office</option>
              <option>Microsoft Windows Server</option>
              <option>SQL Server</option>
            </select>
          </div>

          {/* Network Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Network Type
            </label>

            <select
              value={networkFilter}
              onChange={(e) =>
                setNetworkFilter(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm"
            >
              <option>All</option>
              <option>LAN</option>
              <option>WiFi</option>
              <option>VPN</option>
            </select>
          </div>

        </div>

      </div>
            {/* Request Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            License Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredLogs.length} request(s)
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-slate-100 dark:bg-slate-800">

              <tr>

                <th className="px-6 py-4 text-left font-semibold">
                  License
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Product
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Network
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  MAC Address
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  IP Address
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Screenshot
                </th>

                <th className="px-6 py-4 text-left font-semibold">
                  Submitted
                </th>

                <th className="px-6 py-4 text-center font-semibold">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLogs.length > 0 ? (

                filteredLogs.map((log) => (

                  <tr
                    key={log.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >

                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {log.license_type}
                    </td>

                    <td className="px-6 py-4">
                      {log.product}
                    </td>

                    <td className="px-6 py-4">
                      {log.network_type}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs">
                      {log.mac_address}
                    </td>

                    <td className="px-6 py-4">
                      {log.ip_address}
                    </td>

                    <td className="px-6 py-4">

                      {log.screenshot_path ? (

                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {log.screenshot_path}
                        </span>

                      ) : (

                        <span className="text-slate-400">
                          —
                        </span>

                      )}

                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">

                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "-"}

                    </td>

                    <td className="px-6 py-4 text-center">

                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        Submitted
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={8}
                    className="py-16 text-center text-slate-500 dark:text-slate-400"
                  >

                    <div className="flex flex-col items-center">

                      <Database
                        size={40}
                        className="mb-3 text-slate-300"
                      />

                      <p className="font-medium">
                        No license requests found
                      </p>

                      <p className="text-sm mt-1">
                        Try changing the search or filter.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}