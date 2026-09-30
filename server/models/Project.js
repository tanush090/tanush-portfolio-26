const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    liveDemoUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },
    gridClass: {
  type: String,
  default: "md:col-span-6 h-[420px]",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);