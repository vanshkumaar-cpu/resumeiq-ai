import { z } from "zod";

const scoreItem = z.object({
  score: z.number().min(0).max(100),
  note: z.string(),
});

const keywordPriority = z.enum(["high", "medium", "low"]);

const interviewQuestion = z.object({
  question: z.string(),
  whyAsked: z.string(),
  sampleAnswer: z.string(),
  tips: z.string(),
});

const improvementSection = z.enum([
  "Professional Summary",
  "Experience",
  "Projects",
  "Education",
  "Skills",
]);

export const analysisResultSchema = z.object({
  detected: z.object({
    companyName: z.string(),
    jobTitle: z.string(),
    experienceLevel: z.string(),
    requiredSkills: z.array(z.string()),
  }),

  scores: z.object({
    overallMatch: z.number().min(0).max(100),
    atsScore: z.number().min(0).max(100),
    resumeStrength: z.number().min(0).max(100),
    matchPercentage: z.number().min(0).max(100),
  }),

  atsAnalysis: z.object({
    resumeFormat: scoreItem,
    readability: scoreItem,
    sectionOrder: scoreItem,
    length: scoreItem,
    contactInformation: scoreItem,
    keywords: scoreItem,
  }),

  keywordAnalysis: z.object({
    matchedKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
    recommendedKeywords: z.array(
      z.object({ keyword: z.string(), priority: keywordPriority }),
    ),
    searchabilityScore: z.number().min(0).max(100),
  }),

  improvementSuggestions: z.array(
    z.object({
      section: improvementSection,
      current: z.string(),
      suggested: z.string(),
      reason: z.string(),
    }),
  ),

  resumeRewrite: z.object({
    before: z.string(),
    after: z.string(),
  }),

  strengths: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
    }),
  ),

  areasToImprove: z.array(
    z.object({
      problem: z.string(),
      explanation: z.string(),
      suggestedFix: z.string(),
    }),
  ),

  interviewQuestions: z.object({
    hr: z.array(interviewQuestion),
    technical: z.array(interviewQuestion),
    behavioral: z.array(interviewQuestion),
    companySpecific: z.array(interviewQuestion),
    projectBased: z.array(interviewQuestion),
  }),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
