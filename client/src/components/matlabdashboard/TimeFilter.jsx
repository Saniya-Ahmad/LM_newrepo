export default function TimeFilter({
  month,
  setMonth,
  period,
  setPeriod,
  selectedDate,
  setSelectedDate,
  selectedWeek,
  setSelectedWeek,
}) {
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const filters = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const totalDays = new Date(2026, month, 0).getDate();

  return (
    <div className="flex items-center gap-4 flex-wrap">

      {/* Month Selector */}
      <select
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm"
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Date Selector (Daily Only) */}
      {period === "daily" && (
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(Number(e.target.value))}
          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm"
        >
          {Array.from({ length: totalDays }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      )}

      {/* Week Selector (Weekly Only) */}
      {period === "weekly" && (
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm"
        >
          <option value={1}>Week 1</option>
          <option value={2}>Week 2</option>
          <option value={3}>Week 3</option>
          <option value={4}>Week 4</option>
        </select>
      )}

      {/* Period Buttons */}
      <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-1">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setPeriod(item.value)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              period === item.value
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}