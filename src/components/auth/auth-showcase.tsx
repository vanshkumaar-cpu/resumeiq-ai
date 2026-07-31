"use client";

import { motion, type Variants } from "framer-motion";
import { FileText, Sparkles, Target, TrendingUp, CheckCircle2 } from "lucide-react";

const floatCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function AuthShowcase() {
  return (
    <div className="aurora-bg relative hidden h-full flex-col justify-between overflow-hidden bg-background p-12 lg:flex">
      <div className="bg-grid pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center gap-2.5"
      >
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Sparkles className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">ResumeIQ AI</span>
      </motion.div>

      <div className="relative z-10 max-w-lg">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl font-semibold tracking-tight text-balance"
        >
          Land Your Dream Job
          <br />
          <span className="text-gradient">with AI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground"
        >
          ResumeIQ AI analyzes your resume against any job description,
          scores your ATS readiness, and rewrites weak sections — so every
          application goes out at its strongest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col gap-3"
        >
          {[
            "Instant ATS &amp; match scoring".replace("&amp;", "&"),
            "AI-rewritten bullet points that pass keyword filters",
            "Tailored interview questions for every application",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-sm text-foreground/90">
              <CheckCircle2 className="size-4 shrink-0 text-brand-emerald" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating illustration cluster */}
      <div className="relative z-10 mt-10 h-72 w-full max-w-lg">
        <motion.div
          custom={0.4}
          variants={floatCard}
          initial="hidden"
          animate="show"
          className="glass-strong absolute left-0 top-4 w-56 rounded-2xl p-4 shadow-2xl"
          style={{ animation: "float-a 7s ease-in-out infinite" }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="size-3.5" />
            Resume.pdf
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-foreground/10" />
            <div className="h-1.5 w-4/5 rounded-full bg-foreground/10" />
            <div className="h-1.5 w-3/5 rounded-full bg-foreground/10" />
          </div>
        </motion.div>

        <motion.div
          custom={0.6}
          variants={floatCard}
          initial="hidden"
          animate="show"
          className="glass-strong absolute right-2 top-24 w-48 rounded-2xl p-4 shadow-2xl"
          style={{ animation: "float-b 8s ease-in-out infinite" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">ATS Score</span>
            <Target className="size-3.5 text-brand" />
          </div>
          <div className="mt-2 text-3xl font-semibold text-gradient">92%</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-brand to-brand-emerald" />
          </div>
        </motion.div>

        <motion.div
          custom={0.8}
          variants={floatCard}
          initial="hidden"
          animate="show"
          className="glass-strong absolute bottom-0 left-16 w-52 rounded-2xl p-4 shadow-2xl"
          style={{ animation: "float-c 6.5s ease-in-out infinite" }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="size-3.5 text-brand-emerald" />
            Keywords matched
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["React", "Node.js", "AWS", "+15"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-emerald/25 bg-brand-emerald/10 px-2 py-0.5 text-[11px] font-medium text-brand-emerald"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes float-a { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes float-b { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(12px); } }
        @keyframes float-c { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
