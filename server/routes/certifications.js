const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const Certification = require("../models/Certification");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Cloudinary -------------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* -------------------- Multer Security -------------------- */

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
        folder: "tanush-portfolio/certifications",
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

// Get all certifications
router.get("/", async (req, res) => {
  try {
    const certifications = await Certification.find()
      .sort({ order: 1 })
      .lean();

    res.json(certifications);
  } catch (error) {
    console.error(
      "Failed to fetch certifications:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch certifications",
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
              "Certificate image must be 5 MB or smaller",
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
            "Invalid certificate image",
        });
      }

      next();
    });
  },

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Certificate image is required",
        });
      }

      const result = await uploadToCloudinary(req.file);

      res.status(201).json({
        message:
          "Certificate image uploaded successfully",
        image: result.secure_url,
      });
    } catch (error) {
      console.error(
        "Failed to upload certification image:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to upload certification image",
      });
    }
  }
);

/* -------------------- Admin Only -------------------- */

// Create certification
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      issuer,
      date,
      description,
      image,
      verificationLink,
      order,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof issuer !== "string" ||
      !issuer.trim() ||
      typeof date !== "string" ||
      !date.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message:
          "Title, issuer, date and description are required",
      });
    }

    const certification = await Certification.create({
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      description: description.trim(),

      image:
        typeof image === "string"
          ? image.trim()
          : "",

      verificationLink:
        typeof verificationLink === "string"
          ? verificationLink.trim()
          : "",

      order: Number.isFinite(Number(order))
        ? Number(order)
        : 0,
    });

    res.status(201).json(certification);
  } catch (error) {
    console.error(
      "Failed to create certification:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create certification",
    });
  }
});

/* -------------------- Update -------------------- */

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid certification ID",
      });
    }

    const {
      title,
      issuer,
      date,
      description,
      image,
      verificationLink,
      order,
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

    if (issuer !== undefined) {
      if (
        typeof issuer !== "string" ||
        !issuer.trim()
      ) {
        return res.status(400).json({
          message: "Invalid issuer",
        });
      }

      updates.issuer = issuer.trim();
    }

    if (date !== undefined) {
      if (
        typeof date !== "string" ||
        !date.trim()
      ) {
        return res.status(400).json({
          message: "Invalid date",
        });
      }

      updates.date = date.trim();
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

    if (verificationLink !== undefined) {
      updates.verificationLink =
        typeof verificationLink === "string"
          ? verificationLink.trim()
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

    const certification =
      await Certification.findByIdAndUpdate(
        id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!certification) {
      return res.status(404).json({
        message: "Certification not found",
      });
    }

    res.json(certification);
  } catch (error) {
    console.error(
      "Failed to update certification:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update certification",
    });
  }
});

/* -------------------- Delete -------------------- */

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid certification ID",
      });
    }

    const certification =
      await Certification.findByIdAndDelete(id);

    if (!certification) {
      return res.status(404).json({
        message: "Certification not found",
      });
    }

    res.json({
      message: "Certification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Failed to delete certification:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete certification",
    });
  }
});

module.exports = router;