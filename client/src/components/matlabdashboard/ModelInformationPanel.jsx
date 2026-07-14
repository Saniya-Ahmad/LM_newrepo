import React from "react";
import {
  Database,
  Calendar,
 CheckCircle2,
  BarChart3,
  Zap,
} from "lucide-react";

export default function ModelInformationPanel({ data }) {
  const infoItems = [
    {
      icon: Zap,
      label: "Model",
      value: data.algorithm || "XGBoost Regressor",
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      icon: BarChart3,
      label: "Version",
      value: data.version || "1.0",
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: Database,
      label: "MAE",
      value: data.mae ?? "-",
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: BarChart3,
      label: "RMSE",
      value: data.rmse ?? "-",
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900",
    },
    {
      icon: CheckCircle2,
      label: "R² Score",
      value: data.r2 ?? "-",
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900",
    },
    {
      icon: Calendar,
      label: "Trained On",
      value: data.trained_on || "-",
      color: "text-pink-600",
      bg: "bg-pink-100 dark:bg-pink-900",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="text-pink-600" size={18} />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Model Information
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-700 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}
                >
                  <Icon className={item.color} size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase">
                    {item.label}
                  </p>

                  <p className="font-semibold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Model performance metrics are calculated during training and updated
          whenever the XGBoost model is retrained.
        </p>
      </div>
    </div>
  );
}