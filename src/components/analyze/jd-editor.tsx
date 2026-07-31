"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Briefcase, Building2, Clock, Loader2, UploadCloud, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { detectJobInfo } from "@/lib/jd-heuristics";
import { cn } from "@/lib/utils";

interface JdEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

export function JdEditor({ value, onChange }: JdEditorProps) {
  const [isParsing, setIsParsing] = useState(false);
  const detected = useMemo(() => detectJobInfo(value), [value]);
  const hasDetections =
    detected.jobTitle || detected.companyName || detected.experience || detected.skills.length > 0;

  const onDrop = useCallback(
    async (accepted: File[], rejected: import("react-dropzone").FileRejection[]) => {
      if (rejected.length > 0) {
        toast.error("Please upload a PDF, DOCX, or TXT file under 8MB.");
        return;
      }
      const file = accepted[0];
      if (!file) return;

      setIsParsing(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-document", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to read the file");
        onChange(data.text);
        toast.success(`Extracted job description from ${file.name}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to read the file");
      } finally {
        setIsParsing(false);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-2xl border border-border/80 bg-card p-5 transition-colors",
        isDragActive && "border-primary bg-primary/5",
      )}
    >
      <input {...getInputProps()} />

      <div className="flex items-center justify-between gap-2">
        <label htmlFor="jd" className="text-sm font-medium">
          Job description
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{value.length} characters</span>
          <button
            type="button"
            onClick={open}
            disabled={isParsing}
            className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-secondary/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            {isParsing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <UploadCloud className="size-3.5" />
            )}
            {isParsing ? "Reading…" : "Upload PDF / DOCX"}
          </button>
        </div>
      </div>

      <Textarea
        id="jd"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here, or drag & drop a PDF/DOCX file — the more detail, the more accurate your ATS match score will be…"
        className="mt-2 min-h-52 resize-none rounded-xl border-border/70 bg-secondary/30 text-sm leading-relaxed"
      />

      {isDragActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-primary/5 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-medium shadow-lg">
            <UploadCloud className="size-4 text-primary" />
            Drop to extract job description
          </div>
        </div>
      )}

      {hasDetections && (
        <div className="mt-4 space-y-2.5 border-t border-border/70 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Auto-detected
          </p>
          <div className="flex flex-wrap gap-2">
            {detected.jobTitle && (
              <Badge variant="secondary" className="gap-1 rounded-lg px-2.5 py-1">
                <Briefcase className="size-3" />
                {detected.jobTitle}
              </Badge>
            )}
            {detected.companyName && (
              <Badge variant="secondary" className="gap-1 rounded-lg px-2.5 py-1">
                <Building2 className="size-3" />
                {detected.companyName}
              </Badge>
            )}
            {detected.experience && (
              <Badge variant="secondary" className="gap-1 rounded-lg px-2.5 py-1">
                <Clock className="size-3" />
                {detected.experience}
              </Badge>
            )}
          </div>
          {detected.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Wrench className="size-3 text-muted-foreground" />
              {detected.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="rounded-md border-brand/25 bg-brand/5 px-1.5 py-0 text-[11px] text-brand"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
