"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { scoreTone } from "@/lib/score-utils";
import type { AnalysisResult } from "@/lib/validations/analysis";

const LABELS: Record<keyof AnalysisResult["atsAnalysis"], string> = {
  resumeFormat: "Resume Format",
  readability: "Readability",
  sectionOrder: "Section Order",
  length: "Length",
  contactInformation: "Contact Information",
  keywords: "Keywords",
};

const BAR_COLOR: Record<ReturnType<typeof scoreTone>, string> = {
  emerald: "bg-brand-emerald",
  amber: "bg-warning",
  red: "bg-danger",
};

export function AtsAnalysisCard({ ats }: { ats: AnalysisResult["atsAnalysis"] }) {
  const entries = Object.entries(ats) as [keyof AnalysisResult["atsAnalysis"], AnalysisResult["atsAnalysis"][keyof AnalysisResult["atsAnalysis"]]][];

  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base">ATS Analysis</CardTitle>
        <CardDescription>How well your resume parses through applicant tracking systems</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        {entries.map(([key, item], i) => (
          <div key={key}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{LABELS[key]}</span>
              <span className="text-muted-foreground">{item.score}/100</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${BAR_COLOR[scoreTone(item.score)]}`}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
