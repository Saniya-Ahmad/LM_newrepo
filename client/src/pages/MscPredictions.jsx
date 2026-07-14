import React, { useState, useEffect } from "react";
import axios from "axios";


import PredictionHeader from "../components/xgboost/PredictionHeader";
import PredictionTrend from "../components/xgboost/PredictionTrend";
import ModuleOverview from "../components/xgboost/ModuleOverview";
import RecommendationCard from "../components/xgboost/RecommendationCard";
import PredictionSummary from "../components/xgboost/PredictionSummary";
import ModuleMultiSelect from "../components/xgboost/ModuleMultiSelect";

const MscPredictions = () => {

  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  const [selectedModules, setSelectedModules] = useState([]);

  const [selectedModule, setSelectedModule] = useState("");

  const [predictions, setPredictions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [metrics, setMetrics] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, [selectedPeriod]);

  useEffect(() => {

    if (predictions.length === 0) {
      setSelectedModule("");
      setSelectedModules([]);
      return;
    }

    if (
      !predictions.some(
        (item) => item.module === selectedModule
      )
    ) {
      setSelectedModule(predictions[0].module);
    }

    setSelectedModules(
      predictions
        .slice(0, 4)
        .map((item) => item.module)
    );

  }, [predictions]);

  const fetchPredictions = async () => {

    try {
  
      setLoading(true);
  
      const [predictionResponse, trendResponse] = await Promise.all([
  
        axios.get(
          `http://localhost:5001/api/msc/predictions/predictions?period=${selectedPeriod}`
        ),
  
        axios.get(
          `http://localhost:5001/api/msc/predictions/trend?period=${selectedPeriod}`
        ),
  
      ]);
  
      if (predictionResponse.data.status === "insufficient_data") {
  
        setPredictions([]);
        setTrendData([]);
        setMetrics({});
  
      } else {
  
        setPredictions(
          predictionResponse.data.predictions
        );
  
        setMetrics(
          predictionResponse.data.metrics
        );
  
        setTrendData(
          trendResponse.data.trend
        );
  
      }
  
    } catch (err) {
  
      console.error("Failed to fetch predictions:", err);
  
      setPredictions([]);
      setTrendData([]);
      setMetrics({});
  
    } finally {
  
      setLoading(false);
  
    }
  
  };

  return (

    <div className="flex min-h-screen bg-slate-100">


      <div className="flex-1 overflow-y-auto">

        <PredictionHeader
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          metrics={metrics}
        />

        {/* Trend */}

        <div className="px-8 mt-6">

          <div className="flex justify-between items-start gap-4">

            <div className="flex-1">

            <PredictionTrend
  selectedPeriod={selectedPeriod}
  selectedModules={selectedModules}
  trendData={trendData}
  loading={loading}
/>

            </div>

            <ModuleMultiSelect
              predictions={predictions}
              selectedModules={selectedModules}
              setSelectedModules={setSelectedModules}
            />

          </div>

        </div>

        {/* Module Overview + Recommendation */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-8 mt-8">

          <div className="xl:col-span-7">

            <ModuleOverview
              predictions={predictions}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
            />

          </div>

          <div className="xl:col-span-5">

            <RecommendationCard
              selectedModule={selectedModule}
              predictions={predictions}
            />

          </div>

        </div>

        {/* Summary */}

        <div className="px-8 mt-8 mb-8">

          <PredictionSummary
            predictions={predictions}
            selectedModule={selectedModule}
            metrics={metrics}
          />

        </div>

      </div>

    </div>

  );

};

export default MscPredictions;