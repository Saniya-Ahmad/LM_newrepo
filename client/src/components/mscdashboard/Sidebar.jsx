import React from "react";
import {
  LayoutDashboard,
  Activity,
  FileBarChart2,
  Users,
  Calendar,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Predictions (XGBoost)",
    icon: Activity,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col">

      {/* Logo */}

      <div className="h-24 flex items-center px-5 border-b border-slate-200">

        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mr-4 shadow-md">

          <LayoutDashboard
            size={28}
            className="text-white"
          />

        </div>

        <div>

          <h1 className="text-xl font-bold text-slate-900">
            License Analytics
          </h1>


        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 py-4 px-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition mb-2
                ${
                  item.active
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <Icon
                size={21}
                className={
                  item.active
                    ? "text-blue-600"
                    : "text-slate-500"
                }
              />

              <span className="text-base">
                {item.title}
              </span>

            </button>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-200 p-4">

        <div className="bg-slate-100 rounded-xl p-4">

          <p className="text-sm text-slate-500">
            Logged in as
          </p>

          <h2 className="font-semibold text-slate-900 mt-1">
            Administrator
          </h2>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;