import React, { useState } from "react";

import Sidebar from "../components/mscdashboard/Sidebar";
import Header from "../components/mscdashboard/Header";
import KPICards from "../components/mscdashboard/KPICards";
import AnalyticsCharts from "../components/mscdashboard/AnalyticsCharts";

const MSCDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex-1 overflow-y-auto">

        <Header
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />

        {/* KPI Cards */}

        <KPICards
          selectedPeriod={selectedPeriod}
        />

        {/* Charts */}

        <AnalyticsCharts
          selectedPeriod={selectedPeriod}
        />

        {/* Activity Section */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-8 mt-8">

          {/* Future widgets */}

        </div>

      </div>

    </div>
  );
};

export default MSCDashboard;