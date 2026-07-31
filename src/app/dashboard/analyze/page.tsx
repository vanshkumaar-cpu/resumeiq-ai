"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ResumeDropzone } from "@/components/analyze/resume-dropzone";
import { JdEditor } from "@/components/analyze/jd-editor";
import { ProcessingScreen } from "@/components/analyze/processing-screen";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [stage, setStage] = useState<"form" | "processing">("form");
  const [apiComplete, setApiComplete] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const router = useRouter();

  const canAnalyze = !!file && jobDescription.trim().length >= 40;

  async function handleAnalyze() {
    if (!file || !canAnalyze) {
      toast.error("Upload a resume and paste a full job description (40+ characters) first.");
      return;
    }

    setStage("processing");
    setApiComplete(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription.trim());

      const res = await fetch("/api/analyses", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      setResultId(data.id);
      setApiComplete(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setStage("form");
    }
  }

  if (stage === "processing") {
    return (
      <ProcessingScreen
        complete={apiComplete}
        onFinished={() => {
          if (resultId) router.push(`/dashboard/analyze/${resultId}`);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resume Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your resume and paste the job description to get an instant, detailed match report.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-medium text-muted-foreground">Your resume</h2>
          <ResumeDropzone file={file} onFileChange={setFile} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-medium text-muted-foreground">Target job</h2>
          <JdEditor value={jobDescription} onChange={setJobDescription} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-end"
      >
        <Button
          size="lg"
          disabled={!canAnalyze}
          onClick={handleAnalyze}
          className="group h-12 rounded-xl bg-primary px-8 text-base font-medium shadow-lg shadow-primary/25 disabled:opacity-40"
        >
          <Sparkles className="size-4.5" />
          Analyze Resume
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </motion.div>
    </div>
  );
}
