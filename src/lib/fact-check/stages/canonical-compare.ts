import { SCHOOL_PROFILES, EXCHANGE_RATE } from "@/data/schools";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import type {
  ExtractedClaim,
  AnnotatedClaim,
  CanonicalAnnotation,
  ClaimType,
  ConsistencyWarning,
} from "../types";

function findProfile(slug: string) {
  return SCHOOL_PROFILES[slug] ?? null;
}

function findListing(slug: string) {
  return JAKARTA_SCHOOLS.find((s) => s.slug === slug) ?? null;
}

function formatIdr(amount: number): string {
  const usd = Math.round(amount / EXCHANGE_RATE);
  return `US$${usd.toLocaleString()}`;
}

function lookupCanonical(
  claim: ExtractedClaim,
): CanonicalAnnotation & { listingValue?: string } {
  const noData: CanonicalAnnotation & { listingValue?: string } = {
    canonicalValue: null,
    source: null,
    conflictDetected: false,
  };

  if (!claim.schoolSlug) return noData;

  const profile = findProfile(claim.schoolSlug);
  const listing = findListing(claim.schoolSlug);

  if (!profile && !listing) return noData;

  const type = claim.claimType as ClaimType;

  switch (type) {
    case "fee": {
      const profileFees = profile?.fees;
      if (profileFees && profileFees.rows.length > 0) {
        const lowest = Math.min(...profileFees.rows.map((r) => r.totalStandard || r.tuition));
        const highest = Math.max(...profileFees.rows.map((r) => r.totalStandard || r.tuition));
        const profileRange = `${formatIdr(lowest)} – ${formatIdr(highest)}`;
        const listingRange = listing?.feeRange ?? null;
        return {
          canonicalValue: profileRange,
          source: "SCHOOL_PROFILES.fees.rows",
          conflictDetected: false,
          listingValue: listingRange ?? undefined,
        };
      }
      if (listing?.feeRange) {
        return {
          canonicalValue: listing.feeRange,
          source: "JAKARTA_SCHOOLS.feeRange",
          conflictDetected: false,
        };
      }
      return noData;
    }

    case "curriculum": {
      const profileCurricula = profile?.curricula;
      const listingCurricula = listing?.curricula;
      if (profileCurricula && profileCurricula.length > 0) {
        return {
          canonicalValue: profileCurricula.join(", "),
          source: "SCHOOL_PROFILES.curricula",
          conflictDetected: false,
          listingValue: listingCurricula?.join(", ") ?? undefined,
        };
      }
      if (listingCurricula && listingCurricula.length > 0) {
        return {
          canonicalValue: listingCurricula.join(", "),
          source: "JAKARTA_SCHOOLS.curricula",
          conflictDetected: false,
        };
      }
      return noData;
    }

    case "accreditation": {
      const inspection = profile?.studentBody?.inspection;
      if (inspection) {
        return {
          canonicalValue: `${inspection.body} — ${inspection.rating} (${inspection.date})`,
          source: "SCHOOL_PROFILES.studentBody.inspection",
          conflictDetected: false,
        };
      }
      return noData;
    }

    case "founding_year": {
      const foundingDate = profile?.jsonLd?.foundingDate;
      if (foundingDate) {
        return {
          canonicalValue: foundingDate,
          source: "SCHOOL_PROFILES.jsonLd.foundingDate",
          conflictDetected: false,
        };
      }
      return noData;
    }

    case "exam_result": {
      const results = profile?.academics?.results;
      if (results && results.length > 0) {
        const formatted = results.map((r) => `${r.label}: ${r.value}`).join("; ");
        return {
          canonicalValue: formatted,
          source: "SCHOOL_PROFILES.academics.results",
          conflictDetected: false,
        };
      }
      const listingResults = listing?.examResults;
      if (listingResults && listingResults.length > 0) {
        const formatted = listingResults.map((r) => `${r.label}: ${r.value}`).join("; ");
        return {
          canonicalValue: formatted,
          source: "JAKARTA_SCHOOLS.examResults",
          conflictDetected: false,
        };
      }
      return noData;
    }

    case "student_count": {
      const stat = profile?.stats?.find(
        (s: { label: string; value: string }) => s.label.toLowerCase().includes("student"),
      );
      if (stat) {
        return {
          canonicalValue: stat.value,
          source: "SCHOOL_PROFILES.stats",
          conflictDetected: false,
          listingValue: listing?.studentCount ?? undefined,
        };
      }
      if (listing?.studentCount) {
        return {
          canonicalValue: listing.studentCount,
          source: "JAKARTA_SCHOOLS.studentCount",
          conflictDetected: false,
        };
      }
      return noData;
    }

    case "age_range": {
      if (listing?.ageRange) {
        return {
          canonicalValue: listing.ageRange,
          source: "JAKARTA_SCHOOLS.ageRange",
          conflictDetected: false,
        };
      }
      return noData;
    }

    case "governance": {
      const paragraphs = profile?.intelligence?.paragraphs;
      if (paragraphs && paragraphs.length > 0) {
        const ownershipMention = paragraphs.find(
          (p) =>
            p.toLowerCase().includes("owned") ||
            p.toLowerCase().includes("foundation") ||
            p.toLowerCase().includes("yayasan") ||
            p.toLowerCase().includes("non-profit") ||
            p.toLowerCase().includes("charity"),
        );
        if (ownershipMention) {
          return {
            canonicalValue: ownershipMention,
            source: "SCHOOL_PROFILES.intelligence.paragraphs",
            conflictDetected: false,
          };
        }
      }
      return noData;
    }

    case "ranking":
    case "other":
    default:
      return noData;
  }
}

export function compareCanonical(
  claims: ExtractedClaim[],
): { annotated: AnnotatedClaim[]; warnings: ConsistencyWarning[] } {
  console.log("  [Stage 2] Comparing against canonical records...");

  const warnings: ConsistencyWarning[] = [];
  const annotated: AnnotatedClaim[] = claims.map((claim, i) => {
    const result = lookupCanonical(claim);

    if (result.listingValue && result.canonicalValue && result.source?.startsWith("SCHOOL_PROFILES")) {
      const profileVal = result.canonicalValue.toLowerCase().replace(/\s/g, "");
      const listingVal = result.listingValue.toLowerCase().replace(/\s/g, "");
      if (profileVal !== listingVal) {
        result.conflictDetected = true;
        warnings.push({
          schoolSlug: claim.schoolSlug!,
          field: claim.claimType,
          values: [
            { source: result.source!, value: result.canonicalValue },
            { source: "JAKARTA_SCHOOLS", value: result.listingValue },
          ],
        });
      }
    }

    return {
      ...claim,
      claimIndex: i,
      canonical: {
        canonicalValue: result.canonicalValue,
        source: result.source,
        conflictDetected: result.conflictDetected,
      },
      crossArticleMatches: [],
    };
  });

  const withCanonical = annotated.filter((c) => c.canonical.canonicalValue !== null).length;
  console.log(`  [Stage 2] ${withCanonical}/${annotated.length} claims matched to canonical data`);

  return { annotated, warnings };
}
