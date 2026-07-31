export function scoreTone(score: number): "emerald" | "amber" | "red" {
  if (score >= 80) return "emerald";
  if (score >= 60) return "amber";
  return "red";
}

export const scoreToneClasses: Record<ReturnType<typeof scoreTone>, string> = {
  emerald: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20",
  amber: "text-warning bg-warning/10 border-warning/20",
  red: "text-danger bg-danger/10 border-danger/20",
};

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
