import { redirect } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/dashboard/empty-state";

export default async function InterviewIndexPage() {
  const user = await getCurrentUser();
  const latest = await db.analysis.findFirst({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (latest) {
    redirect(`/dashboard/interview/${latest.id}`);
  }

  return (
    <EmptyState
      icon={MessagesSquare}
      title="No interview prep yet"
      description="Run a resume analysis first — we'll generate tailored HR, technical, behavioral, and company-specific questions for that role."
      actionLabel="Analyze a resume"
      actionHref="/dashboard/analyze"
    />
  );
}
