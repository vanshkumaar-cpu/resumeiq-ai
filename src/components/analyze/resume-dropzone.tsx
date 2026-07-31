"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, X, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

interface ResumeDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function ResumeDropzone({ file, onFileChange }: ResumeDropzoneProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateUpload = useCallback(() => {
    setIsUploading(true);
    setUploadProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setUploadProgress((p) => {
        const next = p + Math.random() * 22 + 8;
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsUploading(false);
          return 100;
        }
        return next;
      });
    }, 140);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const onDrop = useCallback(
    (accepted: File[], rejected: import("react-dropzone").FileRejection[]) => {
      if (rejected.length > 0) {
        toast.error("Please upload a PDF, DOCX, or TXT file under 8MB.");
        return;
      }
      const picked = accepted[0];
      if (!picked) return;
      onFileChange(picked);
      simulateUpload();
    },
    [onFileChange, simulateUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024,
    multiple: false,
  });

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onFileChange(null);
    setUploadProgress(0);
  }

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border/80 bg-card p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB
            </p>
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5"
                >
                  <Progress value={uploadProgress} className="h-1.5" />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Uploading… {Math.round(uploadProgress)}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {!isUploading && (
              <div className="mt-2 flex items-center gap-1 text-xs text-brand-emerald">
                <CheckCircle2 className="size-3.5" />
                Ready for analysis
              </div>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
        <div {...getRootProps()} className="mt-3">
          <input {...getInputProps()} />
          <Button type="button" variant="outline" size="sm" className="w-full rounded-lg">
            <RefreshCw className="size-3.5" />
            Replace resume
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition-all",
        isDragActive && "border-primary bg-primary/5 scale-[1.01]",
      )}
    >
      <input {...getInputProps()} />
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
        <UploadCloud className="size-7" />
      </div>
      <div>
        <p className="font-medium">
          {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click to browse — PDF, DOCX, or TXT (max 8MB)
        </p>
      </div>
    </div>
  );
}
