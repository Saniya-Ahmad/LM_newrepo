import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/mysql.js";

const router = express.Router();

// Helper function to log authentication events
const logAuth = async ({
  username = null,
  email = null,
  role = null,
  action,
  status,
  message,
  ip,
  userAgent,
}) => {
  try {
    await pool.query(
      `
      INSERT INTO auth_logs
      (username,email,role,action,status,message,ip_address,user_agent)
      VALUES (?,?,?,?,?,?,?,?)
      `,
      [
        username,
        email,
        role,
        action,
        status,
        message,
        ip,
        userAgent,
      ]
    );
  } catch (err) {
    console.error("Failed to write auth log:", err);
  }
};

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      await logAuth({
        username: name,
        email,
        role: "USER",
        action: "REGISTER",
        status: "FAILED",
        message: "User already exists",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `
      INSERT INTO users
      (name,email,password,role)
      VALUES (?,?,?,?)
      `,
      [
        name,
        email,
        hashedPassword,
        "user",
      ]
    );

    await logAuth({
      username: name,
      email,
      role: "USER",
      action: "REGISTER",
      status: "SUCCESS",
      message: "Account created",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      message: "User created",
      userId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      await logAuth({
        email,
        role: null,
        action: "LOGIN",
        status: "FAILED",
        message: "User not found",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      await logAuth({
        username: user.name,
        email: user.email,
        role: user.role.toUpperCase(),
        action: "LOGIN",
        status: "FAILED",
        message: "Invalid password",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await logAuth({
      username: user.name,
      email: user.email,
      role: user.role.toUpperCase(),
      action: "LOGIN",
      status: "SUCCESS",
      message: "Login successful",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;