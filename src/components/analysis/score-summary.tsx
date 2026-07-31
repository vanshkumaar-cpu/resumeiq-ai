import { Target, Gauge, Percent } from "lucide-react";
import { ScoreRing } from "@/components/analysis/score-ring";
import type { AnalysisResult } from "@/lib/validations/analysis";

export function ScoreSummary({ scores }: { scores: AnalysisResult["scores"] }) {
  const tiles = [
    { label: "ATS Score", value: scores.atsScore, icon: Gauge },
    { label: "Resume Strength", value: scores.resumeStrength, icon: Target },
    { label: "Match Percentage", value: scores.matchPercentage, icon: Percent },
  ];

  return (
    <div className="glow-brand flex flex-col items-center gap-8 rounded-3xl border border-border/70 bg-card p-8 sm:flex-row sm:justify-between">
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <p className="text-sm font-medium text-muted-foreground">Overall Match Score</p>
        <div className="mt-3">
          <ScoreRing score={scores.overallMatch} gradientId="overall-score-gradient" label="Match" />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-1">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="flex min-w-56 items-center gap-3 rounded-2xl border border-border/70 bg-secondary/30 px-4 py-3"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <t.icon className="size-4" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">{t.value}%</p>
              <p className="text-xs text-muted-foreground">{t.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
