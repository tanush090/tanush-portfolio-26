import SkillCategory from "./SkillCategory";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  Sparkles,
} from "lucide-react";
import { MagicCard } from "../lightswind/magic-card";

export const EducationSection = () => {
  const education = [
    {
      degree: "B.Tech in Computer Science & Engineering (AI/ML)",
      school: "NITRA Technical Campus, Ghaziabad",
      university: "Dr. A.P.J. Abdul Kalam Technical University",
      year: "2024 – 2028",
      badge: "Smart India Hackathon 2026",
      badgeIcon: Award,
      badgeColor:
        "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      icon: GraduationCap,
      details: [
        "Pursuing a Bachelor's degree in Computer Science & Engineering with a focus on Artificial Intelligence and Machine Learning",
        "Building foundations in programming, data structures, databases, web development, and machine learning",
        "Working on practical projects involving AI/ML, computer vision, data collection, and software development",
        "Participated in the Smart India Hackathon 2026 Internal Hackathon Round at NITRA Technical Campus, Ghaziabad",
      ],
    },
    {
      degree: "Class XII — Science",
      school: "Saraswati Vidya Mandir Inter College, Orai, Jalaun",
      year: "2023",
      badge: "93.8%",
      badgeIcon: Sparkles,
      badgeColor: "text-primary bg-primary/10 border-primary/30",
      icon: BookOpen,
      details: [
        "Completed Class XII with 93.8%",
        "Developed a strong foundation in science and mathematics",
        "Built an early interest in computer science and technology",
        "Completed senior secondary education in 2023",
      ],
    },
    {
      degree: "Class X",
      school: "Saraswati Vidya Mandir Inter College, Orai, Jalaun",
      year: "2021",
      badge: "93.16%",
      badgeIcon: Award,
      badgeColor:
        "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      icon: GraduationCap,
      details: [
        "Completed Class X with 93.16%",
        "Built a strong academic foundation across core subjects",
        "Completed secondary education in 2021",
      ],
    },
  ];

  return (
    <section
      id="education"
      className="max-w-7xl mx-auto px-6 py-24 space-y-20"
    >
      {/* Education Header & Cards */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Academic{" "}
              <span className="text-gradient-primary">Background</span>
            </h2>
          </div>

          <p className="text-muted-foreground text-lg max-w-2xl">
            My academic journey in computer science, artificial intelligence,
            and machine learning, supported by continuous learning and
            practical projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((edu, i) => {
            const DegreeIcon = edu.icon;
            const BadgeIcon = edu.badgeIcon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <MagicCard
                  className="h-full p-8 rounded-[2.25rem] border border-border/80 bg-card/80 shadow-xl"
                  gradientSize={300}
                  gradientColor="rgba(136, 152, 134, 0.12)"
                  gradientFrom="#8b5cf6"
                  gradientTo="#38bdf8"
                >
                  <div className="flex flex-col h-full justify-between gap-6">
                    <div>
                      {/* Header with Icon and Distinction Badge */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shadow-sm">
                          <DegreeIcon className="w-7 h-7 text-primary" />
                        </div>

                        <span
                          className={`px-3.5 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 shadow-sm ${edu.badgeColor}`}
                        >
                          <BadgeIcon className="w-3.5 h-3.5" />
                          {edu.badge}
                        </span>
                      </div>

                      {/* Degree Title & Institution Meta */}
                      <h3 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                        {edu.degree}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground mb-6 pb-4 border-b border-border/60">
                        <span className="flex items-center gap-1.5 text-foreground font-bold">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                          {edu.school}
                        </span>

                        {edu.university && (
                          <>
                            <span>•</span>
                            <span className="text-muted-foreground">
                              {edu.university}
                            </span>
                          </>
                        )}

                        <span>•</span>

                        <span className="flex items-center gap-1.5 font-mono text-primary font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          {edu.year}
                        </span>
                      </div>

                      {/* Key Highlights List */}
                      <ul className="space-y-3.5">
                        {edu.details.map((detail, j) => (
                          <li
                            key={j}
                            className="text-sm text-muted-foreground flex items-start gap-3 leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />

                            <span className="text-foreground/90 font-medium">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </MagicCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Expertise & Skills Component */}
      <div>
        <SkillCategory />
      </div>
    </section>
  );
};