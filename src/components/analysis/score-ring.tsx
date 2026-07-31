"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { scoreTone } from "@/lib/score-utils";

const TONE_COLORS: Record<ReturnType<typeof scoreTone>, [string, string]> = {
  emerald: ["var(--brand-emerald)", "var(--brand)"],
  amber: ["var(--warning)", "var(--brand-emerald)"],
  red: ["var(--danger)", "var(--warning)"],
};

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  gradientId: string;
}

export function ScoreRing({ score, size = 200, strokeWidth = 14, label, gradientId }: ScoreRingProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [from, to] = TONE_COLORS[scoreTone(score)];

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1400;
    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, score]);

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference * (1 - score / 100) } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-semibold tracking-tight">{displayScore}%</span>
        {label && <span className="mt-1 text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
