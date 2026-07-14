import React from "react";
import { Search, Bell, Menu } from "lucide-react";

const Header = ({ selectedPeriod, setSelectedPeriod }) => {
  const periods = ["Daily", "Weekly", "Monthly"];

  return (
    <>
      {/* Top Navbar */}

      <header className="bg-white dark:bg-slate-950 h-20 shadow-sm px-8 flex items-center justify-between text-slate-900 dark:text-white">

        <div className="flex items-center gap-5">

          <button className="lg:hidden">
            <Menu />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              License Analytics Dashboard
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Monitor software utilization across DRDO systems
            </p>
          </div>

        </div>

        <div className="flex items-center gap-4">

          


          {/* Profile */}

          <img
            src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
            alt="Admin"
            className="w-11 h-11 rounded-full"
          />

        </div>

      </header>

      {/* Period Toggle */}

      <div className="px-8 pt-6">

        <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-1">

          {periods.map((period) => (

            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {period}
            </button>

          ))}

        </div>

      </div>
    </>
  );
};

export default Header;