import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ArrowUp,
  Heart,
} from "lucide-react";
import { MorphingText } from "../lightswind/morphing-text";

export const Footer = () => {
  const morphingTexts = [
    "AI/ML Developer",
    "Web Developer",
    "Computer Vision",
    "Problem Solver",
    "Tanush Kumar",
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/tanush090",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/tanush0900/",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/tanush_kaurav/",
      label: "Instagram",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter / X",
    },
    {
      icon: Mail,
      href: "mailto:TANUSHKAURAVJI@GMAIL.COM",
      label: "Email",
    },
  ];

  return (
    <footer className="w-full relative z-10 pt-16 pb-28 md:pb-36 bg-card/60 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 shadow-2xl rounded-t-[3rem] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col gap-10">

        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-primary to-sky-400 p-[1px] shadow-lg">
              <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-xs tracking-tighter bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-transparent">
                  TK
                </span>
              </div>
            </div>

            <div className="flex flex-col text-left">
              <span className="font-extrabold tracking-tight text-foreground text-base leading-none">
                Tanush Kumar
              </span>

              <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-0.5">
                B.Tech CSE (AI/ML)
              </span>
            </div>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-black/5 dark:border-white/10 text-xs font-bold text-foreground hover:text-primary hover:border-primary/40 transition-all shadow-sm cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Center Banner */}
        <div className="py-12 px-6 rounded-3xl bg-black/[0.015] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 text-center flex flex-col items-center justify-center my-2 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-sm">
            Learn • Build • Create
          </span>

          <MorphingText
            texts={morphingTexts}
            morphTime={1.6}
            cooldownTime={0.8}
            className="text-3xl md:text-5xl lg:text-6xl text-foreground font-extrabold min-h-[70px] text-center"
          />
        </div>



        {/* Bottom Row */}
        <div className="pt-6 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, i) => {
              const Icon = social.icon;

              return (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  target={social.href !== "#" ? "_blank" : undefined}
                  rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full glass-panel border border-black/5 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:scale-110 transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
        <div className="flex items-center justify-center gap-2 font-serif italic text-sm text-muted-foreground text-center">
  <span>
    © {new Date().getFullYear()} Tanush Kumar. Built with curiosity
  </span>

  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />

  <span>
    &amp; code.
  </span>
</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;