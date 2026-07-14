import DashboardContainer from "../components/dashboard/DashboardContainer";

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Welcome to your license management dashboard. Here's an overview of your software licenses across all laboratories.
        </p>
      </div>

      {/* Dashboard Container */}
<div
  className="
    rounded-3xl
    shadow-xl
    p-6
    border
    border-slate-200
    bg-white
    dark:bg-slate-900
    dark:border-slate-800
    transition-colors
    duration-300
  "
>        <DashboardContainer />
      </div>
    </div>
  );
};

export default AdminDashboard;