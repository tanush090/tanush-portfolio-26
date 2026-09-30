import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Globe2, Layout, Users } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

type AboutStats = {
  graduationYear: string;
  coreProjects: string;
  technicalSkills: string;
  developmentFocus: string;
};

export const AboutSection = () => {
  const [stats, setStats] = useState<AboutStats>({
    graduationYear: "2028",
    coreProjects: "3+",
    technicalSkills: "10+",
    developmentFocus: "AI + Web",
  });

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const response = await fetch(`${API}/about`);

        if (!response.ok) {
          throw new Error("Failed to fetch About");
        }

        const data = await response.json();

        setStats({
          graduationYear: data.graduationYear,
          coreProjects: data.coreProjects,
          technicalSkills: data.technicalSkills,
          developmentFocus: data.developmentFocus,
        });
      } catch (error) {
        console.error(
          "Failed to load About:",
          error
        );
      }
    };

    loadAbout();
  }, []);

  const statCards = [
    {
      icon: <Layout className="w-6 h-6" />,
      label: "B.Tech CSE (AI/ML)",
      value: stats.graduationYear,
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      label: "Core Projects",
      value: stats.coreProjects,
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Technical Skills",
      value: stats.technicalSkills,
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      label: "Development Focus",
      value: stats.developmentFocus,
    },
  ];

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <motion.div
        className="flex flex-col md:flex-row gap-16 items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
      >
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Passionate about{" "}
              <span className="text-gradient-primary">
                Technology & Innovation
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I am Tanush Kumar, a B.Tech CSE (AI/ML)
              student graduating in 2028, with an
              interest in web development, artificial
              intelligence, machine learning, and
              computer vision. I enjoy building
              practical projects, working with data,
              and exploring technology to solve
              real-world problems.
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              className="glass-panel p-6 rounded-2xl border border-foreground/10 hover:border-primary/50 transition-colors group relative overflow-hidden"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
              }}
              viewport={{
                once: true,
              }}
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />

              <div className="text-primary mb-4 p-3 bg-primary/10 w-max rounded-xl">
                {stat.icon}
              </div>

              <h3 className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </h3>

              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};