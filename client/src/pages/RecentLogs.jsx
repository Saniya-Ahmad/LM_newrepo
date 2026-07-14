import { useEffect, useState } from "react";

function withinLastDays(iso, days) {
  const d = new Date(iso);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return d >= cutoff;
}

export default function RecentLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get(
          "/license/logs",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const recent = res.data.filter((l) => withinLastDays(l.timestamp, 60));
        setLogs(recent);
      } catch (err) {
        console.error(err);
        setLogs([]);
      }
    };

    fetchLogs();
  }, []);

  if (!logs.length) return <div className="max-w-3xl mx-auto p-6 text-center text-slate-600 dark:text-slate-300">No logs in the last 60 days.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 card-surface">
      <h2 className="text-xl font-bold mb-4 text-slate-950 dark:text-slate-100">Recent Logs (last 60 days)</h2>

      <div className="space-y-4">
        {logs.map((l) => (
          <div key={l.id} className="p-4 border border-slate-300 rounded-2xl bg-white/90 dark:border-slate-700 dark:bg-slate-950/80">
            <div className="text-sm text-slate-600 dark:text-slate-400">{new Date(l.timestamp).toLocaleString()} — {l.user}</div>
            <pre className="mt-3 text-sm overflow-x-auto text-slate-900 dark:text-slate-200">{JSON.stringify(l.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
