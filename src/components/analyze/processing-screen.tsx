"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  ScanText,
  FileCheck2,
  ListChecks,
  Gauge,
  Lightbulb,
  MessagesSquare,
  Sparkles,
  type LucideIcon,
  Check,
} from "lucide-react";

interface Step {
  label: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  { label: "Reading Resume", icon: FileSearch },
  { label: "Extracting Resume Content", icon: ScanText },
  { label: "Reading Job Description", icon: FileCheck2 },
  { label: "Matching Keywords", icon: ListChecks },
  { label: "Calculating ATS Score", icon: Gauge },
  { label: "Generating Suggestions", icon: Lightbulb },
  { label: "Preparing Interview Questions", icon: MessagesSquare },
  { label: "Creating Final Report", icon: Sparkles },
];

const HOLD_INDEX = STEPS.length - 2;

interface ProcessingScreenProps {
  complete: boolean;
  onFinished: () => void;
}

export function ProcessingScreen({ complete, onFinished }: ProcessingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (complete) return;
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, HOLD_INDEX));
    }, 1450);
    return () => clearInterval(interval);
  }, [complete]);

  useEffect(() => {
    if (!complete) return;
    const interval = setInterval(() => {
      setStepIndex((i) => {
        if (i >= STEPS.length - 1) {
          clearInterval(interval);
          if (!finishedRef.current) {
            finishedRef.current = true;
            setTimeout(onFinished, 700);
          }
          return i;
        }
        return i + 1;
      });
    }, 260);
    return () => clearInterval(interval);
  }, [complete, onFinished]);

  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <div className="relative flex size-32 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-brand via-brand-violet to-brand-emerald opacity-25 blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="58" fill="none" stroke="var(--border)" strokeWidth="4" />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#processing-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 58}
            initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - progress / 100) }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="processing-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand)" />
              <stop offset="100%" stopColor="var(--brand-violet)" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          key={stepIndex}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex size-16 items-center justify-center rounded-full bg-card shadow-lg"
        >
          {(() => {
            const Icon = STEPS[stepIndex].icon;
            return <Icon className="size-7 text-primary" />;
          })()}
        </motion.div>
      </div>

      <motion.h2
        key={`title-${stepIndex}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-xl font-semibold tracking-tight"
      >
        {STEPS[stepIndex].label}…
      </motion.h2>
      <p className="mt-2 text-sm text-muted-foreground">
        ResumeIQ AI is analyzing your resume against the job description
      </p>

      <div className="mt-10 w-full max-w-sm space-y-1">
        {STEPS.map((step, i) => {
          const isDone = i < stepIndex;
          const isActive = i === stepIndex;
          return (
            <div
              key={step.label}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors"
            >
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isDone
                    ? "border-brand-emerald bg-brand-emerald text-white"
                    : isActive
                      ? "border-primary"
                      : "border-border"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key="check"
                    >
                      <Check className="size-3" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="pulse"
                      className="size-2 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
              <span
                className={
                  isDone
                    ? "text-muted-foreground line-through decoration-border"
                    : isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
