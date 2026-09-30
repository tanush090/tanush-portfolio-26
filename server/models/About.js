const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    graduationYear: {
      type: String,
      default: "2028",
      trim: true,
      maxlength: 20,
    },

    coreProjects: {
      type: String,
      default: "3+",
      trim: true,
      maxlength: 20,
    },

    technicalSkills: {
      type: String,
      default: "10+",
      trim: true,
      maxlength: 20,
    },

    developmentFocus: {
      type: String,
      default: "AI + Web",
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", aboutSchema);