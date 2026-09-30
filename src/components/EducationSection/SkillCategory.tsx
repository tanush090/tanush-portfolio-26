import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Atom,
  Server,
  Code2,
  Database,
  Cloud,
  Crown,
  Brain,
  Workflow,
  HeartHandshake,
  Lightbulb,
  Users,
  Rocket,
} from "lucide-react";

type TechnicalSkill = {
  _id: string;
  name: string;
  category: "Core" | "Working" | "Learning";
  progress: number;
  icon?: string;
};

const API = import.meta.env.VITE_API_URL;

export default function ProfessionalProfile() {
  const [technicalSkills, setTechnicalSkills] = useState<TechnicalSkill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${API}/skills`);

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const data = await response.json();

        const sortedSkills = [...data].sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

        setTechnicalSkills(sortedSkills);
      } catch (error) {
        console.error("Failed to load technical skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const getSkillIcon = (name: string) => {
    const normalizedName = name.toLowerCase();

    if (normalizedName.includes("python")) return Code2;
    if (normalizedName.includes("java")) return Code2;
    if (normalizedName.includes("javascript")) return Code2;
    if (normalizedName.includes("html")) return Atom;
    if (normalizedName.includes("react")) return Atom;
    if (normalizedName.includes("node")) return Server;
    if (normalizedName.includes("tensorflow")) return Brain;
    if (normalizedName.includes("sql")) return Database;
    if (normalizedName.includes("git")) return Cloud;

    return Code2;
  };

  const getSkillColor = (name: string) => {
    const normalizedName = name.toLowerCase();

    if (normalizedName.includes("java")) return "text-orange-400";
    if (normalizedName.includes("python")) return "text-blue-400";
    if (normalizedName.includes("javascript"))
      return "text-yellow-400";
    if (normalizedName.includes("html")) return "text-cyan-400";
    if (normalizedName.includes("node")) return "text-emerald-400";
    if (normalizedName.includes("react")) return "text-sky-400";
    if (normalizedName.includes("tensorflow"))
      return "text-purple-400";
    if (normalizedName.includes("sql")) return "text-amber-400";
    if (normalizedName.includes("git")) return "text-rose-400";

    return "text-primary";
  };

  const softSkills = [
    {
      name: "Problem Solving",
      icon: Brain,
      color:
        "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      name: "Teamwork",
      icon: Users,
      color:
        "text-sky-400 border-sky-500/30 bg-sky-500/10",
    },
    {
      name: "Leadership",
      icon: Crown,
      color:
        "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      name: "Research",
      icon: Lightbulb,
      color:
        "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    },
    {
      name: "Adaptability",
      icon: Workflow,
      color:
        "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      name: "Communication",
      icon: HeartHandshake,
      color:
        "text-rose-400 border-rose-500/30 bg-rose-500/10",
    },
  ];

  return (
    <motion.section
      id="skills"
      className="space-y-8"
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 },
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Code2 className="w-5 h-5" />
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Skills & Expertise
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technical Skills */}
        <div className="glass-panel p-8 rounded-[2rem] border border-foreground/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
            <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Technical Skills
            </h4>

            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
              Current Stack
            </span>
          </div>

          <div className="space-y-6">
            {technicalSkills.map((skill, i) => {
              const Icon = getSkillIcon(skill.name);
              const color = getSkillColor(skill.name);

              return (
                <div key={skill._id} className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-foreground flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>

                      {skill.name}
                    </span>

                    <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-xs border border-primary/20">
                      {skill.category}
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/40 p-[1px]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 via-primary to-sky-400 rounded-full relative shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${Math.min(
                          Math.max(skill.progress || 0, 0),
                          100
                        )}%`,
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeOut",
                        delay: 0.2 + i * 0.1,
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Professional Traits */}
        <div className="glass-panel p-8 rounded-[2rem] border border-foreground/15 shadow-xl flex flex-col">
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
              <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Professional Traits
              </h4>

              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                Core Strengths
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {softSkills.map((skill, i) => {
                  const Icon = skill.icon;

                  return (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: i * 0.08,
                      }}
                      viewport={{ once: true }}
                      className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold flex items-center gap-2 shadow-sm hover:scale-105 transition-transform cursor-default ${skill.color}`}
                    >
                      <Icon className="w-4 h-4" />

                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* What Drives Me */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-primary/5 to-transparent border border-primary/20 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-primary/20 text-primary shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5" />
                </div>

                <div>
                  <strong className="text-foreground font-bold text-sm block mb-1">
                    What Drives Me
                  </strong>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Turning ideas into practical solutions while
                    continuously learning, experimenting, and improving.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Always Learning & Building */}
          <div className="mt-6 pt-6 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent border border-primary/20 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-primary/20 text-primary shrink-0 mt-0.5">
                <Rocket className="w-5 h-5" />
              </div>

              <div>
                <strong className="text-foreground font-bold text-sm block mb-0.5">
                  Always Learning & Building
                </strong>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Building practical experience across web development,
                  AI/ML, computer vision, and data-driven projects while
                  continuously learning new technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}