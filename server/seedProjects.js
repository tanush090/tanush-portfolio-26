require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("./models/Project");

const projects = [
  {
    title: "Smart Fabric Pilling Detection",
    description:
      "Computer vision project for classifying fabric pilling grades using Python and TensorFlow/Keras.",
    image:
      "https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=1200",
    liveDemoUrl: "",
    githubUrl: "",
    order: 1,
    gridClass: "md:col-span-7 h-[420px]",
  },
  {
    title: "Project Drishti",
    description:
      "Predictive project monitoring platform concept focused on progress tracking, risk identification, and corrective actions.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    liveDemoUrl: "",
    githubUrl: "",
    order: 2,
    gridClass: "md:col-span-5 h-[420px]",
  },
  {
    title: "Personal Portfolio Website",
    description:
      "Interactive developer portfolio showcasing projects, education, technical skills, and professional journey.",
    image:
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
    liveDemoUrl: "",
    githubUrl: "",
    order: 3,
    gridClass: "md:col-span-12 h-[360px]",
  },
];

async function seedProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Remove the temporary/test projects
    await Project.deleteMany({});

    // Insert the real projects
    await Project.insertMany(projects);

    console.log("Projects migrated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Project migration failed:", error);
    process.exit(1);
  }
}

seedProjects();