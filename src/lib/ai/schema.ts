// Raw JSON Schema mirror of src/lib/validations/analysis.ts, for Gemini's
// responseJsonSchema (structured outputs). Kept as plain JSON Schema
// rather than generated from the zod schema, since the app's zod version
// (v3) doesn't need to match any particular SDK helper's expectations.

const scoreItem = {
  type: "object",
  properties: {
    score: { type: "integer" },
    note: { type: "string" },
  },
  required: ["score", "note"],
  additionalProperties: false,
};

const interviewQuestion = {
  type: "object",
  properties: {
    question: { type: "string" },
    whyAsked: { type: "string" },
    sampleAnswer: { type: "string" },
    tips: { type: "string" },
  },
  required: ["question", "whyAsked", "sampleAnswer", "tips"],
  additionalProperties: false,
};

const interviewQuestionList = { type: "array", items: interviewQuestion };

export const ANALYSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    detected: {
      type: "object",
      properties: {
        companyName: { type: "string" },
        jobTitle: { type: "string" },
        experienceLevel: { type: "string" },
        requiredSkills: { type: "array", items: { type: "string" } },
      },
      required: ["companyName", "jobTitle", "experienceLevel", "requiredSkills"],
      additionalProperties: false,
    },

    scores: {
      type: "object",
      properties: {
        overallMatch: { type: "integer" },
        atsScore: { type: "integer" },
        resumeStrength: { type: "integer" },
        matchPercentage: { type: "integer" },
      },
      required: ["overallMatch", "atsScore", "resumeStrength", "matchPercentage"],
      additionalProperties: false,
    },

    atsAnalysis: {
      type: "object",
      properties: {
        resumeFormat: scoreItem,
        readability: scoreItem,
        sectionOrder: scoreItem,
        length: scoreItem,
        contactInformation: scoreItem,
        keywords: scoreItem,
      },
      required: [
        "resumeFormat",
        "readability",
        "sectionOrder",
        "length",
        "contactInformation",
        "keywords",
      ],
      additionalProperties: false,
    },

    keywordAnalysis: {
      type: "object",
      properties: {
        matchedKeywords: { type: "array", items: { type: "string" } },
        missingKeywords: { type: "array", items: { type: "string" } },
        recommendedKeywords: {
          type: "array",
          items: {
            type: "object",
            properties: {
              keyword: { type: "string" },
              priority: { type: "string", enum: ["high", "medium", "low"] },
            },
            required: ["keyword", "priority"],
            additionalProperties: false,
          },
        },
        searchabilityScore: { type: "integer" },
      },
      required: [
        "matchedKeywords",
        "missingKeywords",
        "recommendedKeywords",
        "searchabilityScore",
      ],
      additionalProperties: false,
    },

    improvementSuggestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["Professional Summary", "Experience", "Projects", "Education", "Skills"],
          },
          current: { type: "string" },
          suggested: { type: "string" },
          reason: { type: "string" },
        },
        required: ["section", "current", "suggested", "reason"],
        additionalProperties: false,
      },
    },

    resumeRewrite: {
      type: "object",
      properties: {
        before: { type: "string" },
        after: { type: "string" },
      },
      required: ["before", "after"],
      additionalProperties: false,
    },

    strengths: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
        },
        required: ["title", "detail"],
        additionalProperties: false,
      },
    },

    areasToImprove: {
      type: "array",
      items: {
        type: "object",
        properties: {
          problem: { type: "string" },
          explanation: { type: "string" },
          suggestedFix: { type: "string" },
        },
        required: ["problem", "explanation", "suggestedFix"],
        additionalProperties: false,
      },
    },

    interviewQuestions: {
      type: "object",
      properties: {
        hr: interviewQuestionList,
        technical: interviewQuestionList,
        behavioral: interviewQuestionList,
        companySpecific: interviewQuestionList,
        projectBased: interviewQuestionList,
      },
      required: ["hr", "technical", "behavioral", "companySpecific", "projectBased"],
      additionalProperties: false,
    },
  },
  required: [
    "detected",
    "scores",
    "atsAnalysis",
    "keywordAnalysis",
    "improvementSuggestions",
    "resumeRewrite",
    "strengths",
    "areasToImprove",
    "interviewQuestions",
  ],
  additionalProperties: false,
} as const;
