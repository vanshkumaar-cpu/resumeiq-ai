import Link from "next/link";
import { History, FileText, Building2, Target, Percent } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate, scoreTone, scoreToneClasses } from "@/lib/score-utils";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  const analyses = await db.analysis.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resume History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {analyses.length} previous {analyses.length === 1 ? "analysis" : "analyses"}
        </p>
      </div>

      {analyses.length === 0 ? (
        <EmptyState
          icon={History}
          title="No history yet"
          description="Every resume you analyze will show up here, so you can revisit past reports and interview prep anytime."
          actionLabel="Analyze a resume"
          actionHref="/dashboard/analyze"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/analyze/${a.id}`}
              className="card-hover flex flex-col rounded-2xl border border-border/70 bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <Badge variant="outline" className={scoreToneClasses[scoreTone(a.overallScore)]}>
                  {a.overallScore}% match
                </Badge>
              </div>

              <h3 className="mt-3.5 truncate font-semibold">
                {a.jobTitle || a.resumeFilename}
              </h3>
              <p className="truncate text-sm text-muted-foreground">{a.resumeFilename}</p>

              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="size-3.5" />
                {a.companyName || "Company not detected"}
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-border/70 pt-3.5 text-sm">
                <div className="flex items-center gap-1.5">
                  <Target className="size-3.5 text-brand" />
                  <span className="font-medium">{a.atsScore}%</span>
                  <span className="text-xs text-muted-foreground">ATS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Percent className="size-3.5 text-brand-violet" />
                  <span className="font-medium">{a.matchScore}%</span>
                  <span className="text-xs text-muted-foreground">Match</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
