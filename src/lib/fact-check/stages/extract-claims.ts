import { load as loadHtml } from "cheerio";
import { SCHOOL_PROFILES } from "@/data/schools";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import type { ExtractedClaim, PipelineContext, ClaimType } from "../types";

function htmlToPlainText(html: string): string {
  const $ = loadHtml(html);
  $("script, style, nav, footer, header").remove();
  $("table").each((_, el) => {
    const rows: string[] = [];
    $(el)
      .find("tr")
      .each((_, tr) => {
        const cells: string[] = [];
        $(tr)
          .find("th, td")
          .each((_, td) => {
            cells.push($(td).text().trim());
          });
        rows.push(cells.join(" | "));
      });
    $(el).replaceWith(rows.join("\n"));
  });
  return $.text().replace(/\s+/g, " ").trim();
}

type SchoolRef = { slug: string; name: string; aliases: string[] };

const SCHOOL_ABBREVIATIONS: Record<string, string[]> = {
  "jakarta-intercultural-school": ["JIS", "Jakarta Intercultural School", "Jakarta Intercultural"],
  "british-school-jakarta": ["BSJ", "British School Jakarta", "British School"],
  "independent-school-of-jakarta": ["ISJ", "Independent School of Jakarta", "The Independent School"],
  "australian-independent-school-jakarta": ["AIS", "Australian Independent School"],
  "acg-school-jakarta": ["ACG", "ACG School Jakarta", "ACG School"],
  "mentari-intercultural-school-jakarta": ["Mentari", "Mentari Intercultural"],
  "sekolah-pelita-harapan": ["SPH", "Pelita Harapan"],
  "global-jaya-school": ["Global Jaya"],
  "binus-school-serpong": ["BINUS", "Binus"],
  "sinarmas-world-academy": ["SWA", "Sinarmas"],
  "nord-anglia-school-jakarta": ["Nord Anglia", "NASJ"],
  "gandhi-memorial-international-school": ["Gandhi Memorial", "GMIS"],
  "tunas-muda-school": ["Tunas Muda"],
  "btb-school": ["BTB"],
  "sekolah-pelita-harapan-kemang-village": ["SPH Kemang"],
  "new-zealand-school-jakarta": ["NZS", "New Zealand School"],
  "jakarta-nanyang-school": ["Nanyang"],
};

function buildSchoolIndex(): SchoolRef[] {
  const refs: SchoolRef[] = [];
  for (const [slug, profile] of Object.entries(SCHOOL_PROFILES)) {
    const aliases = [
      profile.name,
      profile.shortName,
      ...(SCHOOL_ABBREVIATIONS[slug] ?? []),
    ];
    refs.push({ slug, name: profile.name, aliases });
  }
  for (const listing of JAKARTA_SCHOOLS) {
    if (!refs.some((r) => r.slug === listing.slug)) {
      const aliases = [
        listing.name,
        ...(SCHOOL_ABBREVIATIONS[listing.slug] ?? []),
      ];
      refs.push({ slug: listing.slug, name: listing.name, aliases });
    }
  }
  return refs;
}

function findSchoolInText(text: string, schools: SchoolRef[]): SchoolRef | null {
  const lower = text.toLowerCase();
  for (const school of schools) {
    for (const alias of school.aliases) {
      if (alias.length < 3) continue;
      if (alias.length <= 4) {
        const re = new RegExp(`\\b${alias}\\b`, "i");
        if (re.test(text)) return school;
      } else {
        if (lower.includes(alias.toLowerCase())) return school;
      }
    }
  }
  return null;
}

const FEE_PATTERNS = [
  /(?:US?\$|USD)\s*[\d,]+(?:\.\d+)?(?:\s*[–-]\s*(?:US?\$|USD)?\s*[\d,]+(?:\.\d+)?)?(?:\s*(?:\/\s*year|per\s*year|annually|p\.a\.))?/gi,
  /\$[\d,]+(?:\.\d+)?(?:K)?(?:\s*[–-]\s*\$[\d,]+(?:\.\d+)?(?:K)?)/gi,
  /(?:fees?|tuition|cost)\s+(?:of\s+)?(?:approximately\s+)?(?:US?\$|USD)\s*[\d,]+/gi,
];

const YEAR_PATTERNS = [
  /(?:founded|established|opened|since)\s+(?:in\s+)?(\d{4})/gi,
  /(?:in|since)\s+(\d{4})\s+(?:with|by|as|to)/gi,
];

const STUDENT_COUNT_PATTERNS = [
  /(?:approximately|about|around|~|roughly)?\s*(\d[\d,]*)\+?\s*(?:students|pupils|children|learners)/gi,
  /(?:student(?:s)?|enrol(?:l)?ment)\s+(?:of\s+)?(?:approximately\s+)?(\d[\d,]*)\+?/gi,
];

const EXAM_PATTERNS = [
  /(?:IB|diploma)\s+(?:average|mean|score)\s+(?:of\s+)?(\d+\.?\d*)/gi,
  /(?:average|mean)\s+(?:IB|diploma)\s+(?:score\s+)?(?:of\s+)?(\d+\.?\d*)/gi,
  /(\d+\.?\d*)\s+(?:IB|diploma)\s+(?:average|mean|point)/gi,
  /(?:pass\s+rate)\s+(?:of\s+)?(\d+\.?\d*)%/gi,
];

