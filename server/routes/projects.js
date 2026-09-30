const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const Project = require("../models/Project");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Cloudinary -------------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* -------------------- Upload Setup -------------------- */

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
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
        folder: "tanush-portfolio/projects",
        resource_type: "image",
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

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ order: 1 })
      .lean();

    res.json(projects);
  } catch (error) {
    console.error(
      "Failed to fetch projects:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

/* -------------------- Admin Image Upload -------------------- */

router.post(
  "/upload-image",
  requireAdmin,
  (req, res, next) => {
    upload.single("image")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message:
              "Project image must be 5 MB or smaller",
          });
        }

        return res.status(400).json({
          message: "Invalid file upload",
        });
      }

      if (error) {
        return res.status(400).json({
          message:
            error.message ||
            "Invalid project image",
        });
      }

      next();
    });
  },

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Project image is required",
        });
      }

      const result = await uploadToCloudinary(req.file);

      res.status(201).json({
        message:
          "Project image uploaded successfully",
        image: result.secure_url,
      });
    } catch (error) {
      console.error(
        "Failed to upload project image:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to upload project image",
      });
    }
  }
);

/* -------------------- Admin Only -------------------- */

// Create project
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      liveDemoUrl,
      githubUrl,
      order,
      gridClass,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          "Title and description are required",
      });
    }

    const project = await Project.create({
      title: title.trim(),

      description: description.trim(),

      image:
        typeof image === "string"
          ? image.trim()
          : "",

      liveDemoUrl:
        typeof liveDemoUrl === "string"
          ? liveDemoUrl.trim()
          : "",

      githubUrl:
        typeof githubUrl === "string"
          ? githubUrl.trim()
          : "",

      order: Number.isFinite(Number(order))
        ? Number(order)
        : 0,

      gridClass:
        typeof gridClass === "string"
          ? gridClass.trim()
          : "md:col-span-6 h-[420px]",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(
      "Failed to create project:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create project",
    });
  }
});

/* -------------------- Update -------------------- */

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const {
      title,
      description,
      image,
      liveDemoUrl,
      githubUrl,
      order,
      gridClass,
    } = req.body;

    const updates = {};

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        return res.status(400).json({
          message: "Invalid title",
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        return res.status(400).json({
          message: "Invalid description",
        });
      }

      updates.description = description.trim();
    }

    if (image !== undefined) {
      updates.image =
        typeof image === "string"
          ? image.trim()
          : "";
    }

    if (liveDemoUrl !== undefined) {
      updates.liveDemoUrl =
        typeof liveDemoUrl === "string"
          ? liveDemoUrl.trim()
          : "";
    }

    if (githubUrl !== undefined) {
      updates.githubUrl =
        typeof githubUrl === "string"
          ? githubUrl.trim()
          : "";
    }

    if (order !== undefined) {
      const numericOrder = Number(order);

      if (!Number.isFinite(numericOrder)) {
        return res.status(400).json({
          message: "Invalid order",
        });
      }

      updates.order = numericOrder;
    }

    if (gridClass !== undefined) {
      if (typeof gridClass !== "string") {
        return res.status(400).json({
          message: "Invalid grid class",
        });
      }

      updates.gridClass = gridClass.trim();
    }

    const project =
      await Project.findByIdAndUpdate(
        id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    console.error(
      "Failed to update project:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update project",
    });
  }
});

/* -------------------- Delete -------------------- */

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project =
      await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "Failed to delete project:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete project",
    });
  }
});

module.exports = router;