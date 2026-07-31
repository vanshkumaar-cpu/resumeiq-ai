"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/validations/analysis";

export function StrengthsCard({ strengths }: { strengths: AnalysisResult["strengths"] }) {
  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base">Resume Strengths</CardTitle>
        <CardDescription>What&apos;s already working in your favor</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 px-0 pb-0 sm:grid-cols-2">
        {strengths.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl border border-brand-emerald/25 bg-brand-emerald/5 p-4"
          >
            <div className="flex items-center gap-2 text-brand-emerald">
              <CheckCircle2 className="size-4 shrink-0" />
              <p className="text-sm font-semibold">{s.title}</p>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.detail}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AreasToImproveCard({ areas }: { areas: AnalysisResult["areasToImprove"] }) {
  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base">Areas to Improve</CardTitle>
        <CardDescription>Your prioritized improvement roadmap</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="relative space-y-6 pl-6">
          <div className="absolute top-1 bottom-1 left-[7px] w-px bg-border" />
          {areas.map((a, i) => (
            <motion.div
              key={a.problem}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative"
            >
              <div className="absolute top-1 -left-6 flex size-3.5 items-center justify-center rounded-full bg-warning ring-4 ring-background">
                <AlertTriangle className="size-2 text-white" />
              </div>
              <p className="text-sm font-semibold">{a.problem}</p>
              <p className="mt-1 text-sm text-muted-foreground">{a.explanation}</p>
              <div className="mt-2 rounded-lg bg-brand/5 px-3 py-2 text-sm text-brand">
                <span className="font-medium">Fix: </span>
                {a.suggestedFix}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
