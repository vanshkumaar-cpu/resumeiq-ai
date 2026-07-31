import { GoogleGenAI } from "@google/genai";
import { ANALYSIS_JSON_SCHEMA } from "@/lib/ai/schema";
import { analysisResultSchema, type AnalysisResult } from "@/lib/validations/analysis";

// "-latest" alias so this keeps working as Google rolls the underlying
// model forward. Free-tier keys currently get 0 quota on "gemini-2.5-pro";
// this flash alias is what's actually available without billing enabled.
const MODEL = "gemini-flash-latest";

const SYSTEM_PROMPT = `You are ResumeIQ AI, an expert ATS (Applicant Tracking System) analyst, professional resume writer, and technical interview coach with 15+ years of experience across recruiting and hiring for top companies.

You will be given a candidate's resume text and a job description. Perform a rigorous, honest analysis and respond with ONLY the structured JSON object requested — no prose outside the schema.

Guidelines:
- Be specific and reference actual content from the resume and job description. Never invent employers, dates, or credentials that are not implied by the source resume.
- Scores (0-100) must be realistic and differentiated — do not default to the same number everywhere. A resume with strong keyword overlap should score higher than one without.
- "detected" fields should be extracted directly from the job description (company name, job title, seniority/experience level, and the concrete required skills/technologies listed or implied).
- keywordAnalysis.matchedKeywords are terms/skills present in BOTH the resume and job description. missingKeywords are important JD terms absent from the resume. recommendedKeywords are additional terms worth adding, each with a priority.
- improvementSuggestions must cover the sections that actually appear (or should appear) in the resume — for each, "current" is a real (or closely paraphrased) excerpt from the resume, and "suggested" is a concretely rewritten, stronger version using action verbs, quantified impact, and JD-aligned keywords. Provide 3-6 suggestions.
- resumeRewrite.before should be the candidate's current professional summary or top experience bullet block (verbatim or near-verbatim from the resume); resumeRewrite.after is your fully rewritten, ATS-optimized version of that same block.
- strengths: 3-5 genuine strengths grounded in the resume content.
- areasToImprove: 3-6 concrete problems, each with a plain-language explanation of why it hurts the candidate and a specific fix. Present as a chronological improvement plan.
- interviewQuestions: generate realistic, role- and company-specific questions across all five categories (hr, technical, behavioral, companySpecific, projectBased), 4-6 each. For every question give a genuinely useful "why this is asked", a strong sample answer tailored to this candidate's background, and a concise actionable tip.
- Keep all text professional, encouraging, and specific — avoid generic filler like "tailor your resume to the job" without saying exactly how.

Respond with a single JSON object matching the required schema exactly. Do not wrap it in markdown code fences.`;

export interface AnalyzeInput {
  resumeText: string;
  jobDescription: string;
}

export async function analyzeResume({
  resumeText,
  jobDescription,
}: AnalyzeInput): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "No Gemini API key configured. Add GEMINI_API_KEY to your .env file (get one at https://aistudio.google.com/apikey), then restart the dev server.",
    );
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `RESUME:\n"""\n${resumeText}\n"""\n\nJOB DESCRIPTION:\n"""\n${jobDescription}\n"""`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: ANALYSIS_JSON_SCHEMA,
      thinkingConfig: { thinkingBudget: -1 },
    },
  });

  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason === "SAFETY" || finishReason === "PROHIBITED_CONTENT") {
    throw new Error(
      "The AI declined to analyze this content. Please check your resume and job description for anything that may violate usage policies.",
    );
  }

  const text = response.text;
  if (!text) {
    throw new Error("The AI did not return a text response.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new Error("The AI response was not valid JSON.");
  }

  const result = analysisResultSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new Error(
      `The AI response did not match the expected format: ${result.error.issues[0]?.message}`,
    );
  }

  return result.data;
}
