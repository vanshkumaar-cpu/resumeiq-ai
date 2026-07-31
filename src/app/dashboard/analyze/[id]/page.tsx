import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { AnalysisResult } from "@/lib/validations/analysis";

import { ReportHeader } from "@/components/analysis/report-header";
import { ScoreSummary } from "@/components/analysis/score-summary";
import { ResumePreview } from "@/components/analysis/resume-preview";
import { AtsAnalysisCard } from "@/components/analysis/ats-analysis-card";
import { KeywordAnalysisCard } from "@/components/analysis/keyword-analysis-card";
import { ImprovementSuggestions } from "@/components/analysis/improvement-suggestions";
import { ResumeRewrite } from "@/components/analysis/resume-rewrite";
import { StrengthsCard, AreasToImproveCard } from "@/components/analysis/strengths-improve";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const analysis = await db.analysis.findUnique({ where: { id } });

  if (!analysis || !user || analysis.userId !== user.id) {
    notFound();
  }

  const result = JSON.parse(analysis.resultJson) as AnalysisResult;

  return (
    <div className="space-y-6">
      <ReportHeader
        id={analysis.id}
        jobTitle={analysis.jobTitle ?? result.detected.jobTitle}
        companyName={analysis.companyName ?? result.detected.companyName}
        createdAt={analysis.createdAt}
      />

      <ScoreSummary scores={result.scores} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-[88px] lg:h-fit">
          <ResumePreview filename={analysis.resumeFilename} text={analysis.resumeText} />
        </div>

        <div className="space-y-6">
          <AtsAnalysisCard ats={result.atsAnalysis} />
          <KeywordAnalysisCard data={result.keywordAnalysis} />
          <ImprovementSuggestions suggestions={result.improvementSuggestions} />
          <ResumeRewrite before={result.resumeRewrite.before} after={result.resumeRewrite.after} />
          <StrengthsCard strengths={result.strengths} />
          <AreasToImproveCard areas={result.areasToImprove} />
        </div>
      </div>
    </div>
  );
}
