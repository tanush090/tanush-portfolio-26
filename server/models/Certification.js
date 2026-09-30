const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    issuer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    date: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    image: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    verificationLink: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Certification",
  certificationSchema
);