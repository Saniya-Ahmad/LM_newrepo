import express from "express";
import { pool } from "../config/mysql.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/submit",
  protect,
  async (req, res) => {
    const {
      license,
      product,
      network,
      mac,
      ip,
      screenshot,
    } = req.body;

    try {
      await pool.query(
        `
       INSERT INTO license_logs
  (
    user_id,
    license_type,
    product,
    network_type,
    mac_address,
    ip_address,
    screenshot_path
  )
  VALUES (?,?,?,?,?,?,?)
  `,
  [
    req.user.id,
    license,
    product,
    network,
    mac,
    ip,
    screenshot,
        ]
      );

      res.json({
        message:
          "License request submitted",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.get(
  "/logs",
  protect,
  async (req, res) => {
    const [rows] = await pool.query(`
      SELECT *
      FROM license_logs
      ORDER BY timestamp DESC
    `);

    res.json(rows);
  }
);

export default router;