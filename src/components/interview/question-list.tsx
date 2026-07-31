"use client";

import { motion } from "framer-motion";
import { Lightbulb, MessageCircle, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { AnalysisResult } from "@/lib/validations/analysis";

type Question = AnalysisResult["interviewQuestions"]["hr"][number];

export function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {questions.map((q, i) => (
        <motion.div
          key={q.question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
        >
          <AccordionItem
            value={`q-${i}`}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card px-4 not-last:border-b-0"
          >
            <AccordionTrigger className="py-4 text-sm font-semibold hover:no-underline [&>svg]:mt-0.5">
              {q.question}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-5">
              <div className="flex gap-2.5 rounded-xl bg-secondary/40 p-3.5">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    Why this is asked
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{q.whyAsked}</p>
                </div>
              </div>
              <div className="flex gap-2.5 rounded-xl border border-brand-emerald/20 bg-brand-emerald/5 p-3.5">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-emerald" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald">
                    Sample answer
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{q.sampleAnswer}</p>
                </div>
              </div>
              <div className="flex gap-2.5 rounded-xl border border-warning/20 bg-warning/5 p-3.5">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-warning">
                    Tips to answer effectively
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{q.tips}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}
