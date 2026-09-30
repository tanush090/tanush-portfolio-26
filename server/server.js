const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const Project = require("./models/Project");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const careerRoutes = require("./routes/career");
const certificationRoutes = require("./routes/certifications");
const resumeRoutes = require("./routes/resume");
const contactRoutes = require("./routes/contact");
const messageRoutes = require("./routes/messages");
const aboutRoutes = require("./routes/about");

const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  console.error("FRONTEND_URL is not configured.");
  process.exit(1);
}

const app = express();

/* -------------------- Proxy -------------------- */

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

/* -------------------- Security -------------------- */

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

/* -------------------- Routes -------------------- */

app.get("/", (req, res) => {
  res.json({
    message: "Portfolio backend is running",
  });
});

/* -------------------- Static Resume Files -------------------- */

app.use(
  "/uploads/resume",
  express.static(
    require("path").join(__dirname, "uploads", "resume"),
    {
      index: false,
      dotfiles: "deny",
    }
  )
);

/* -------------------- Static Certification Images -------------------- */

app.use(
  "/uploads/certifications",
  express.static(
    require("path").join(__dirname, "uploads", "certifications"),
    {
      index: false,
      dotfiles: "deny",
    }
  )
);

/* -------------------- Static Projects Images -------------------- */

app.use(
  "/uploads/projects",
  express.static(
    require("path").join(
      __dirname,
      "uploads",
      "projects"
    ),
    {
      index: false,
      dotfiles: "deny",
    }
  )
);

/* -------------------- Authentication -------------------- */

app.use("/api/auth", authRoutes);

/* -------------------- Projects -------------------- */

app.use("/api/projects", projectRoutes);

/* -------------------- Skills -------------------- */

app.use("/api/skills", skillRoutes);

/* -------------------- Career -------------------- */

app.use("/api/career", careerRoutes);

/* -------------------- Certifications -------------------- */

app.use("/api/certifications", certificationRoutes);

/* -------------------- Resume -------------------- */

app.use("/api/resume", resumeRoutes);

/* -------------------- Contact -------------------- */

app.use("/api/contact", contactRoutes);

/* -------------------- Admin Messages -------------------- */

app.use("/api/messages", messageRoutes);

/* -------------------- About -------------------- */

app.use("/api/about", aboutRoutes);

/* -------------------- 404 Handler -------------------- */

app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

/* -------------------- Global Error Handler -------------------- */

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message:
      err.status && err.status < 500
        ? err.message
        : "Internal server error",
  });
});


/* -------------------- Database -------------------- */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });