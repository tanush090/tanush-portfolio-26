const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const Resume = require("../models/Resume");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Upload Directory -------------------- */

const uploadDir = path.join(__dirname, "..", "uploads", "resume");

fs.mkdirSync(uploadDir, {
  recursive: true,
});

/* -------------------- Multer Security -------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const safeName = `resume-${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}.pdf`;

    cb(null, safeName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (
      extension !== ".pdf" ||
      file.mimetype !== "application/pdf"
    ) {
      return cb(
        new Error("Only PDF files are allowed")
      );
    }

    cb(null, true);
  },
});

/* -------------------- Public -------------------- */

/* -------------------- Download Active Resume -------------------- */

router.get("/download", async (req, res) => {
  try {
    const resume = await Resume.findOne({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!resume) {
      return res.status(404).json({
        message: "No active resume found",
      });
    }

    res.download(
      resume.filepath,
      "Tanush_Kumar_Resume.pdf",
      (error) => {
        if (error) {
          console.error(
            "Failed to download resume:",
            error.message
          );

          if (!res.headersSent) {
            res.status(500).json({
              message: "Failed to download resume",
            });
          }
        }
      }
    );
  } catch (error) {
    console.error(
      "Failed to download resume:",
      error.message
    );

    res.status(500).json({
      message: "Failed to download resume",
    });
  }
});
// Get active resume

router.get("/", async (req, res) => {
  try {
    const resume = await Resume.findOne({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!resume) {
      return res.status(404).json({
        message: "No active resume found",
      });
    }

    res.json({
      filename: resume.originalName,
      url: `/uploads/resume/${resume.filename}`,
      updatedAt: resume.updatedAt,
    });
  } catch (error) {
    console.error(
      "Failed to fetch resume:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
});

/* -------------------- Admin Upload -------------------- */

router.post(
  "/upload",
  requireAdmin,
  (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Resume must be 5 MB or smaller",
          });
        }

        return res.status(400).json({
          message: "Invalid file upload",
        });
      }

      if (error) {
        return res.status(400).json({
          message: error.message || "Invalid file",
        });
      }

      next();
    });
  },

  async (req, res) => {
    let uploadedFilePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Resume PDF is required",
        });
      }

      uploadedFilePath = req.file.path;

      /* Deactivate previous resume */

      await Resume.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );

      /* Save new resume */

      const resume = await Resume.create({
        filename: req.file.filename,
        filepath: req.file.path,
        originalName: req.file.originalname,
        isActive: true,
      });

      uploadedFilePath = null;

      res.status(201).json({
        message: "Resume uploaded successfully",
        resume: {
          filename: resume.originalName,
          url: `/uploads/resume/${resume.filename}`,
          updatedAt: resume.updatedAt,
        },
      });
    } catch (error) {
      console.error(
        "Failed to upload resume:",
        error.message
      );

      /* Remove uploaded file if database operation failed */

      if (uploadedFilePath) {
        try {
          await fs.promises.unlink(uploadedFilePath);
        } catch {
          // Ignore cleanup failure
        }
      }

      res.status(500).json({
        message: "Failed to upload resume",
      });
    }
  }
);

module.exports = router;