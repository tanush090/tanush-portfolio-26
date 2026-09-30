const express = require("express");
const mongoose = require("mongoose");

const Skill = require("../models/Skill");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Public -------------------- */

// Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find()
      .sort({ order: 1 })
      .lean();

    res.json(skills);
  } catch (error) {
    console.error("Failed to fetch skills:", error.message);

    res.status(500).json({
      message: "Failed to fetch skills",
    });
  }
});

/* -------------------- Admin Only -------------------- */

// Create skill
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      icon,
      category,
      progress,
      order,
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Skill name is required",
      });
    }

    if (
      category !== undefined &&
      !["Core", "Working", "Learning"].includes(category)
    ) {
      return res.status(400).json({
        message: "Invalid skill category",
      });
    }

    const numericProgress =
      progress === undefined || progress === ""
        ? 50
        : Number(progress);

    if (
      !Number.isFinite(numericProgress) ||
      numericProgress < 0 ||
      numericProgress > 100
    ) {
      return res.status(400).json({
        message: "Progress must be a number between 0 and 100",
      });
    }

    const numericOrder =
      order === undefined || order === ""
        ? 0
        : Number(order);

    if (!Number.isFinite(numericOrder)) {
      return res.status(400).json({
        message: "Invalid order",
      });
    }

    const skill = await Skill.create({
      name: name.trim(),
      icon: typeof icon === "string" ? icon.trim() : "",
      category: category || "Working",
      progress: numericProgress,
      order: numericOrder,
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error("Failed to create skill:", error.message);

    res.status(500).json({
      message: "Failed to create skill",
    });
  }
});

/* -------------------- Update -------------------- */

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const {
      name,
      icon,
      category,
      progress,
      order,
    } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Invalid skill name",
        });
      }

      updates.name = name.trim();
    }

    if (icon !== undefined) {
      updates.icon =
        typeof icon === "string"
          ? icon.trim()
          : "";
    }

    if (category !== undefined) {
      if (
        !["Core", "Working", "Learning"].includes(category)
      ) {
        return res.status(400).json({
          message: "Invalid skill category",
        });
      }

      updates.category = category;
    }

    if (progress !== undefined) {
      const numericProgress = Number(progress);

      if (
        !Number.isFinite(numericProgress) ||
        numericProgress < 0 ||
        numericProgress > 100
      ) {
        return res.status(400).json({
          message:
            "Progress must be a number between 0 and 100",
        });
      }

      updates.progress = numericProgress;
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

    const skill = await Skill.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json(skill);
  } catch (error) {
    console.error("Failed to update skill:", error.message);

    res.status(500).json({
      message: "Failed to update skill",
    });
  }
});

/* -------------------- Delete -------------------- */

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete skill:", error.message);

    res.status(500).json({
      message: "Failed to delete skill",
    });
  }
});

module.exports = router;