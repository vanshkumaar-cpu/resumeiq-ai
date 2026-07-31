"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessagesSquare, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/score-utils";

interface ReportHeaderProps {
  id: string;
  jobTitle: string;
  companyName: string;
  createdAt: string | Date;
}

export function ReportHeader({ id, jobTitle, companyName, createdAt }: ReportHeaderProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this analysis? This can't be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Analysis deleted");
      router.push("/dashboard/history");
      router.refresh();
    } else {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {jobTitle || "Analysis Report"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {companyName ? `${companyName} · ` : ""}
          {formatDate(createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href={`/dashboard/interview/${id}`}>
            <MessagesSquare className="size-4" />
            Interview Prep
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
