const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const Admin = require("../models/Admin");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

 if (
  typeof username !== "string" ||
  typeof password !== "string" ||
  !username.trim() ||
  !password ||
  username.trim().length > 100 ||
  password.length > 200
) {
  return res.status(400).json({
    message: "Invalid username or password",
  });
}

    const admin = await Admin.findOne({
      username: username.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!admin) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not configured.");
  return res.status(500).json({
    message: "Server authentication is not configured",
  });
}

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

module.exports = router;