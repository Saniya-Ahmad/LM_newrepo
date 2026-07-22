import React from "react";

import TrendChart from "./TrendChart";
import TopModulesChart from "./TopModulesChart";
import FeatureSummary from "./FeatureSummary";
import EventDistribution from "./EventDistribution";

const AnalyticsCharts = ({ selectedPeriod }) => {
  return (
    <>
      {/* ================= Top Row ================= */}

      <div className="px-8 mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <TrendChart selectedPeriod={selectedPeriod} />

          <TopModulesChart selectedPeriod={selectedPeriod} />

        </div>
      </div>

      {/* ================= Bottom Row ================= */}

      <div className="px-8 mt-8 mb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <FeatureSummary selectedPeriod={selectedPeriod} />

          <EventDistribution selectedPeriod={selectedPeriod} />

        </div>
      </div>
    </>
  );
};

export default AnalyticsCharts;