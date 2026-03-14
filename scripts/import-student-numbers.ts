/**
 * Import student enrolment data from the research Excel file.
 *
 * Reads all_cities_student_numbers.xlsx, matches schools to slugs,
 * picks a best estimate, selects top sources, and writes data/student-numbers.json.
 *
 * Usage: npx tsx scripts/import-student-numbers.ts [path-to-xlsx]
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RawRow = {
  city: string | null;
  school: string | null;
  value: string | null;
  date: string | null;
  source: string | null;
};

type ParsedSource = {
  rawValue: string;
  numeric: number;
  date: string | null;
  source: string;
  authorityScore: number;
  recencyScore: number;
};

type SchoolEntry = {
  city: string;
  schoolName: string;
  sources: ParsedSource[];
};

type OutputEntry = {
  bestEstimate: number;
  display: string;
  isApproximate: boolean;
  sourceCount: number;
  topSources: { value: string; date: string | null; source: string }[];
};

// ---------------------------------------------------------------------------
// Source authority ranking (higher = more authoritative)
// ---------------------------------------------------------------------------

const AUTHORITY_PATTERNS: [RegExp, number][] = [
  [/inspection report|khda|dsib|ofsted|moe/i, 10],
  [/school website|official|school.*page|school.*about/i, 9],
  [/school.*handbook|school.*profile/i, 8],
  [/wikipedia/i, 5],
  [/international schools? (database|guide)/i, 6],
  [/teacher horizons|schrole/i, 6],
  [/whichschooladvisor|ischooladvisor/i, 5],
  [/edarabia|education destination/i, 4],
  [/linkedin/i, 3],
  [/facebook|instagram/i, 2],
];

function getAuthorityScore(source: string): number {
  for (const [pattern, score] of AUTHORITY_PATTERNS) {
    if (pattern.test(source)) return score;
  }
  return 4;
}

// ---------------------------------------------------------------------------
// Date parsing — extract a year for recency scoring
// ---------------------------------------------------------------------------

function parseYear(dateStr: string | null): number {
  if (!dateStr) return 0;
  const m = String(dateStr).match(/(\d{4})/);
  return m ? parseInt(m[1]) : 0;
}

function getRecencyScore(dateStr: string | null): number {
  const year = parseYear(dateStr);
  if (year === 0) return 0;
  if (year >= 2025) return 10;
  if (year >= 2024) return 8;
  if (year >= 2023) return 6;
  if (year >= 2022) return 4;
  if (year >= 2020) return 2;
  return 1;
}

// ---------------------------------------------------------------------------
// Parse a numeric value from messy strings
// ---------------------------------------------------------------------------

/** Subset/non-total indicators — these values should be deprioritised */
const SUBSET_PATTERN = /high school|middle school|elementary|primary|secondary|graduating class|campus capacity|capacity|boarders|spm candidates|ib students|group total|peak/i;

function isSubsetValue(raw: string): boolean {
  return SUBSET_PATTERN.test(raw);
}

function parseNumeric(raw: string): number {
  if (!raw) return 0;
  const s = raw.replace(/,/g, "").trim();

  if (/not found|n\/a|contact/i.test(s)) return 0;

  // Look for "total" number if present (e.g. "2200 total")
  const totalMatch = s.match(/(\d+)\s*total/i);
  if (totalMatch) return parseFloat(totalMatch[1]);

  const m = s.match(/(\d+(?:\.\d+)?)/);
  if (!m) return 0;

  const n = parseFloat(m[1]);
  // Ignore numbers that are clearly years (1900-2030)
  if (n >= 1900 && n <= 2030) {
    const rest = s.slice(s.indexOf(m[1]) + m[1].length);
    const m2 = rest.match(/(\d+(?:\.\d+)?)/);
    if (m2) return parseFloat(m2[1]);
    return 0;
  }

  return n;
}

// ---------------------------------------------------------------------------
// Friendly display number
// ---------------------------------------------------------------------------

