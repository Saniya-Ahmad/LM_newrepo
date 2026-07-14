import { useEffect, useState } from "react";
import axios from "axios";

import PredictionTrendChart from "../components/matlabdashboard/PredictionTrendChart";
import RecommendationPanel from "../components/matlabdashboard/RecommendationPanel";
import PredictionSummaryTable from "../components/matlabdashboard/PredictionSummaryTable";
import ModelInformationPanel from "../components/matlabdashboard/ModelInformationPanel";

export default function MatlabPredictions() {
  const [trend, setTrend] = useState([]);
  const [summary, setSummary] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [modelInfo, setModelInfo] = useState({});

  useEffect(() => {
    loadPredictionDashboard();
  }, []);

  async function loadPredictionDashboard() {
    try {
      const [
        trendRes,
        summaryRes,
        recommendationRes,
        modelInfoRes,
      ] = await Promise.all([
        axios.get("/api/matlab-prediction/trend"),
        axios.get("/api/matlab-prediction/summary"),
        axios.get("/api/matlab-prediction/recommendations"),
        axios.get("/api/matlab-prediction/model-info"),
      ]);
console.log("Trend:", trendRes.data);
console.log("Summary:", summaryRes.data);
console.log("Recommendations:", recommendationRes.data);
console.log("Model Info:", modelInfoRes.data);
      setTrend(trendRes.data);
      setSummary(summaryRes.data);
      setRecommendations(recommendationRes.data);
      setModelInfo(modelInfoRes.data);
    } catch (err) {
      console.error("Prediction Dashboard Error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          MATLAB License Demand Prediction
        </h1>

        <p className="text-slate-500 mt-2">
          Forecast future MATLAB license demand using an XGBoost regression model.
        </p>
      </div>

      {/* Prediction Trend */}
      <PredictionTrendChart data={trend} />

      {/* Recommendation + Model Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <RecommendationPanel
          data={recommendations}
        />

        <ModelInformationPanel
          data={modelInfo}
        />

      </div>

      {/* Prediction Summary - Full Width */}
      <div className="mt-6">

        <PredictionSummaryTable
          data={summary}
        />

      </div>

    </div>
  );
}