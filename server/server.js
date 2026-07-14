import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import xgboostRoutes from "./routes/xgboostRoutes.js";
import authRoutes from "./routes/auth.js";
import licenseRoutes from "./routes/license.js";
import matlabRoutes from "./routes/matlab.js";
import matlabPredictionRoutes from "./routes/matlabPredictionRoute.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/license", licenseRoutes);
app.use("/api/matlab", matlabRoutes);
app.use("/api/msc/predictions", xgboostRoutes);
app.use("/api/matlab-prediction", matlabPredictionRoutes);app.get("/", (req, res) => {
  res.send("API running");
});

const PORT =
  process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  );
});
