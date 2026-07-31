"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatShortDate } from "@/lib/score-utils";

export interface AnalysisOption {
  id: string;
  jobTitle: string | null;
  companyName: string | null;
  createdAt: string;
}

export function AnalysisSwitcher({
  options,
  currentId,
}: {
  options: AnalysisOption[];
  currentId: string;
}) {
  const router = useRouter();

  return (
    <Select value={currentId} onValueChange={(id) => router.push(`/dashboard/interview/${id}`)}>
      <SelectTrigger className="w-full rounded-xl sm:w-72">
        <SelectValue placeholder="Choose an analysis" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.id} value={o.id}>
            {(o.jobTitle || "Untitled role") + (o.companyName ? ` · ${o.companyName}` : "")} —{" "}
            {formatShortDate(o.createdAt)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
