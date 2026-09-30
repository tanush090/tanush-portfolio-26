const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const Certification = require("../models/Certification");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Upload Setup -------------------- */

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "certifications"
);

fs.mkdirSync(uploadDir, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const randomName =
      crypto.randomBytes(16).toString("hex") + extension;

    cb(null, randomName);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
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
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Certificate image is required",
        });
      }

      const imageUrl =
        `/uploads/certifications/${req.file.filename}`;

      res.status(201).json({
        message: "Certificate image uploaded successfully",
        image: imageUrl,
      });
    } catch (error) {
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }

      console.error(
        "Failed to upload certification image:",
        error.message
      );

      res.status(400).json({
        message:
          error.message ||
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