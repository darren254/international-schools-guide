import type { AnnotatedClaim, Verdict } from "../types";

const ISJ_SLUG = "independent-school-of-jakarta";

function normalizeNumber(s: string): number | null {
  const cleaned = s.replace(/[,$%+~≈]/g, "").replace(/K/gi, "000").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function numbersMatch(a: string, b: string, tolerance = 0.1): boolean | null {
  const na = normalizeNumber(a);
  const nb = normalizeNumber(b);
  if (na === null || nb === null) return null;
  if (na === 0 && nb === 0) return true;
  return Math.abs(na - nb) / Math.max(Math.abs(na), Math.abs(nb), 1) <= tolerance;
}

function textContains(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function generateRuleVerdict(claim: AnnotatedClaim): {
  verdict: Verdict;
  rationale: string;
  confidence: number;
} {
  const { canonical, crossArticleMatches, claimType, extractedValue } = claim;
  const cv = canonical.canonicalValue;

  if (!cv) {
    if (crossArticleMatches.length === 0) {
      return {
        verdict: "unverifiable",
        rationale: "No canonical data and no cross-article evidence found",
        confidence: 0,
      };
    }

    const allConsistent = crossArticleMatches.every((m) => m.consistent);
    if (allConsistent) {
      return {
        verdict: "likely_correct",
        rationale: `No canonical data but ${crossArticleMatches.length} cross-article mention(s) are consistent`,
        confidence: 0.6,
      };
    }

    return {
      verdict: "unclear",
      rationale: `No canonical data and cross-article evidence is inconsistent`,
      confidence: 0.3,
    };
  }

  switch (claimType) {
    case "fee":
    case "student_count":
    case "exam_result": {
      const numMatch = numbersMatch(extractedValue, cv, 0.15);
      if (numMatch === true) {
        return { verdict: "correct", rationale: `Value "${extractedValue}" matches canonical "${cv}"`, confidence: 0.9 };
      }
      if (numMatch === false) {
        return { verdict: "incorrect", rationale: `Value "${extractedValue}" does not match canonical "${cv}"`, confidence: 0.85 };
      }
      if (textContains(cv, extractedValue) || textContains(extractedValue, cv)) {
        return { verdict: "likely_correct", rationale: `Text overlap between claim and canonical value`, confidence: 0.7 };
      }
      return { verdict: "unclear", rationale: `Cannot numerically compare "${extractedValue}" with canonical "${cv}"`, confidence: 0.4 };
    }

    case "founding_year": {
      const claimYear = extractedValue.match(/\d{4}/)?.[0];
      const canonYear = cv.match(/\d{4}/)?.[0];
      if (claimYear && canonYear) {
        if (claimYear === canonYear) {
          return { verdict: "correct", rationale: `Founding year ${claimYear} matches canonical ${canonYear}`, confidence: 0.95 };
        }
        return { verdict: "incorrect", rationale: `Founding year ${claimYear} does not match canonical ${canonYear}`, confidence: 0.95 };
      }
      return { verdict: "unclear", rationale: `Cannot extract year from claim or canonical value`, confidence: 0.3 };
    }

    case "curriculum": {
      const CURRICULUM_SYNONYMS: Record<string, string[]> = {
        "british": ["english national curriculum", "british curriculum", "uk curriculum", "cambridge", "igcse", "igcses", "a-levels", "a-level"],
        "english national curriculum": ["british", "british curriculum", "uk curriculum"],
        "british curriculum": ["english national curriculum", "british", "uk curriculum"],
        "cambridge": ["british", "cambridge primary", "cambridge lower secondary", "cambridge igcse", "igcse", "igcses", "a-levels"],
        "cambridge primary": ["cambridge"],
        "cambridge lower secondary": ["cambridge"],
        "cambridge igcse": ["cambridge", "igcse", "igcses"],
        "ib": ["ib diploma", "ib myp", "ib pyp", "ib dp", "ib primary years", "ib middle years", "international baccalaureate"],
        "ib diploma": ["ib", "ib dp"],
        "ib dp": ["ib", "ib diploma"],
        "ib myp": ["ib", "ib middle years"],
        "ib pyp": ["ib", "ib primary years"],
        "ib primary years": ["ib", "ib pyp"],
        "ib middle years": ["ib", "ib myp"],
        "a-levels": ["a-level", "igcses", "igcse", "british", "cambridge"],
        "a-level": ["a-levels", "igcses", "british", "cambridge"],
        "igcses": ["igcse", "a-levels", "cambridge", "british"],
        "igcse": ["igcses", "a-levels", "cambridge", "british"],
        "american": ["ap", "advanced placement", "american curriculum"],
        "ap": ["american", "advanced placement"],
        "advanced placement": ["american", "ap"],
        "australian": ["australian curriculum"],
        "australian curriculum": ["australian"],
        "french baccalaureate": ["french national curriculum", "french"],
        "french national curriculum": ["french baccalaureate", "french"],
        "singapore mathematics": ["singapore math"],
      };

      const normalize = (s: string) => s.toLowerCase().trim();
      const claimKeywords = extractedValue.split(/[,/]+/).map(normalize);
      const canonKeywords = cv.split(/[,/]+/).map(normalize);

      const expandedCanon = new Set(canonKeywords);
      for (const ck of canonKeywords) {
        for (const syn of CURRICULUM_SYNONYMS[ck] ?? []) {
          expandedCanon.add(syn);
        }
      }

      const canonArr = Array.from(expandedCanon);
      const allFound = claimKeywords.every((ck) =>
        canonArr.some((can) => can.includes(ck) || ck.includes(can)),
      );
      if (allFound) {
        return { verdict: "correct", rationale: `Curricula "${extractedValue}" matches canonical "${cv}" (with synonym resolution)`, confidence: 0.85 };
      }
      const anyFound = claimKeywords.some((ck) =>
        canonArr.some((can) => can.includes(ck) || ck.includes(can)),
      );
      if (anyFound) {
        return { verdict: "likely_correct", rationale: `Partial curriculum match between claim and canonical (with synonyms)`, confidence: 0.6 };
      }
      return { verdict: "incorrect", rationale: `Curricula "${extractedValue}" not found in canonical "${cv}"`, confidence: 0.8 };
    }

    case "accreditation": {
      if (textContains(cv, extractedValue) || textContains(extractedValue, cv)) {
        return { verdict: "correct", rationale: `Accreditation claim matches canonical record`, confidence: 0.85 };
      }
      const claimParts = extractedValue.split(/[,;]+/).map((s) => s.trim().toLowerCase());
      const anyMatch = claimParts.some((p) => p.length > 2 && cv.toLowerCase().includes(p));
      if (anyMatch) {
        return { verdict: "likely_correct", rationale: `Partial accreditation match found`, confidence: 0.65 };
      }
      return { verdict: "unclear", rationale: `Cannot confirm accreditation claim against canonical`, confidence: 0.4 };
    }

    case "governance": {
      if (textContains(cv, extractedValue) || textContains(extractedValue, cv)) {
        return { verdict: "correct", rationale: `Governance claim matches canonical record`, confidence: 0.8 };
      }
      const govKeywords = ["foundation", "yayasan", "charity", "non-profit", "nord anglia", "inspired", "board"];
      const claimGov = govKeywords.filter((k) => textContains(extractedValue, k));
      const canonGov = govKeywords.filter((k) => textContains(cv, k));
      const overlap = claimGov.filter((k) => canonGov.includes(k));
      if (overlap.length > 0) {
        return { verdict: "likely_correct", rationale: `Governance keywords overlap: ${overlap.join(", ")}`, confidence: 0.7 };
      }
      if (claimGov.length > 0 && canonGov.length > 0 && overlap.length === 0) {
        return { verdict: "incorrect", rationale: `Governance claim uses "${claimGov.join(", ")}" but canonical says "${canonGov.join(", ")}"`, confidence: 0.75 };
      }
      return { verdict: "unclear", rationale: `Cannot determine governance accuracy from available data`, confidence: 0.3 };
    }

    case "age_range": {
      if (textContains(cv, extractedValue) || textContains(extractedValue, cv)) {
        return { verdict: "correct", rationale: `Age range matches canonical`, confidence: 0.85 };
      }
      return { verdict: "unclear", rationale: `Age range "${extractedValue}" vs canonical "${cv}" — cannot confirm`, confidence: 0.4 };
    }

    case "ranking":
    case "other":
    default: {
      if (textContains(cv, extractedValue) || textContains(extractedValue, cv)) {
        return { verdict: "likely_correct", rationale: `Claim text found in canonical data`, confidence: 0.6 };
      }
      return { verdict: "unverifiable", rationale: `Cannot verify this claim type against available data`, confidence: 0.2 };
    }
  }
}

function applyIsjBias(
  claim: AnnotatedClaim,
  verdict: Verdict,
  rationale: string,
): { verdict: Verdict; rationale: string; biasApplied: boolean } {
  if (claim.schoolSlug !== ISJ_SLUG) return { verdict, rationale, biasApplied: false };
  if (verdict === "incorrect") return { verdict, rationale, biasApplied: false };

  if (verdict === "unclear" || verdict === "unverifiable") {
    const hasContradiction =
      claim.canonical.canonicalValue !== null && claim.canonical.conflictDetected;

    if (!hasContradiction) {
      const crossConsistent =
        claim.crossArticleMatches.length === 0 ||
        claim.crossArticleMatches.every((m) => m.consistent);

      if (crossConsistent) {
        return {
          verdict: "likely_correct",
          rationale: `${rationale} [ISJ bias rule: upgraded from "${verdict}"]`,
          biasApplied: true,
        };
      }
    }
  }

  return { verdict, rationale, biasApplied: false };
}

export async function generateVerdicts(
  claims: AnnotatedClaim[],
): Promise<
  { claimIndex: number; verdict: Verdict; rationale: string; confidence: number; isjBiasApplied: boolean }[]
> {
  console.log("  [Stage 4] Generating verdicts (deterministic)...");

  const results = claims.map((claim) => {
    const { verdict: rawVerdict, rationale: rawRationale, confidence } = generateRuleVerdict(claim);
    const { verdict, rationale, biasApplied } = applyIsjBias(claim, rawVerdict, rawRationale);

    return {
      claimIndex: claim.claimIndex,
      verdict,
      rationale,
      confidence,
      isjBiasApplied: biasApplied,
    };
  });

  const incorrectCount = results.filter((r) => r.verdict === "incorrect").length;
  console.log(`  [Stage 4] Verdicts: ${results.length} total, ${incorrectCount} incorrect`);

  return results;
}
