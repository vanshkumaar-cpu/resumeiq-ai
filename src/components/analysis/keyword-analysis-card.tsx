import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Sparkles, Radar } from "lucide-react";
import type { AnalysisResult } from "@/lib/validations/analysis";

const PRIORITY_CLASSES: Record<string, string> = {
  high: "border-danger/25 bg-danger/10 text-danger",
  medium: "border-warning/25 bg-warning/10 text-warning",
  low: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

export function KeywordAnalysisCard({ data }: { data: AnalysisResult["keywordAnalysis"] }) {
  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Keyword Analysis</CardTitle>
            <CardDescription>Terms recruiters and ATS filters search for</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-brand/10 px-3 py-1.5 text-brand">
            <Radar className="size-3.5" />
            <span className="text-sm font-semibold">{data.searchabilityScore}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-brand-emerald">
            <CheckCircle2 className="size-4" />
            Matched keywords ({data.matchedKeywords.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.matchedKeywords.map((k) => (
              <Badge key={k} className="rounded-md border border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald" variant="outline">
                {k}
              </Badge>
            ))}
            {data.matchedKeywords.length === 0 && (
              <span className="text-xs text-muted-foreground">None detected</span>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-danger">
            <XCircle className="size-4" />
            Missing keywords ({data.missingKeywords.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.missingKeywords.map((k) => (
              <Badge key={k} className="rounded-md border border-danger/25 bg-danger/10 text-danger" variant="outline">
                {k}
              </Badge>
            ))}
            {data.missingKeywords.length === 0 && (
              <span className="text-xs text-muted-foreground">None — great coverage!</span>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-brand">
            <Sparkles className="size-4" />
            Recommended additions
          </div>
          <div className="space-y-1.5">
            {data.recommendedKeywords.map((r) => (
              <div key={r.keyword} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-1.5 text-sm">
                <span>{r.keyword}</span>
                <Badge variant="outline" className={`rounded-md text-[11px] capitalize ${PRIORITY_CLASSES[r.priority]}`}>
                  {r.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
