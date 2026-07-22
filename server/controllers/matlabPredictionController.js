import { exec } from "child_process";
import path from "path";

const PYTHON = process.platform === "win32" ? "python" : "python3";

export const getPredictions = (req, res) => {

  const script = path.join(process.cwd(), "python", "ml", "predict.py");

  exec(
    `${PYTHON} "${script}"`,
    (error, stdout, stderr) => {

      console.log("STDOUT:");
      console.log(stdout);

      console.log("STDERR:");
      console.log(stderr);

      console.log("ERROR:");
      console.log(error);

      if (error) {
        return res.status(500).json({
          message: error.message,
          stderr,
        });
      }

      try {
        res.json(JSON.parse(stdout));
      } catch (err) {
        res.status(500).json({
          message: "Invalid JSON",
          stdout,
        });
      }
    }
  );
};

export const getTrend = (req, res) => {

  const script = path.join(process.cwd(), "python", "ml", "predict_trend.py");

  exec(
    `${PYTHON} "${script}"`,
    (error, stdout, stderr) => {

      console.log("STDOUT:");
      console.log(stdout);

      console.log("STDERR:");
      console.log(stderr);

      console.log("ERROR:");
      console.log(error);

      if (error) {
        return res.status(500).json({
          message: error.message,
          stderr,
        });
      }

      try {
        res.json(JSON.parse(stdout));
      } catch (err) {
        res.status(500).json({
          message: "Invalid JSON",
          stdout,
        });
      }
    }
  );
};