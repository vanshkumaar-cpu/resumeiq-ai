"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/analysis/copy-button";
import type { AnalysisResult } from "@/lib/validations/analysis";

export function ImprovementSuggestions({
  suggestions,
}: {
  suggestions: AnalysisResult["improvementSuggestions"];
}) {
  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base">Resume Improvement Suggestions</CardTitle>
        <CardDescription>Section-by-section rewrites tailored to this role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        {suggestions.map((s, i) => (
          <motion.div
            key={`${s.section}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl border border-border/70 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-xs">
                {s.section}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-secondary/40 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Current
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.current}</p>
              </div>
              <div className="rounded-lg border border-brand/20 bg-brand/5 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-brand">
                    AI Suggested
                  </p>
                  <CopyButton text={s.suggested} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed">{s.suggested}</p>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
              <ArrowRight className="mt-0.5 size-3 shrink-0" />
              <span>{s.reason}</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
