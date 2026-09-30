const mongoose = require("mongoose");
require("dotenv").config();

const Certification = require("./models/Certification");

const certifications = [
  {
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte",
    date: "September 18, 2026",
    description:
      "Certificate of Completion for practical tasks in data analysis and forensic technology, issued through Forage.",
    image: "/certificates/deloitte-certificate.jpg",
    verificationLink: "",
    order: 1,
  },
  {
    title: "Smart India Hackathon 2026",
    issuer: "NITRA Technical Campus, Ghaziabad",
    date: "September 14, 2026",
    description:
      "Certificate of Participation for being shortlisted in the Internal Hackathon Round for Smart India Hackathon 2026 as part of Team Vision World.",
    image: "/certificates/sih-certificate.jpg",
    verificationLink: "",
    order: 2,
  },
  {
    title:
      "Programming for Everybody (Getting Started with Python)",
    issuer: "University of Michigan · Coursera",
    date: "February 24, 2026",
    description:
      "Successfully completed the online course authorized by the University of Michigan and offered through Coursera.",
    image: "/certificates/python-certificate.jpg",
    verificationLink:
      "https://coursera.org/verify/UEAV0I0K71QK",
    order: 3,
  },
  {
    title: "Fullstack MERN Live Class",
    issuer: "Underrated Coder",
    date: "March 2025 – May 2025",
    description:
      "Certificate of Completion for Batch 6 of the Fullstack MERN Live Class.",
    image: "/certificates/mern-certificate.jpg",
    verificationLink: "",
    order: 4,
  },
];

async function migrateCertifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    for (const certification of certifications) {
      await Certification.findOneAndUpdate(
        {
          title: certification.title,
        },
        certification,
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log(
      "Certification migration completed successfully."
    );

    const results = await Certification.find()
      .sort({ order: 1 })
      .lean();

    console.log("\nCurrent Certifications:");

    results.forEach((item) => {
      console.log(
        `${item.order}. ${item.title}`
      );
    });
  } catch (error) {
    console.error(
      "Certification migration failed:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

migrateCertifications();