function friendlyNumber(n: number): { display: string; isApproximate: boolean } {
  if (n <= 0) return { display: "-", isApproximate: false };
  if (n < 100) return { display: n.toLocaleString("en-US"), isApproximate: false };
  if (n < 1000) {
    const rounded = Math.round(n / 50) * 50;
    const isApprox = rounded !== n;
    return {
      display: isApprox ? `~${rounded.toLocaleString("en-US")}` : n.toLocaleString("en-US"),
      isApproximate: isApprox,
    };
  }
  const rounded = Math.round(n / 100) * 100;
  const isApprox = rounded !== n;
  return {
    display: isApprox ? `~${rounded.toLocaleString("en-US")}` : n.toLocaleString("en-US"),
    isApproximate: isApprox,
  };
}

// ---------------------------------------------------------------------------
// Pick best estimate from sources
// ---------------------------------------------------------------------------

function pickBestEstimate(sources: ParsedSource[]): number {
  const valid = sources.filter((s) => s.numeric > 0);
  if (valid.length === 0) return 0;
  if (valid.length === 1) return valid[0].numeric;

  // Score each source: authority + recency
  const scored = valid
    .map((s) => ({ ...s, totalScore: s.authorityScore + s.recencyScore }))
    .sort((a, b) => b.totalScore - a.totalScore || b.numeric - a.numeric);

  // If top source has both high authority and recency, use it
  if (scored[0].totalScore >= 12) return scored[0].numeric;

  // If sources broadly agree (within 30% of median), use the top-scored one
  const nums = valid.map((s) => s.numeric).sort((a, b) => a - b);
  const median = nums[Math.floor(nums.length / 2)];
  const topNum = scored[0].numeric;
  if (Math.abs(topNum - median) / median < 0.3) return topNum;

  // Sources disagree — use median
  return median;
}

// ---------------------------------------------------------------------------
// Select top 3 sources for popover
// ---------------------------------------------------------------------------

function selectTopSources(sources: ParsedSource[]): { value: string; date: string | null; source: string }[] {
  const valid = sources.filter((s) => s.numeric > 0);
  const scored = valid
    .map((s) => ({ ...s, totalScore: s.authorityScore + s.recencyScore }))
    .sort((a, b) => b.totalScore - a.totalScore);

  return scored.slice(0, 3).map((s) => ({
    value: s.rawValue,
    date: s.date,
    source: s.source,
  }));
}

// ---------------------------------------------------------------------------
// Slug matching
// ---------------------------------------------------------------------------

function buildSlugIndex(profilesPath: string): Map<string, string> {
  // We need to import dynamically since this is a TS file
  // Instead, read the compiled school names from a quick extraction
  const index = new Map<string, string>();
  return index;
}

