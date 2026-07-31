import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractTextFromFile, DocumentParseError } from "@/lib/document-parser";
import { analyzeResume } from "@/lib/ai/analyze";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const analyses = await db.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      resumeFilename: true,
      companyName: true,
      jobTitle: true,
      atsScore: true,
      matchScore: true,
      overallScore: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ analyses });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("resume");
  const jobDescription = formData.get("jobDescription");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A resume file is required" }, { status: 400 });
  }
  if (typeof jobDescription !== "string" || jobDescription.trim().length < 40) {
    return NextResponse.json(
      { error: "Please paste a more complete job description (40+ characters)" },
      { status: 400 },
    );
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File is too large (max 8MB)" }, { status: 400 });
  }

  let resumeText: string;
  try {
    resumeText = await extractTextFromFile(file);
  } catch (err) {
    if (err instanceof DocumentParseError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Resume parse error", err);
    return NextResponse.json({ error: "Failed to read the resume file" }, { status: 500 });
  }

  try {
    const result = await analyzeResume({ resumeText, jobDescription: jobDescription.trim() });

    const analysis = await db.analysis.create({
      data: {
        userId: user.id,
        resumeFilename: file.name,
        resumeText,
        jobDescription: jobDescription.trim(),
        companyName: result.detected.companyName || null,
        jobTitle: result.detected.jobTitle || null,
        atsScore: result.scores.atsScore,
        matchScore: result.scores.matchPercentage,
        overallScore: result.scores.overallMatch,
        resultJson: JSON.stringify(result),
      },
      select: { id: true },
    });

    return NextResponse.json({ id: analysis.id, result });
  } catch (err) {
    console.error("Analysis error", err);
    const message =
      err instanceof Error && process.env.NODE_ENV !== "production"
        ? err.message
        : "AI analysis failed. Please check your GEMINI_API_KEY and try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
