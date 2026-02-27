import type {
  JudgedClaim,
  ConsistencyWarning,
  FactCheckReport,
  ReportClaim,
} from "../types";

function toReportClaim(claim: JudgedClaim): ReportClaim {
  let issue = "";
  if (claim.verdict === "incorrect") {
    issue = claim.canonical.canonicalValue
      ? `Claim states "${claim.extractedValue}" but canonical record shows "${claim.canonical.canonicalValue}"`
      : `Claim "${claim.extractedValue}" contradicted by cross-article evidence`;
  } else if (claim.verdict === "outdated") {
    issue = `Value "${claim.extractedValue}" appears outdated; canonical record shows "${claim.canonical.canonicalValue ?? "unknown"}"`;
  } else if (claim.verdict === "unclear") {
    issue = "Conflicting evidence found";
  } else if (claim.verdict === "unverifiable") {
    issue = "No canonical data or cross-article evidence available";
  }

  return {
    claimIndex: claim.claimIndex,
    originalText: claim.originalText,
    claimType: claim.claimType,
    schoolSlug: claim.schoolSlug,
    issue,
    canonicalValue: claim.canonical.canonicalValue,
    verdict: claim.verdict,
    rationale: claim.rationale,
    confidence: claim.confidence,
  };
}

export function buildReport(
  articleSlug: string,
  runId: string,
  claims: JudgedClaim[],
  warnings: ConsistencyWarning[],
): FactCheckReport {
  console.log("  [Stage 6] Building report...");

  const high = claims.filter((c) => c.severity === "high");
  const medium = claims.filter((c) => c.severity === "medium");
  const low = claims.filter((c) => c.severity === "low");
  const correct = claims.filter(
    (c) => c.verdict === "correct" || c.verdict === "likely_correct",
  );
  const unverifiable = claims.filter(
    (c) => c.verdict === "unverifiable" || c.verdict === "unclear",
  );

  return {
    articleSlug,
    runId,
    timestamp: new Date().toISOString(),
    summary: {
      high: high.length,
      medium: medium.length,
      low: low.length,
      correct: correct.length,
      unverifiable: unverifiable.length,
    },
    highSeverity: high.map(toReportClaim),
    mediumSeverity: medium.map(toReportClaim),
    lowSeverity: low.map(toReportClaim),
    consistencyWarnings: warnings,
    unverifiableClaims: unverifiable.map(toReportClaim),
  };
}
