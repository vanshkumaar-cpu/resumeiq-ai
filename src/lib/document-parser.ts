import mammoth from "mammoth";

export class DocumentParseError extends Error {}

let workerConfigured = false;

async function ensurePdfWorkerConfigured() {
  if (workerConfigured) return;
  const [{ PDFParse }, { getPath }] = await Promise.all([
    import("pdf-parse"),
    import("pdf-parse/worker"),
  ]);
  PDFParse.setWorker(getPath());
  workerConfigured = true;
}

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    await ensurePdfWorkerConfigured();
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText({ pageJoiner: "\n" });
      return normalize(result.text);
    } finally {
      await parser.destroy();
    }
  }

  if (
    name.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return normalize(value);
  }

  if (name.endsWith(".txt") || file.type === "text/plain") {
    return normalize(buffer.toString("utf-8"));
  }

  throw new DocumentParseError(
    "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
  );
}

function normalize(text: string): string {
  const cleaned = text.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();
  if (!cleaned || cleaned.length < 40) {
    throw new DocumentParseError(
      "We couldn't extract enough text from this file. Try a different file or paste it as plain text.",
    );
  }
  return cleaned;
}
