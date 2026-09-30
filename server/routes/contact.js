const express = require("express");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

/* -------------------- Anti-Spam -------------------- */

// IP-based protection
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many messages. Please try again later.",
  },
});

/* -------------------- Validation -------------------- */

const contactValidation = [
  body("name")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Invalid name"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage("Invalid email address"),

  body("message")
    .isString()
    .trim()
    .isLength({ min: 10, max: 3000 })
    .withMessage("Message must be between 10 and 3000 characters"),

  // Honeypot field
  body("website")
    .optional()
    .isString()
    .withMessage("Invalid request"),
];

/* -------------------- Submit Contact Message -------------------- */

router.post(
  "/",
  contactLimiter,
  contactValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Please check your submitted information.",
        });
      }

      const {
        name,
        email,
        message,
        website,
      } = req.body;

      /*
       * Honeypot:
       * Normal visitors never see/fill this field.
       * Bots often do.
       */
      if (website && website.trim() !== "") {
        return res.status(400).json({
          message: "Invalid request.",
        });
      }

      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanMessage = message.trim();

      /*
       * Prevent the same email from repeatedly
       * submitting the exact same message.
       */
      const duplicateMessage =
        await ContactMessage.findOne({
          email: cleanEmail,
          message: cleanMessage,
          createdAt: {
            $gte: new Date(
              Date.now() - 24 * 60 * 60 * 1000
            ),
          },
        }).lean();

      if (duplicateMessage) {
        return res.status(429).json({
          message:
            "A similar message was already submitted recently.",
        });
      }

      /*
       * Per-email cooldown.
       * One email can submit again after 30 minutes.
       */
      const recentMessage =
        await ContactMessage.findOne({
          email: cleanEmail,
          createdAt: {
            $gte: new Date(
              Date.now() - 30 * 60 * 1000
            ),
          },
        }).lean();

      if (recentMessage) {
        return res.status(429).json({
          message:
            "Please wait before sending another message.",
        });
      }

      const contactMessage =
        await ContactMessage.create({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
        });

      res.status(201).json({
        message:
          "Your message has been sent successfully.",
        id: contactMessage._id,
      });
    } catch (error) {
      console.error(
        "Contact submission failed:",
        error.message
      );

      res.status(500).json({
        message:
          "Unable to send your message right now.",
      });
    }
  }
);

module.exports = router;