function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameToSlug(name: string): string {
  return normalise(name)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const xlsxPath = process.argv[2] || path.join(process.env.HOME || "~", "Desktop", "all_cities_student_numbers.xlsx");

  if (!fs.existsSync(xlsxPath)) {
    console.error(`File not found: ${xlsxPath}`);
    process.exit(1);
  }

  // Load existing school slugs/names for matching
  const { SCHOOL_PROFILES } = await import("../src/data/schools");
  const slugsByNormName = new Map<string, string>();
  const slugsBySlug = new Map<string, string>();
  for (const [slug, p] of Object.entries(SCHOOL_PROFILES)) {
    // Strip city suffix for matching: "Anglo Chinese School Singapore" -> "anglo chinese school"
    const nameWithoutCity = p.name.replace(/\s+(Singapore|Bangkok|Dubai|Hong Kong|Kuala Lumpur|Jakarta)$/i, "");
    slugsByNormName.set(normalise(nameWithoutCity), slug);
    slugsByNormName.set(normalise(p.name), slug);
    slugsBySlug.set(slug, slug);
  }

  // Read Excel
  const wb = XLSX.readFile(xlsxPath);
  const citySheets = wb.SheetNames.filter((n) => n !== "Summary");

  const CITY_SLUG_MAP: Record<string, string> = {
    Singapore: "singapore",
    Bangkok: "bangkok",
    "Kuala Lumpur": "kuala-lumpur",
    Jakarta: "jakarta",
    Dubai: "dubai",
    "Hong Kong": "hong-kong",
  };

  // Parse all sheets into school entries
  const allSchools: SchoolEntry[] = [];
  let notMatched: string[] = [];

  for (const sheetName of citySheets) {
    const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets[sheetName], { header: 1 });
    const citySlug = CITY_SLUG_MAP[sheetName];
    if (!citySlug) continue;

    let currentSchool: SchoolEntry | null = null;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i] as any[];
      if (!row || row.length === 0) continue;

      const city = row[0] as string | null;
      const school = row[1] as string | null;
      const value = row[2] as string | null;
      const date = row[3] as string | null;
      const source = row[4] as string | null;

      // New school entry
      if (school) {
        if (currentSchool && currentSchool.sources.length > 0) {
          allSchools.push(currentSchool);
        }
        currentSchool = {
          city: citySlug,
          schoolName: school,
          sources: [],
        };
      }

      if (!currentSchool) continue;

      // Skip "Not found" entries
      if (value && /not found/i.test(String(value))) continue;

      if (value) {
        const rawValue = String(value).trim();
        const numeric = parseNumeric(rawValue);
        const dateStr = date ? String(date).trim() : null;
        const sourceStr = source ? String(source).trim() : "Unknown";

        if (numeric > 0) {
          const subset = isSubsetValue(rawValue) || isSubsetValue(sourceStr);
          currentSchool.sources.push({
            rawValue,
            numeric,
            date: dateStr,
            source: sourceStr,
            authorityScore: subset ? Math.max(getAuthorityScore(sourceStr) - 5, 0) : getAuthorityScore(sourceStr),
            recencyScore: getRecencyScore(dateStr),
          });
        }
      }
    }

    // Don't forget the last school
    if (currentSchool && currentSchool.sources.length > 0) {
      allSchools.push(currentSchool);
    }
  }

  console.log(`Parsed ${allSchools.length} schools with data from Excel`);

  // Match to slugs and build output
  const output: Record<string, OutputEntry> = {};
  let matched = 0;

  for (const entry of allSchools) {
    // Try matching strategies
    const normName = normalise(entry.schoolName);
    let slug = slugsByNormName.get(normName);

    if (!slug) {
      // Try slug-style matching
      const guessedSlug = nameToSlug(entry.schoolName);
      slug = slugsBySlug.get(guessedSlug);
    }

    if (!slug) {
      // Try with city suffix
      const cityNames: Record<string, string> = {
        singapore: "singapore",
        bangkok: "bangkok",
        "kuala-lumpur": "kuala lumpur",
        jakarta: "jakarta",
        dubai: "dubai",
        "hong-kong": "hong kong",
      };
      const withCity = normalise(entry.schoolName + " " + (cityNames[entry.city] || ""));
      slug = slugsByNormName.get(withCity);
    }

    if (!slug) {
      // Try partial match — find slug that contains the normalised name
      for (const [normKey, s] of slugsByNormName) {
        if (normKey.includes(normName) || normName.includes(normKey)) {
          slug = s;
          break;
        }
      }
    }

    if (!slug) {
      notMatched.push(`${entry.city}: ${entry.schoolName}`);
      continue;
    }

    const bestEstimate = pickBestEstimate(entry.sources);
    if (bestEstimate <= 0) continue;

    const { display, isApproximate } = friendlyNumber(bestEstimate);
    const topSources = selectTopSources(entry.sources);

    // Check if all sources agree — if so, not approximate
    const allNums = entry.sources.filter((s) => s.numeric > 0).map((s) => s.numeric);
    const allAgree = allNums.length > 0 && allNums.every((n) => Math.abs(n - bestEstimate) / bestEstimate < 0.05);

    output[slug] = {
      bestEstimate,
      display: allAgree && !isApproximate ? bestEstimate.toLocaleString("en-US") : display,
      isApproximate: allAgree ? false : isApproximate,
      sourceCount: entry.sources.length,
      topSources,
    };

    matched++;
  }

  // Write output
  const outPath = path.join(process.cwd(), "data", "student-numbers.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");

  console.log(`\nMatched: ${matched} schools`);
  console.log(`Not matched: ${notMatched.length} schools`);
  console.log(`Output: ${outPath}`);

  if (notMatched.length > 0) {
    console.log(`\nUnmatched schools:`);
    for (const s of notMatched.sort()) {
      console.log(`  ${s}`);
    }
  }

  // Summary stats
  const approxCount = Object.values(output).filter((e) => e.isApproximate).length;
  const exactCount = Object.values(output).filter((e) => !e.isApproximate).length;
  console.log(`\nExact numbers: ${exactCount}`);
  console.log(`Approximate (~): ${approxCount}`);
}

main().catch(console.error);
