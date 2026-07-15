import React, { useEffect, useState } from "react";
import axios from "axios";

import PredictionHeader from "../components/matlabPrediction/PredictionHeader";
import PredictionTrend from "../components/matlabPrediction/PredictionTrend";
import ModuleOverview from "../components/matlabPrediction/ModuleOverview";
import RecommendationCard from "../components/matlabPrediction/RecommendationCard";
import PredictionSummary from "../components/matlabPrediction/PredictionSummary";
import ModuleMultiSelect from "../components/matlabPrediction/ModuleMultiSelect";

const MatlabPredictions = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  const [predictions, setPredictions] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const [selectedModule, setSelectedModule] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);

  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictionData();
  }, [selectedPeriod]);

  const fetchPredictionData = async () => {
    try {
      setLoading(true);

      const [predictionRes, trendRes] = await Promise.all([
        axios.get(
          `/api/matlab-prediction/predictions?period=${selectedPeriod}`
        ),
        axios.get(
          `/api/matlab-prediction/trend?period=${selectedPeriod}`
        ),
      ]);

      const predictionData = predictionRes.data || [];
      const trendResponse = trendRes.data || [];

      // Build prediction objects
      const formattedPredictions = predictionData.map((item) => {
        const difference =
          Number((Number)(item.predicted_peak) - (Number)(item.current_peak)).toFixed(2);

        const change =
          item.current_peak === 0
            ? 0
            : Number(
                (
                  (difference / item.current_peak) *
                  100
                ).toFixed(1)
              );

        let recommendation = "No action required";
        let priority = "Low";

        const utilization =
          (item.predicted_peak / item.capacity) * 100;

        if (utilization >= 95) {
          recommendation = "Increase Licenses";
          priority = "High";
        } else if (utilization >= 80) {
          recommendation = "Monitor Usage";
          priority = "Medium";
        }

        return {
          module: item.feature,

          currentPeak: item.current_peak,
          predictedPeak: item.predicted_peak,

          difference,
          change,

          capacity: item.capacity,
          confidence: item.confidence,

          recommendation,
          priority,

          utilization: utilization.toFixed(1),
        };
      });

      // Convert trend data into chart format
      const groupedTrend = {};

      trendResponse.forEach((item) => {
        if (!groupedTrend[item.date]) {
          groupedTrend[item.date] = {
            label: item.date,
          };
        }

        groupedTrend[item.date][item.feature] =
          item.predicted_peak;
      });

      const chartData = Object.values(groupedTrend);

      setPredictions(formattedPredictions);
      setTrendData(chartData);

      if (formattedPredictions.length > 0) {
        setSelectedModule(formattedPredictions[0].module);

        setSelectedModules(
          formattedPredictions
            .slice(0, 4)
            .map((item) => item.module)
        );
      }

      const avgConfidence =
        formattedPredictions.length > 0
          ? (
              formattedPredictions.reduce(
                (sum, item) => sum + item.confidence,
                0
              ) / formattedPredictions.length
            ).toFixed(1)
          : 0;

      const avgUtilization =
        formattedPredictions.length > 0
          ? (
              formattedPredictions.reduce(
                (sum, item) =>
                  sum + Number(item.utilization),
                0
              ) / formattedPredictions.length
            ).toFixed(1)
          : 0;

      setMetrics({
        totalModules: formattedPredictions.length,
        averageConfidence: avgConfidence,
        averageUtilization: avgUtilization,
      });
    } catch (error) {
      console.error("Prediction Fetch Error:", error);

      setPredictions([]);
      setTrendData([]);
      setMetrics({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">

      <div className="flex-1 overflow-y-auto">

        <PredictionHeader
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          metrics={metrics}
        />

        <div className="px-8 mt-6">

          <div className="flex gap-5">

            <div className="flex-1">

              <PredictionTrend
                trendData={trendData}
                loading={loading}
                selectedModules={selectedModules}
                selectedPeriod={selectedPeriod}
              />

            </div>

            <ModuleMultiSelect
              predictions={predictions}
              selectedModules={selectedModules}
              setSelectedModules={setSelectedModules}
            />

          </div>

        </div>

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
              predictions={predictions}
              selectedModule={selectedModule}
            />

          </div>

        </div>

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

export default MatlabPredictions;