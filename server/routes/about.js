const express = require("express");

const About = require("../models/About");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let about = await About.findOne().lean();

    if (!about) {
      about = await About.create({
        graduationYear: "2028",
        coreProjects: "3+",
        technicalSkills: "10+",
        developmentFocus: "AI + Web",
      });
    }

    res.json(about);
  } catch (error) {
    console.error("Failed to fetch About:", error.message);

    res.status(500).json({
      message: "Failed to fetch About",
    });
  }
});

router.put("/", requireAdmin, async (req, res) => {
  try {
    const {
      graduationYear,
      coreProjects,
      technicalSkills,
      developmentFocus,
    } = req.body;

    const about = await About.findOneAndUpdate(
      {},
      {
        graduationYear,
        coreProjects,
        technicalSkills,
        developmentFocus,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    res.json(about);
  } catch (error) {
    console.error("Failed to update About:", error.message);

    res.status(500).json({
      message: "Failed to update About",
    });
  }
});

module.exports = router;