"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: ReactNode;
  accent?: "brand" | "violet" | "emerald";
  delay?: number;
  sublabel?: string;
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  brand: "bg-brand/10 text-brand",
  violet: "bg-brand-violet/10 text-brand-violet",
  emerald: "bg-brand-emerald/10 text-brand-emerald",
};

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

export function StatCard({
  label,
  value,
  suffix = "",
  icon,
  accent = "brand",
  delay = 0,
  sublabel,
}: StatCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const animatedValue = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="card-hover relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {animatedValue}
            {suffix}
          </p>
          {sublabel && <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>}
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-xl", ACCENT_CLASSES[accent])}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
