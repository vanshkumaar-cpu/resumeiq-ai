import Link from "next/link";
import { FileSearch, Sparkles, Target, TrendingUp, Trophy, ArrowUpRight, FileText } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatCard } from "@/components/dashboard/stat-card";
import { ScoreChart, type ScorePoint } from "@/components/dashboard/score-chart";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatShortDate, formatDate, scoreTone, scoreToneClasses } from "@/lib/score-utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const analyses = await db.analysis.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  const total = analyses.length;
  const avgAts = total ? Math.round(analyses.reduce((s, a) => s + a.atsScore, 0) / total) : 0;
  const bestScore = total ? Math.max(...analyses.map((a) => a.overallScore)) : 0;
  const recent = analyses.slice(0, 6);

  const chartData: ScorePoint[] = [...analyses]
    .reverse()
    .slice(-10)
    .map((a) => ({
      date: formatShortDate(a.createdAt),
      atsScore: a.atsScore,
      matchScore: a.matchScore,
    }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user!.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s how your resume has been performing.
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-lg shadow-primary/20">
          <Link href="/dashboard/analyze">
            <Sparkles className="size-4" />
            New Analysis
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Resume Analyses"
          value={total}
          icon={<FileSearch className="size-5" />}
          accent="brand"
          delay={0}
        />
        <StatCard
          label="Average ATS Score"
          value={avgAts}
          suffix="%"
          icon={<Target className="size-5" />}
          accent="violet"
          delay={0.05}
        />
        <StatCard
          label="Best Resume Score"
          value={bestScore}
          suffix="%"
          icon={<Trophy className="size-5" />}
          accent="emerald"
          delay={0.1}
        />
        <StatCard
          label="Recent Analysis"
          value={recent[0]?.overallScore ?? 0}
          suffix={recent[0] ? "%" : ""}
          sublabel={recent[0] ? formatDate(recent[0].createdAt) : "No analyses yet"}
          icon={<TrendingUp className="size-5" />}
          accent="brand"
          delay={0.15}
        />
      </div>

      {total === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="Run your first analysis"
          description="Upload a resume and paste a job description to get an instant ATS score, keyword breakdown, and AI rewrite suggestions."
          actionLabel="Analyze a resume"
          actionHref="/dashboard/analyze"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Score history</h2>
                <p className="text-sm text-muted-foreground">ATS score vs. match percentage over time</p>
              </div>
            </div>
            <div className="mt-4">
              <ScoreChart data={chartData} />
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <h2 className="font-semibold">Recent activity</h2>
            <div className="mt-3 space-y-1">
              {recent.map((a) => (
                <Link
                  key={a.id}
                  href={`/dashboard/analyze/${a.id}`}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {a.jobTitle || a.resumeFilename}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.companyName || "—"} · {formatShortDate(a.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={scoreToneClasses[scoreTone(a.overallScore)]}
                  >
                    {a.overallScore}%
                  </Badge>
                  <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
            <Button asChild variant="ghost" className="mt-2 w-full justify-center rounded-xl">
              <Link href="/dashboard/history">View all history</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
