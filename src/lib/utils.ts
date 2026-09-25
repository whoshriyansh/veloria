import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scorePercent(score: number, maxScore: number) {
  if (!maxScore) return 0;
  return Math.round((score / maxScore) * 100);
}

export function readinessFromScore(score: number, maxScore: number) {
  const pct = scorePercent(score, maxScore);
  if (pct >= 85) return "Investment Ready";
  if (pct >= 60) return "Nearly Ready";
  if (pct >= 35) return "Needs Work";
  return "Critical Gaps";
}

export function parseJsonArray<T = string>(value: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
