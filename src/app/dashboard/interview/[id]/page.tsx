import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { AnalysisResult } from "@/lib/validations/analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionList } from "@/components/interview/question-list";
import { AnalysisSwitcher } from "@/components/interview/analysis-switcher";

const CATEGORIES = [
  { key: "hr", label: "HR" },
  { key: "technical", label: "Technical" },
  { key: "behavioral", label: "Behavioral" },
  { key: "companySpecific", label: "Company-specific" },
  { key: "projectBased", label: "Project-based" },
] as const;

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const [analysis, allAnalyses] = await Promise.all([
    db.analysis.findUnique({ where: { id } }),
    db.analysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, jobTitle: true, companyName: true, createdAt: true },
    }),
  ]);

  if (!analysis || analysis.userId !== user.id) notFound();

  const result = JSON.parse(analysis.resultJson) as AnalysisResult;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interview Preparation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tailored questions for {analysis.jobTitle || result.detected.jobTitle}
            {analysis.companyName ? ` at ${analysis.companyName}` : ""}
          </p>
        </div>
        <AnalysisSwitcher
          currentId={id}
          options={allAnalyses.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
        />
      </div>

      <Tabs defaultValue="hr">
        <TabsList className="h-auto flex-wrap gap-1 bg-secondary/40 p-1.5">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c.key} value={c.key} className="rounded-lg px-3.5 py-1.5 text-sm">
              {c.label}
              <span className="ml-1.5 text-xs text-muted-foreground">
                {result.interviewQuestions[c.key].length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((c) => (
          <TabsContent key={c.key} value={c.key} className="mt-5">
            <QuestionList questions={result.interviewQuestions[c.key]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
