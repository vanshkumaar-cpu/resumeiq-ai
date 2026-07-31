const SKILL_KEYWORDS = [
  "React", "Next.js", "Vue", "Angular", "TypeScript", "JavaScript", "Node.js",
  "Python", "Java", "Go", "Rust", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
  "GraphQL", "REST", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD",
  "Git", "Jenkins", "Figma", "Agile", "Scrum", "Jira", "Tableau", "Power BI",
  "Excel", "SEO", "Salesforce", "HubSpot", "Product Management", "UX Research",
  "Machine Learning", "TensorFlow", "PyTorch", "Data Analysis", "A/B Testing",
  "Leadership", "Stakeholder Management", "Communication", "Django", "Flask",
  "Spring Boot", "Microservices", "Webpack", "Tailwind", "HTML", "CSS",
];

export interface DetectedJobInfo {
  jobTitle: string | null;
  companyName: string | null;
  experience: string | null;
  skills: string[];
}

export function detectJobInfo(jd: string): DetectedJobInfo {
  if (!jd || jd.trim().length < 20) {
    return { jobTitle: null, companyName: null, experience: null, skills: [] };
  }

  const lines = jd
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const jobTitle = lines[0]?.length && lines[0].length < 80 ? lines[0] : null;

  let companyName: string | null = null;
  const companyPatterns = [
    /\bat\s+([A-Z][A-Za-z0-9&.,'\- ]{1,40})\b/,
    /\b([A-Z][A-Za-z0-9&.,'\- ]{1,40})\s+is\s+(?:hiring|looking for|seeking)/i,
    /company:\s*([A-Za-z0-9&.,'\- ]{1,40})/i,
  ];
  for (const pattern of companyPatterns) {
    const match = jd.match(pattern);
    if (match?.[1]) {
      companyName = match[1].trim();
      break;
    }
  }

  let experience: string | null = null;
  const expMatch = jd.match(/(\d+\+?\s*(?:-\s*\d+\s*)?\s*years?)\s+(?:of\s+)?experience/i);
  if (expMatch) {
    experience = expMatch[1].trim();
  } else if (/\bsenior\b/i.test(jd)) {
    experience = "Senior level";
  } else if (/\b(entry.level|junior)\b/i.test(jd)) {
    experience = "Entry level";
  } else if (/\bmid.level\b/i.test(jd)) {
    experience = "Mid level";
  }

  const skills = SKILL_KEYWORDS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(jd);
  }).slice(0, 12);

  return { jobTitle, companyName, experience, skills };
}
