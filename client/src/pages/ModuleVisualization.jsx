import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowRight,
  Layers,
  Server,
  Users,
} from "lucide-react";
import api from "../api";

const formatNumber = (value) => new Intl.NumberFormat().format(value);

const periods = ["Daily", "Weekly", "Monthly"];
const periodKey = {
  Daily: "day",
  daily: "day",
  Weekly: "week",
  weekly: "week",
  Monthly: "month",
  monthly: "month",
};
const filters = {
  day: (date) => {
    const now = new Date();
    return date.toDateString() === now.toDateString();
  },
  week: (date) => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return date >= start && date <= now;
  },
  month: (date) => {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  },
};

const COLORS = ["#0ea5e9", "#3b82f6", "#1d4ed8", "#1e40af", "#1e3a8a", "#f59e0b", "#ec4899", "#8b5cf6"];

const StatCard = ({ title, value, detail, icon: Icon, iconBg, iconColor }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950 transition">
    <div className="flex items-start gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        {detail && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail}</p>}
      </div>
    </div>
  </div>
);

export default function ModuleVisualization() {
  const [logs, setLogs] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/license/logs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setLogs([]);
      }
    };

    fetchLogs();
  }, []);

  const filterKey = periodKey[selectedPeriod] || "week";
  const filterFn = filters[filterKey] || filters.week;

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        if (!log.timestamp) return false;
        const date = new Date(log.timestamp);
        return filterFn(date);
      }),
    [logs, filterFn]
  );

  const chartData = useMemo(() => {
    const bucket = {};
    const now = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    filteredLogs.forEach((log) => {
      if (!log.timestamp) return;
      const date = new Date(log.timestamp);

      if (selectedPeriod === "Daily") {
        const label = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        bucket[label] = (bucket[label] || 0) + 1;
      } else if (selectedPeriod === "Weekly") {
        const label = dayNames[date.getDay()];
        bucket[label] = (bucket[label] || 0) + 1;
      } else {
        const label = `Day ${date.getDate()}`;
        bucket[date.getDate()] = (bucket[date.getDate()] || 0) + 1;
      }
    });

    if (selectedPeriod === "Daily") {
      return Object.entries(bucket)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, value]) => ({ label, value }));
    }

    if (selectedPeriod === "Weekly") {
      return dayNames.map((day) => ({ label: day, value: bucket[day] || 0 }));
    }

    const days = Array.from({ length: now.getDate() }, (_, idx) => idx + 1);
    return days.map((day) => ({ label: `Day ${day}`, value: bucket[day] || 0 }));
  }, [filteredLogs, selectedPeriod]);

  const modules = useMemo(() => {
    const setModules = new Set();
    logs.forEach((log) => {
      const product = log.product || log.data?.product || log.data?.license;
      if (product) setModules.add(product);
    });
    return Array.from(setModules).sort();
  }, [logs]);

  const moduleDistribution = useMemo(() => {
    const counts = {};
    filteredLogs.forEach((log) => {
      const product = log.product || log.data?.product || log.data?.license || "Unknown";
      counts[product] = (counts[product] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  const moduleLabData = useMemo(() => {
    if (!selectedModule) return [];

    const labCounts = {};
    filteredLogs.forEach((log) => {
      const product = log.product || log.data?.product || log.data?.license;
      if (product !== selectedModule) return;
      const lab = log.lab || log.data?.ip || "Unknown Lab";
      labCounts[lab] = (labCounts[lab] || 0) + 1;
    });

    return Object.entries(labCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lab, count]) => ({ lab, count }));
  }, [filteredLogs, selectedModule]);

  const topModules = useMemo(() => {
    const counts = {};
    filteredLogs.forEach((log) => {
      const product = log.product || log.data?.product || log.data?.license || "Unknown";
      counts[product] = (counts[product] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  const topLabs = useMemo(() => {
    const counts = {};
    filteredLogs.forEach((log) => {
      const lab = log.lab || log.data?.ip || "Unknown Lab";
      counts[lab] = (counts[lab] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredLogs]);

  const kpiCards = [
    {
      title: "Total Requests",
      value: formatNumber(filteredLogs.length),
      detail: `${selectedPeriod} range`,
      icon: ArrowRight,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      title: "Unique Modules",
      value: formatNumber(modules.length),
      detail: "Distinct module names",
      icon: Layers,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Active Labs",
      value: formatNumber(topLabs.length),
      detail: "Labs with current hits",
      icon: Server,
      iconBg: "bg-green-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Devices Seen",
      value: formatNumber(new Set(filteredLogs.map((log) => log.systemId || log.data?.mac)).size),
      detail: "Unique system IDs",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-100">Module Usage Visualization</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Analyze module usage patterns across different time periods and identify lab-wise consumption.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}>
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            detail={card.detail}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-w-0 dark:border-slate-700 dark:bg-slate-950">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Usage Trend</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">View usage activity for the selected period.</p>
          </div>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">No data found for this period.</p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-w-0 dark:border-slate-700 dark:bg-slate-950">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Module Distribution</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Most popular modules for the chosen window.</p>
          </div>
          {moduleDistribution.length ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={moduleDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}>
                  {moduleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">No module distribution available.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Lab-wise Usage</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pick a module to inspect lab consumption.</p>
            </div>
            <select
              value={selectedModule || ""}
              onChange={(e) => setSelectedModule(e.target.value || null)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">-- Select a module --</option>
              {modules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
          {selectedModule ? (
            moduleLabData.length ? (
            <div className="space-y-4">

{moduleLabData.map((lab,index)=>(
  
<div
 key={lab.lab}
 className="rounded-2xl border border-slate-200 
 p-4 dark:border-slate-700"
>

<div className="flex justify-between items-center">


<div className="flex items-center gap-3">


<div
className="
h-10 w-10 rounded-full
bg-blue-100 text-blue-700
flex items-center justify-center
font-bold
dark:bg-blue-900 dark:text-blue-300
"
>
{index+1}
</div>


<div>

<p className="
font-semibold
text-slate-900
dark:text-white
">
{lab.lab}
</p>


<p className="
text-xs text-slate-500
">
Rank #{index+1} laboratory
</p>


</div>


</div>



<div className="text-right">

<p className="
text-xl font-bold
text-blue-600
">
{lab.count}
</p>

<p className="
text-xs text-slate-500
">
requests
</p>

</div>


</div>



<div className="
mt-4 h-3 rounded-full
bg-slate-200
dark:bg-slate-800
overflow-hidden
">

<div
className="
h-full rounded-full
bg-blue-600
transition-all duration-500
"
style={{
width:`${lab.percentage}%`
}}
/>

</div>



<div className="
mt-2 flex justify-between
text-xs text-slate-500
">

<span>
Consumption share
</span>


<span>
{lab.percentage}%
</span>


</div>


</div>

))}


</div>
            ) : (
              <p className="text-sm text-slate-500">No lab usage data available for {selectedModule}.</p>
            )
          ) : (
            <p className="text-sm text-slate-500">Select a module from the dropdown to view lab-wise usage.</p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top Modules</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Highest usage modules this period.</p>
          </div>
          <div className="space-y-4">
            {topModules.length ? (
              topModules.map((module, idx) => (
                <div key={module.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{module.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{module.value} uses</p>
                    </div>
                    <span className="inline-flex h-8 min-w-[52px] items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {module.value}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, (module.value / (topModules[0]?.value || 1)) * 100)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No module usage data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
