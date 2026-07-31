import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { AnalysisResult } from "@/lib/validations/analysis";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const analysis = await db.analysis.findUnique({ where: { id } });

  if (!analysis || analysis.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = JSON.parse(analysis.resultJson) as AnalysisResult;

  return NextResponse.json({
    id: analysis.id,
    resumeFilename: analysis.resumeFilename,
    resumeText: analysis.resumeText,
    jobDescription: analysis.jobDescription,
    createdAt: analysis.createdAt,
    result,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const analysis = await db.analysis.findUnique({ where: { id } });
  if (!analysis || analysis.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.analysis.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
