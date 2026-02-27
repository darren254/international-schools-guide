import type { ClaimType, Verdict, Severity } from "../types";

const HIGH_SEVERITY_TYPES: ClaimType[] = [
  "founding_year",
  "accreditation",
  "curriculum",
  "exam_result",
  "ranking",
  "governance",
];

const MEDIUM_SEVERITY_TYPES: ClaimType[] = [
  "fee",
  "student_count",
  "age_range",
];

export function classifySeverity(
  verdict: Verdict,
  claimType: ClaimType,
): Severity {
  if (verdict === "correct" || verdict === "likely_correct") {
    return "none";
  }

  if (verdict === "unverifiable" || verdict === "unclear") {
    return "none";
  }

  if (verdict === "incorrect") {
    if (HIGH_SEVERITY_TYPES.includes(claimType)) return "high";
    if (MEDIUM_SEVERITY_TYPES.includes(claimType)) return "medium";
    return "low";
  }

  if (verdict === "outdated") {
    if (HIGH_SEVERITY_TYPES.includes(claimType)) return "medium";
    return "low";
  }

  return "none";
}
