import { exec } from "child_process";

export const getPredictions = (req, res) => {

  const period = req.query.period || "Daily";

  const pythonPath = process.env.PYTHON_PATH;

  exec(
    `${pythonPath} ml/predict.py ${period}`,
    { cwd: process.cwd() },
    (error, stdout, stderr) => {

      if (error) {

        console.error(error);

        return res.status(500).json({
          message: "Prediction failed",
        });

      }

      if (stderr) {
        console.error(stderr);
      }

      try {

        const predictions = JSON.parse(stdout);

        res.json(predictions);

      } catch (err) {

        console.error(err);

        res.status(500).json({
          message: "Invalid prediction output",
        });

      }

    }
  );

};


// --------------------------------------------------
// Trend Prediction
// --------------------------------------------------

export const getTrend = (req, res) => {

  const period = req.query.period || "Daily";

  const pythonPath = process.env.PYTHON_PATH;

  exec(
    `${pythonPath} ml/predict_trend.py ${period}`,
    { cwd: process.cwd() },
    (error, stdout, stderr) => {

      if (error) {

        console.error(error);

        return res.status(500).json({
          message: "Trend prediction failed",
        });

      }

      if (stderr) {
        console.error(stderr);
      }

      try {

        const trend = JSON.parse(stdout);

        res.json(trend);

      } catch (err) {

        console.error(err);

        res.status(500).json({
          message: "Invalid trend output",
        });

      }

    }
  );

};