const CURRICULUM_KEYWORDS = [
  "IB", "IB PYP", "IB MYP", "IB Diploma", "IB DP",
  "A-Levels", "A-Level", "IGCSEs", "IGCSE",
  "British", "English National Curriculum",
  "American", "AP", "Advanced Placement",
  "Australian", "Cambridge", "Montessori",
];

const ACCREDITATION_KEYWORDS = [
  "CIS", "WASC", "BSO", "COBIS", "NEASC", "IBO",
  "accredited", "accreditation", "inspected",
];

const GOVERNANCE_KEYWORDS = [
  "owned by", "managed by", "part of", "operated by",
  "non-profit", "not-for-profit", "foundation", "yayasan",
  "charity", "private equity", "Nord Anglia", "Inspired",
  "board of governors", "shareholders",
];

function extractSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
}

function classifyClaim(sentence: string): ClaimType | null {
  const lower = sentence.toLowerCase();

  for (const p of FEE_PATTERNS) {
    p.lastIndex = 0;
    if (p.test(sentence)) return "fee";
  }

  for (const p of YEAR_PATTERNS) {
    p.lastIndex = 0;
    if (p.test(sentence)) return "founding_year";
  }

  for (const p of STUDENT_COUNT_PATTERNS) {
    p.lastIndex = 0;
    if (p.test(sentence)) return "student_count";
  }

  for (const p of EXAM_PATTERNS) {
    p.lastIndex = 0;
    if (p.test(sentence)) return "exam_result";
  }

  if (GOVERNANCE_KEYWORDS.some((k) => lower.includes(k.toLowerCase()))) return "governance";
  if (ACCREDITATION_KEYWORDS.some((k) => lower.includes(k.toLowerCase()))) return "accreditation";

  if (lower.includes("age range") || lower.includes("ages ") || /\bage\s+\d/.test(lower)) return "age_range";

  const hasCurriculum = CURRICULUM_KEYWORDS.some((k) => sentence.includes(k));
  if (hasCurriculum && (lower.includes("offer") || lower.includes("curriculum") || lower.includes("programme") || lower.includes("program"))) {
    return "curriculum";
  }

  return null;
}

function extractValue(sentence: string, claimType: ClaimType): string {
  switch (claimType) {
    case "fee": {
      for (const p of FEE_PATTERNS) {
        p.lastIndex = 0;
        const m = p.exec(sentence);
        if (m) return m[0];
      }
      return sentence.slice(0, 100);
    }
    case "founding_year": {
      for (const p of YEAR_PATTERNS) {
        p.lastIndex = 0;
        const m = p.exec(sentence);
        if (m) return m[1];
      }
      return sentence.slice(0, 100);
    }
    case "student_count": {
      for (const p of STUDENT_COUNT_PATTERNS) {
        p.lastIndex = 0;
        const m = p.exec(sentence);
        if (m) return m[1] || m[0];
      }
      return sentence.slice(0, 100);
    }
    case "exam_result": {
      for (const p of EXAM_PATTERNS) {
        p.lastIndex = 0;
        const m = p.exec(sentence);
        if (m) return m[0];
      }
      return sentence.slice(0, 100);
    }
    case "curriculum": {
      const found = CURRICULUM_KEYWORDS.filter((k) => sentence.includes(k));
      return found.length > 0 ? found.join(", ") : sentence.slice(0, 100);
    }
    case "accreditation": {
      const found = ACCREDITATION_KEYWORDS.filter((k) => sentence.toLowerCase().includes(k.toLowerCase()));
      return found.length > 0 ? found.join(", ") : sentence.slice(0, 100);
    }
    case "governance":
    case "age_range":
    case "ranking":
    case "other":
    default:
      return sentence.slice(0, 150);
  }
}

export async function extractClaims(
  ctx: PipelineContext,
): Promise<ExtractedClaim[]> {
  console.log("  [Stage 1] Extracting claims (deterministic)...");

  const plainText = htmlToPlainText(ctx.articleHtml);
  const sentences = extractSentences(plainText);
  const schools = buildSchoolIndex();
  const claims: ExtractedClaim[] = [];
  const seen = new Set<string>();

  const COMPARATIVE_SIGNALS = [
    "vs", "versus", "compared to", "see our guide",
    "for a deeper explanation", "for more on",
  ];

  for (const sentence of sentences) {
    const claimType = classifyClaim(sentence);
    if (!claimType) continue;

    const school = findSchoolInText(sentence, schools);
    const value = extractValue(sentence, claimType);

    if (claimType === "curriculum" && COMPARATIVE_SIGNALS.some((s) => sentence.toLowerCase().includes(s))) {
      continue;
    }

    const dedupeKey = `${school?.slug ?? "general"}:${claimType}:${value.slice(0, 50)}`;

    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    claims.push({
      originalText: sentence.slice(0, 500),
      claimType,
      schoolSlug: school?.slug ?? null,
      extractedValue: value,
    });
  }

  console.log(`  [Stage 1] Extracted ${claims.length} claims from ${sentences.length} sentences`);
  return claims;
}
