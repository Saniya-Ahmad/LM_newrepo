import React from "react";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const FuturePredictions = ({
  selectedModule,
  predictions = [],
}) => {

  const data =
    predictions.find(
      (item) => item.module === selectedModule
    ) || {};

  if (!data.module) {

    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-lg font-semibold mb-6">
          Future Prediction
        </h2>

        <p className="text-slate-500">
          No prediction available.
        </p>

      </div>
    );

  }

  const cards = [
    {
      title: "Current Peak",
      value: data.currentPeak,
      icon: null,
    },
    {
      title: "Predicted Peak",
      value: data.predictedPeak,
      icon: null,
    },
    {
      title: "Expected Difference",
      value:
        data.difference > 0
          ? `+${data.difference}`
          : data.difference,
      icon:
        data.difference >= 0 ? (
          <TrendingUp
            size={18}
            className="text-green-600"
          />
        ) : (
          <TrendingDown
            size={18}
            className="text-red-600"
          />
        ),
    },
    {
      title: "Expected Change",
      value: `${data.change}%`,
      icon:
        data.change >= 0 ? (
          <TrendingUp
            size={18}
            className="text-green-600"
          />
        ) : (
          <TrendingDown
            size={18}
            className="text-red-600"
          />
        ),
    },
  ];

  return (

    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-lg font-semibold mb-6">
        Future Prediction
      </h2>

      <div className="space-y-3">

        {cards.map((item) => (

          <div
            key={item.title}
            className="border rounded-xl p-4 hover:bg-slate-50 transition"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {item.value}
                </h2>

              </div>

              {item.icon}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default FuturePredictions;