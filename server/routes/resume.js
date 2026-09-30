const express = require("express");
const path = require("path");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const Resume = require("../models/Resume");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Cloudinary -------------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* -------------------- Multer Security -------------------- */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
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

/* -------------------- Cloudinary Upload Helper -------------------- */

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "tanush-portfolio/resumes",
        resource_type: "raw",
        public_id: `resume-${Date.now()}`,
        format: "pdf",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);
  });

/* -------------------- Public -------------------- */

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

    if (!resume.filepath) {
      return res.status(404).json({
        message: "Resume file is unavailable",
      });
    }

    return res.redirect(resume.filepath);
  } catch (error) {
    console.error(
      "Failed to download resume:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to download resume",
    });
  }
});

/* -------------------- Get Active Resume -------------------- */

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
      url: resume.filepath,
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
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Resume PDF is required",
        });
      }

      /* Upload to Cloudinary */

      const result = await uploadToCloudinary(req.file);

      /* Deactivate previous resume */

      await Resume.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );

      /* Save new resume */

      const resume = await Resume.create({
        filename: result.public_id,
        filepath: result.secure_url,
        originalName: req.file.originalname,
        isActive: true,
      });

      res.status(201).json({
        message: "Resume uploaded successfully",
        resume: {
          filename: resume.originalName,
          url: resume.filepath,
          updatedAt: resume.updatedAt,
        },
      });
    } catch (error) {
      console.error(
        "Failed to upload resume:",
        error.message
      );

      res.status(500).json({
        message: "Failed to upload resume",
      });
    }
  }
);

module.exports = router;