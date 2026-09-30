const express = require("express");
const mongoose = require("mongoose");

const ContactMessage = require("../models/ContactMessage");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

/* -------------------- Admin Only -------------------- */

// Get messages
router.get("/", requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error.message);

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
});

// Update message status
router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid message ID",
      });
    }

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({
        message: "Invalid message status",
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(message);
  } catch (error) {
    console.error(
      "Failed to update message:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update message",
    });
  }
});

// Delete message
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid message ID",
      });
    }

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error(
      "Failed to delete message:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete message",
    });
  }
});

module.exports = router;