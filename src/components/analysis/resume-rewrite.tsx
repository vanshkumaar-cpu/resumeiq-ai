"use client";

import { useState } from "react";
import { Download, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/analysis/copy-button";
import { toast } from "sonner";

export function ResumeRewrite({ before, after }: { before: string; after: string }) {
  const [accepted, setAccepted] = useState(false);

  function handleDownload() {
    const blob = new Blob([after], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resumeiq-rewrite.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="rounded-2xl border-border/70 p-5">
      <CardHeader className="px-0 pt-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Resume Rewrite</CardTitle>
            <CardDescription>Before and after — this section, fully rewritten</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={accepted ? "secondary" : "default"}
              onClick={() => {
                setAccepted(true);
                toast.success("Changes accepted");
              }}
              className="h-8 rounded-lg text-xs"
            >
              <CheckCheck className="size-3.5" />
              {accepted ? "Accepted" : "Accept Changes"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload} className="h-8 rounded-lg text-xs">
              <Download className="size-3.5" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Before
              </span>
              <CopyButton text={before} />
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{before}</p>
          </div>
          <div className="rounded-xl border-2 border-brand-emerald/30 bg-brand-emerald/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-emerald">
                After
              </span>
              <CopyButton text={after} />
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed">{after}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
