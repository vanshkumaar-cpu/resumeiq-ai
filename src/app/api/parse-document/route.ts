import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { extractTextFromFile, DocumentParseError } from "@/lib/document-parser";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File is too large (max 8MB)" }, { status: 400 });
  }

  try {
    const text = await extractTextFromFile(file);
    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof DocumentParseError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Document parse error", err);
    return NextResponse.json({ error: "Failed to read the file" }, { status: 500 });
  }
}
