import { z } from "zod";

// ─── Enums ───────────────────────────────────────────

export const CLAIM_TYPES = [
  "fee",
  "curriculum",
  "accreditation",
  "founding_year",
  "exam_result",
  "ranking",
  "governance",
  "student_count",
  "age_range",
  "other",
] as const;

export const VERDICTS = [
  "correct",
  "likely_correct",
  "incorrect",
  "outdated",
  "unclear",
  "unverifiable",
] as const;

export const SEVERITIES = ["high", "medium", "low", "none"] as const;

export const RUN_STATUSES = ["running", "completed", "failed"] as const;

// ─── Zod Schemas ─────────────────────────────────────

export const ExtractedClaimSchema = z.object({
  originalText: z.string().min(1),
  claimType: z.enum(CLAIM_TYPES),
  schoolSlug: z.string().nullable(),
  extractedValue: z.string().min(1),
});

export const ClaimExtractionResponseSchema = z.object({
  claims: z.array(ExtractedClaimSchema),
});

export const VerdictItemSchema = z.object({
  claimIndex: z.number().int().min(0),
  verdict: z.enum(VERDICTS),
  rationale: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export const VerdictResponseSchema = z.object({
  verdicts: z.array(VerdictItemSchema),
});

// ─── TypeScript Types ────────────────────────────────

export type ClaimType = (typeof CLAIM_TYPES)[number];
export type Verdict = (typeof VERDICTS)[number];
export type Severity = (typeof SEVERITIES)[number];
export type RunStatus = (typeof RUN_STATUSES)[number];

export type ExtractedClaim = z.infer<typeof ExtractedClaimSchema>;

export type CanonicalAnnotation = {
  canonicalValue: string | null;
  source: string | null;
  conflictDetected: boolean;
};

export type CrossArticleMatch = {
  slug: string;
  text: string;
  consistent: boolean;
};

export type AnnotatedClaim = ExtractedClaim & {
  claimIndex: number;
  canonical: CanonicalAnnotation;
  crossArticleMatches: CrossArticleMatch[];
};

export type JudgedClaim = AnnotatedClaim & {
  verdict: Verdict;
  severity: Severity;
  rationale: string;
  confidence: number;
  isjBiasApplied: boolean;
};

export type ReportClaim = {
  claimIndex: number;
  originalText: string;
  claimType: ClaimType;
  schoolSlug: string | null;
  issue: string;
  canonicalValue: string | null;
  verdict: Verdict;
  rationale: string;
  confidence: number;
};

export type ConsistencyWarning = {
  schoolSlug: string;
  field: string;
  values: { source: string; value: string }[];
};

export type FactCheckReport = {
  articleSlug: string;
  runId: string;
  timestamp: string;
  summary: {
    high: number;
    medium: number;
    low: number;
    correct: number;
    unverifiable: number;
  };
  highSeverity: ReportClaim[];
  mediumSeverity: ReportClaim[];
  lowSeverity: ReportClaim[];
  consistencyWarnings: ConsistencyWarning[];
  unverifiableClaims: ReportClaim[];
};

export type PipelineContext = {
  runId: string;
  articleSlug: string;
  articleText: string;
  articleHtml: string;
  startedAt: Date;
};
