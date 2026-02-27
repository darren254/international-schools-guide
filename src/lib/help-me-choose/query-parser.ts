import { JAKARTA_SCHOOLS, getLocationFilter, getCurriculumFilterLabels } from "@/data/jakarta-schools";
import { getFeeDisplay, extractLowestFee, extractHighestFee, hasPublishableFee } from "@/lib/utils/fees";

export type SchoolResult = {
  slug: string;
  name: string;
  area: string;
  curricula: string[];
  curriculumLabels: string[];
  feeDisplay: string;
  feeHigh: number;
  feeLow: number;
  ageRange: string;
  studentCount: string;
  ibAverage: string;
};

export type ParsedQuery = {
  curricula: string[];
  locations: string[];
  maxFee: number | null;
  minFee: number | null;
  ageGroup: "primary" | "secondary" | "all";
  sortBy: "fees_asc" | "fees_desc" | "ib" | "relevance";
  summary: string;
};

const CURRICULUM_KEYWORDS: Record<string, string[]> = {
  "IB": ["ib", "international baccalaureate", "ib diploma", "ibdp", "pyp", "myp"],
  "British / Cambridge": ["british", "cambridge", "igcse", "gcse", "a-level", "a level", "english national", "uk curriculum"],
  "Australian": ["australian", "aussie"],
  "American / AP": ["american", "ap ", "us curriculum", "advanced placement"],
  "Singapore": ["singapore", "singaporean"],
  "French": ["french", "lycee", "lycée"],
  "New Zealand": ["new zealand", "nz curriculum"],
};

const LOCATION_KEYWORDS: Record<string, string[]> = {
  "South": ["south jakarta", "south", "kemang", "cipete", "cilandak", "pondok indah", "kebayoran"],
  "Central": ["central jakarta", "central", "menteng", "kuningan", "sudirman"],
  "North": ["north jakarta", "north", "kelapa gading", "pantai indah kapuk", "pik"],
  "East": ["east jakarta", "east"],
  "West": ["west jakarta", "west"],
  "Outside Jakarta": ["bsd", "serpong", "tangerang", "bintaro", "greater jakarta", "outside"],
};

export function parseQuery(raw: string): ParsedQuery {
  const q = raw.toLowerCase().trim();

  const curricula: string[] = [];
  for (const [label, keywords] of Object.entries(CURRICULUM_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      curricula.push(label);
    }
  }

  const locations: string[] = [];
  for (const [label, keywords] of Object.entries(LOCATION_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      locations.push(label);
    }
  }

  let maxFee: number | null = null;
  const underMatch = q.match(/under\s+\$?([\d,.]+)\s*k?/i);
  if (underMatch) {
    const val = parseFloat(underMatch[1].replace(/,/g, ""));
    maxFee = val < 100 ? val * 1000 : val;
  }
  const belowMatch = q.match(/below\s+\$?([\d,.]+)\s*k?/i);
  if (belowMatch) {
    const val = parseFloat(belowMatch[1].replace(/,/g, ""));
    maxFee = val < 100 ? val * 1000 : val;
  }

  let minFee: number | null = null;
  const overMatch = q.match(/(?:over|above|more than)\s+\$?([\d,.]+)\s*k?/i);
  if (overMatch) {
    const val = parseFloat(overMatch[1].replace(/,/g, ""));
    minFee = val < 100 ? val * 1000 : val;
  }

  let ageGroup: "primary" | "secondary" | "all" = "all";
  if (/secondary|high school|senior|year 7|year 8|year 9|year 10|year 11|year 12|teenager/.test(q)) {
    ageGroup = "secondary";
  } else if (/primary|elementary|junior|kindergarten|pre-?school|nursery|early years/.test(q)) {
    ageGroup = "primary";
  }

  let sortBy: ParsedQuery["sortBy"] = "relevance";
  if (/cheapest|affordable|lowest fee|budget/.test(q)) sortBy = "fees_asc";
  if (/expensive|premium|highest fee|top fee/.test(q)) sortBy = "fees_desc";
  if (/best ib|highest ib|ib result|ib score|ib average/.test(q)) sortBy = "ib";

  const parts: string[] = [];
  const count = "matching";
  if (curricula.length > 0) parts.push(curricula.join(" and ") + " curriculum");
  if (locations.length > 0) parts.push("in " + locations.join(" or "));
  if (maxFee) parts.push(`under $${(maxFee / 1000).toFixed(0)}K/year`);
  if (minFee) parts.push(`over $${(minFee / 1000).toFixed(0)}K/year`);
  const summary = parts.length > 0
    ? `I found ${count} ${parts.join(", ")} schools in Jakarta.`
    : "Here are all international schools in Jakarta.";

  return { curricula, locations, maxFee, minFee, ageGroup, sortBy, summary };
}

export function searchSchools(query: ParsedQuery): SchoolResult[] {
  let results = JAKARTA_SCHOOLS.map((s) => {
    const feeDisplay = getFeeDisplay(s.feeRange, s.slug);
    const ibEntry = s.examResults.find((r) => r.label === "IB Average");
    return {
      slug: s.slug,
      name: s.name,
      area: s.area,
      curricula: s.curricula,
      curriculumLabels: getCurriculumFilterLabels(s.curricula),
      feeDisplay,
      feeHigh: extractHighestFee(feeDisplay) * 1000,
      feeLow: extractLowestFee(feeDisplay) * 1000,
      ageRange: s.ageRange,
      studentCount: s.studentCount,
      ibAverage: ibEntry?.value ?? "",
    };
  });

  if (query.curricula.length > 0) {
    results = results.filter((s) =>
      query.curricula.some((c) => s.curriculumLabels.includes(c))
    );
  }

  if (query.locations.length > 0) {
    results = results.filter((s) =>
      query.locations.includes(getLocationFilter(s.area))
    );
  }

  if (query.maxFee !== null) {
    const max = query.maxFee;
    results = results.filter((s) => {
      if (!hasPublishableFee(s.feeDisplay)) return false;
      return s.feeLow <= max;
    });
  }

  if (query.minFee !== null) {
    const min = query.minFee;
    results = results.filter((s) => {
      if (!hasPublishableFee(s.feeDisplay)) return false;
      return s.feeHigh >= min;
    });
  }

  switch (query.sortBy) {
    case "fees_asc":
      results.sort((a, b) => {
        if (!hasPublishableFee(a.feeDisplay)) return 1;
        if (!hasPublishableFee(b.feeDisplay)) return -1;
        return a.feeLow - b.feeLow;
      });
      break;
    case "fees_desc":
      results.sort((a, b) => {
        if (!hasPublishableFee(a.feeDisplay)) return 1;
        if (!hasPublishableFee(b.feeDisplay)) return -1;
        return b.feeHigh - a.feeHigh;
      });
      break;
    case "ib":
      results.sort((a, b) => {
        const aIb = a.ibAverage ? parseFloat(a.ibAverage) : 0;
        const bIb = b.ibAverage ? parseFloat(b.ibAverage) : 0;
        return bIb - aIb;
      });
      break;
    default:
      results.sort((a, b) => {
        if (!hasPublishableFee(a.feeDisplay)) return 1;
        if (!hasPublishableFee(b.feeDisplay)) return -1;
        return b.feeHigh - a.feeHigh;
      });
  }

  return results;
}
