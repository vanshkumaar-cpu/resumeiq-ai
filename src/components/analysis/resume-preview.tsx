import { FileText } from "lucide-react";

export function ResumePreview({ filename, text }: { filename: string; text: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <FileText className="size-4 text-primary" />
        <span className="truncate text-sm font-medium">{filename}</span>
      </div>
      <div className="max-h-[70vh] overflow-y-auto p-5">
        <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-foreground/90">
          {text}
        </pre>
      </div>
    </div>
  );
}
