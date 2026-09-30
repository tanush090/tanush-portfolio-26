import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Goal,
  Rocket,
  Sparkles,
} from "lucide-react";

const objectives = [
  {
    number: "01",
    title: "Start Strong",
    label: "SHORT TERM",
    icon: BriefcaseBusiness,
    text: "Secure an internship where I can work on real-world software, web development, or AI/ML projects and gain practical industry experience.",
    keyword: "EXPERIENCE",
  },
  {
    number: "02",
    title: "Keep Building",
    label: "PROFESSIONAL GROWTH",
    icon: Goal,
    text: "Strengthen my programming, machine learning, data, and problem-solving skills through hands-on projects and continuous learning.",
    keyword: "EVOLUTION",
  },
  {
    number: "03",
    title: "Go Further",
    label: "LONG TERM",
    icon: Rocket,
    text: "Grow into a well-rounded technology professional capable of building useful, reliable, and practical solutions.",
    keyword: "IMPACT",
  },
];

const TestimonialsSection = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section
      id="testimonials"
      className="relative max-w-7xl mx-auto px-6 py-28 overflow-hidden"
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[15%] top-[25%] w-72 h-72 bg-primary/[0.06] rounded-full blur-[120px]" />
        <div className="absolute right-[10%] bottom-[15%] w-80 h-80 bg-primary/[0.04] rounded-full blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-primary/20 blur-md" />
              <Sparkles className="relative w-4 h-4 text-primary" />
            </div>

            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
              Career Direction
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_0.8fr] gap-10 items-end">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] leading-[0.9]">
                Where I'm
                <br />
                <span className="text-gradient-primary">
                  heading.
                </span>
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="text-muted-foreground leading-7 max-w-lg">
                My goal is to turn what I learn into practical
                experience — building, experimenting, and
                growing through real-world technology work.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Career path */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[55px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Moving line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
            className="hidden md:block absolute top-[55px] left-[10%] right-[10%] h-px origin-left bg-gradient-to-r from-primary/20 via-primary to-primary/20"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {objectives.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeCard === index;

              return (
                <motion.div
                  key={item.number}
                  initial={{
                    opacity: 0,
                    y: 60,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.15,
                  }}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                  className="group relative"
                >
                  {/* Number node */}
                  <div className="relative z-20 mb-8 flex items-center justify-between">
                    <motion.div
                      animate={
                        isActive
                          ? {
                              scale: 1.12,
                            }
                          : {
                              scale: 1,
                            }
                      }
                      className="relative w-14 h-14 rounded-full border border-foreground/10 bg-background flex items-center justify-center"
                    >
                      <div
                        className={`absolute inset-1 rounded-full border transition-all duration-500 ${
                          isActive
                            ? "border-primary/50"
                            : "border-transparent"
                        }`}
                      />

                      <span className="relative text-xs font-mono font-medium">
                        {item.number}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="career-dot"
                          className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.7)]"
                        />
                      )}
                    </motion.div>

                    <span className="hidden sm:block text-[10px] font-mono tracking-[0.2em] text-muted-foreground">
                      {item.keyword}
                    </span>
                  </div>

                  {/* Card */}
                  <motion.div
                    animate={{
                      y: isActive ? -10 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 20,
                    }}
                    className="relative min-h-[390px] rounded-[2rem] overflow-hidden"
                  >
                    {/* Animated border */}
                    <div
                      className={`absolute inset-0 rounded-[2rem] transition-opacity duration-500 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(var(--primary) / 0.7), transparent 40%, hsl(var(--primary) / 0.15))",
                      }}
                    />

                    {/* Inner card */}
                    <div
                      className={`absolute inset-[1px] rounded-[2rem] border bg-background/80 backdrop-blur-xl transition-all duration-500 ${
                        isActive
                          ? "border-primary/30"
                          : "border-foreground/10"
                      }`}
                    />

                    {/* Cursor glow */}
                    <div
                      className={`absolute -right-20 -top-20 w-56 h-56 rounded-full bg-primary/10 blur-[70px] transition-opacity duration-500 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />

                    <div className="relative z-10 p-7 md:p-8 h-full flex flex-col">
                      {/* Icon */}
                      <div className="flex items-start justify-between">
                        <motion.div
                          animate={
                            isActive
                              ? {
                                  rotate: -6,
                                  scale: 1.08,
                                }
                              : {
                                  rotate: 0,
                                  scale: 1,
                                }
                          }
                          transition={{
                            type: "spring",
                            stiffness: 250,
                          }}
                          className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors duration-500 ${
                            isActive
                              ? "border-primary/30 bg-primary/10"
                              : "border-foreground/10 bg-foreground/[0.03]"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 transition-colors duration-500 ${
                              isActive
                                ? "text-primary"
                                : "text-foreground"
                            }`}
                          />
                        </motion.div>

                        <motion.div
                          animate={
                            isActive
                              ? {
                                  x: 2,
                                  y: -2,
                                }
                              : {
                                  x: 0,
                                  y: 0,
                                }
                          }
                        >
                          <ArrowUpRight
                            className={`w-5 h-5 transition-colors duration-500 ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground/40"
                            }`}
                          />
                        </motion.div>
                      </div>

                      {/* Label */}
                      <div className="mt-10">
                        <p
                          className={`text-[10px] font-semibold tracking-[0.25em] transition-colors duration-500 ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.label}
                        </p>

                        <h3 className="text-2xl md:text-3xl font-bold mt-3 tracking-tight">
                          {item.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="mt-6 text-sm text-muted-foreground leading-7">
                        {item.text}
                      </p>

                      {/* Bottom */}
                      <div className="mt-auto pt-8">
                        <div className="h-px bg-foreground/10 mb-5" />

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                            Career objective
                          </span>

                          <motion.div
                            animate={
                              isActive
                                ? {
                                    width: 42,
                                  }
                                : {
                                    width: 18,
                                  }
                            }
                            className="h-px bg-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="mt-10 relative overflow-hidden rounded-[2rem] border border-primary/15 bg-primary/[0.025]"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          <div className="px-7 py-6 md:px-9 md:py-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-2">
                Right now
              </p>

              <p className="text-sm md:text-base text-muted-foreground">
                Looking for opportunities to learn,
                contribute, and gain real-world experience.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-40 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>

              <span className="text-sm font-medium">
                Open to Internships
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;