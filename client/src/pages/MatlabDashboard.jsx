import { useEffect, useState } from "react";
import axios from "axios";

import TimeFilter from "../components/matlabDashboard/TimeFilter";
import KPICards from "../components/matlabDashboard/KPICards";
import UsageTrendChart from "../components/matlabDashboard/UsageTrendChart";
import ModuleUsageChart from "../components/matlabDashboard/ModuleUsageChart";
import EventDistributionChart from "../components/matlabDashboard/EventDistributionChart";
 import FeatureSummaryTable from "../components/matlabDashboard/FeatureSummaryTable";

export default function MatlabDashboard() {

 
const [month, setMonth] = useState(5);      // Default May
const [period, setPeriod] = useState("daily");
  const [kpis, setKpis] = useState({});
  const [usageTrend, setUsageTrend] = useState([]);
   const [selectedDate, setSelectedDate] = useState(25);
  const [selectedWeek, setSelectedWeek] = useState(1);
   const [moduleUsage, setModuleUsage] = useState([]);
  const [eventDistribution, setEventDistribution] = useState({});
  const [featureSummary, setFeatureSummary] = useState([]);

useEffect(() => {
  loadDashboard();
}, [period, month, selectedDate, selectedWeek]);

  const loadDashboard = async () => {

    try {

     const [
  kpiRes,
  trendRes,
  moduleRes,
  featureRes,
  eventRes,
] = await Promise.all([

axios.get(
  `/api/matlab/kpis?period=${period}&month=${month}&date=${selectedDate}&week=${selectedWeek}`
),
  axios.get(
    `/api/matlab/usage-trend?period=${period}&month=${month}&date=${selectedDate}&week=${selectedWeek}`
  ),

  axios.get(
    `/api/matlab/module-usage?period=${period}&month=${month}&date=${selectedDate}&week=${selectedWeek}`
  ),

  axios.get(
    `/api/matlab/feature-summary?period=${period}&month=${month}&date=${selectedDate}&week=${selectedWeek}`
  ),
  axios.get(
    `/api/matlab/event-distribution?period=${period}&month=${month}&date=${selectedDate}&week=${selectedWeek}`
  ),

]);


      setKpis(kpiRes.data);

      setUsageTrend(trendRes.data);

      setModuleUsage(moduleRes.data);

     setEventDistribution(eventRes.data);

       setFeatureSummary(featureRes.data);


    }
    catch(err){

      console.error("Dashboard Error:",err);

    }

  };


  return (

    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6">


      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">

            MATLAB License Analytics Dashboard

          </h1>


          <p className="text-slate-500 mt-1">

            Monitor MATLAB license utilization, module activity and demand.

          </p>

        </div>


    <TimeFilter
    period={period}
    setPeriod={setPeriod}
    month={month}
    setMonth={setMonth}
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    selectedWeek={selectedWeek}
  setSelectedWeek={setSelectedWeek}
    />


      </div>



      {/* KPI */}

      <KPICards data={kpis} />



      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">


        <UsageTrendChart data={usageTrend} period={period}/>


        <ModuleUsageChart
    data={moduleUsage}
    period={period}
/>


      </div>




      {/* Tables + Event Distribution */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">


         <FeatureSummaryTable data={featureSummary} 
    period={period} />


        <EventDistributionChart data={eventDistribution} /> 


      </div>



    </div>

  );

}