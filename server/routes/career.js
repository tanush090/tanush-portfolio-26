const express = require("express");
const mongoose = require("mongoose");

const Career = require("../models/Career");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Public -------------------- */

// Get all career entries
router.get("/", async (req, res) => {
  try {
    const career = await Career.find()
      .sort({ order: 1 })
      .lean();

    res.json(career);
  } catch (error) {
    console.error("Failed to fetch career:", error.message);

    res.status(500).json({
      message: "Failed to fetch career entries",
    });
  }
});

/* -------------------- Admin Only -------------------- */

// Create career entry
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      year,
      title,
      subtitle,
      description,
      icon,
      order,
    } = req.body;

    if (
      typeof year !== "string" ||
      !year.trim() ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Year, title and description are required",
      });
    }

    const validIcons = [
      "globe",
      "briefcase",
      "award",
      "users",
    ];

    if (
      icon !== undefined &&
      !validIcons.includes(icon)
    ) {
      return res.status(400).json({
        message: "Invalid career icon",
      });
    }

    const career = await Career.create({
      year: year.trim(),
      title: title.trim(),
      subtitle:
        typeof subtitle === "string"
          ? subtitle.trim()
          : "",
      description: description.trim(),
      icon: icon || "briefcase",
      order: Number.isFinite(Number(order))
        ? Number(order)
        : 0,
    });

    res.status(201).json(career);
  } catch (error) {
    console.error("Failed to create career entry:", error.message);

    res.status(500).json({
      message: "Failed to create career entry",
    });
  }
});

/* -------------------- Update -------------------- */

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid career ID",
      });
    }

    const {
      year,
      title,
      subtitle,
      description,
      icon,
      order,
    } = req.body;

    const updates = {};

    if (year !== undefined) {
      if (typeof year !== "string" || !year.trim()) {
        return res.status(400).json({
          message: "Invalid year",
        });
      }

      updates.year = year.trim();
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Invalid title",
        });
      }

      updates.title = title.trim();
    }

    if (subtitle !== undefined) {
      updates.subtitle =
        typeof subtitle === "string"
          ? subtitle.trim()
          : "";
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

    if (icon !== undefined) {
      const validIcons = [
        "globe",
        "briefcase",
        "award",
        "users",
      ];

      if (!validIcons.includes(icon)) {
        return res.status(400).json({
          message: "Invalid career icon",
        });
      }

      updates.icon = icon;
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

    const career = await Career.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!career) {
      return res.status(404).json({
        message: "Career entry not found",
      });
    }

    res.json(career);
  } catch (error) {
    console.error("Failed to update career entry:", error.message);

    res.status(500).json({
      message: "Failed to update career entry",
    });
  }
});

/* -------------------- Delete -------------------- */

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid career ID",
      });
    }

    const career = await Career.findByIdAndDelete(id);

    if (!career) {
      return res.status(404).json({
        message: "Career entry not found",
      });
    }

    res.json({
      message: "Career entry deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete career entry:", error.message);

    res.status(500).json({
      message: "Failed to delete career entry",
    });
  }
});

module.exports = router;