/**
 * Import fee data from Perplexity research output into data/fees.json.
 *
 * Reads one or more text files containing Perplexity's structured output
 * and updates fees.json with the new fee data.
 *
 * Expected input format (per school):
 *
 *   [slug] ANNUAL FEES:
 *   - Grade Name: 31610
 *   - Grade Name: 35970
 *   [slug] ONE-TIME FEES:
 *   - Registration Fee: 3270
 *   [slug] SOURCE: https://example.com
 *   [slug] YEAR: 2025-2026
 *
 *   or: [slug] FEES NOT AVAILABLE
 *
 * Usage:
 *   npx tsx scripts/import-fees-from-perplexity.ts <file1.txt> [file2.txt ...]
 *   npx tsx scripts/import-fees-from-perplexity.ts data/fee-research/results/*.txt
 *
 * After importing, run:
 *   npx tsx scripts/generate-fee-profiles.ts
 *   npx tsx scripts/validate-fees.ts
 *   npx tsx scripts/sync-card-fees-from-profiles.ts --apply
 */

import * as fs from "fs";
import * as path from "path";

type FeeRow = { age: number; grade: string; amount: number };
type FeeEntry = {
  city: string;
  currency: string;
  source: string;
  sourceDate: string;
  feesAvailable: boolean;
  feeRows: FeeRow[];
  oneTimeFees: Record<string, number>;
};

const AGE_MAP: Record<string, number> = {
  // Infants / toddlers
  "infant care": 1, "toddler": 2, "playgroup": 2, "play group": 2,
  "rising 3s": 2, "starters": 2, "baby eagles": 2,
  "early learners": 2, "early learning centre": 2,

  // Pre-nursery
  "pre-nursery": 2, "pre nursery": 2, "prenursery": 2,

  // Nursery
  "nursery": 3, "nurs.": 3,

  // Pre-KG / Pre-K
  "pre-kg": 3, "pre kg": 3, "prekg": 3,
  "pre-k": 3, "pre k": 3, "prek": 3, "pre-kindergarten": 3,

  // Kindergarten numbered
  "kg 1": 3, "kg1": 3, "kg-1": 3, "kindg. 1": 3, "kindergarten 1": 3, "kinder 1": 3,
  "kg 2": 4, "kg2": 4, "kg-2": 4, "kindg. 2": 4, "kindergarten 2": 4, "kinder 2": 4,
  "kg 3": 5, "kg3": 5, "kindg. 3": 5, "kindergarten 3": 5,
  "kindergarten 4": 5,

  // Kindergarten standalone
  "kindergarten": 4, "kinder": 4, "kg": 4,

  // Reception / Prep
  "reception": 5, "prep": 5, "preparatory": 5, "preparation": 5,
  "pre-reception": 4, "pre-grade 1": 5,

  // Foundation Stage
  "fs": 3, "fs 1": 3, "fs1": 3, "fs-1": 3, "foundation stage 1": 3, "foundation 1": 3,
  "fs 2": 4, "fs2": 4, "fs-2": 4, "foundation stage 2": 4, "foundation 2": 4,

  // Pre-K numbered
  "pre-k1": 3, "pre-k2": 4,

  // Early Years
  "early years": 3, "early years 1": 3, "early years 2": 4, "early years 3": 5,
  "early years 4": 5, "early years 5": 6,
  "eyfs": 3, "eyfs 1": 3, "eyfs1": 3, "eyfs 2": 4, "eyfs2": 4,
  "early childhood": 3,

  // Generic stages
  "preschool": 4, "pre-school": 4, "pre school": 3,
  "elementary": 6, "primary": 6,
  "middle school": 11, "secondary": 12, "senior": 12, "high school": 14,
  "junior high": 12,

  // IB programme names
  "pre-ib": 15, "fib": 15,
  "ib diploma": 16, "ibdp": 16, "diploma programme": 16, "diploma": 16,
  "diploma 1": 16, "diploma 2": 17,

  // IB PYP/MYP/DP numbered
  "pyp 1": 6, "pyp 2": 7, "pyp 3": 8, "pyp 4": 9, "pyp 5": 10,
  "myp 1": 11, "myp 2": 12, "myp 3": 13, "myp 4": 14, "myp 5": 15,
  "dp 1": 16, "dp 2": 17,

  // Sixth form / A-Level
  "sixth form": 16, "6th form": 16,
  "a-level": 16, "a-levels": 16, "as-a2": 16,
  "igcse": 14, "igcse / gce": 14, "gce a level": 16,
  "key stage 3": 11,

  // UK Form system (HK / MY)
  "form 1": 12, "form 2": 13, "form 3": 14, "form 4": 15, "form 5": 16,
  "form 6": 17, "form 7": 18,

  // Malaysian Standard system
  "standard 1": 7, "standard 2": 8, "standard 3": 9,
  "standard 4": 10, "standard 5": 11, "standard 6": 12,

  // Thai P/M system
  "p1": 6, "p2": 7, "p3": 8, "p4": 9, "p5": 10, "p6": 11,
  "m1": 12, "m2": 13, "m3": 14, "m4": 15, "m5": 16, "m6": 17,

  // Indonesian SD/SMP/SMA
  "sd": 6, "smp": 12, "sma": 15,

  // Singapore N1/N2/P1-P6/S1-S4/JC
  "n1": 3, "n2": 4,
  "junior college": 16,

  // French system
  "toute petite section": 2, "petite section": 3, "moyenne section": 4,
  "grande section": 5, "cp": 6, "ce1": 7, "ce2": 8,
  "cm1": 9, "cm2": 10,
  "6eme": 11, "5eme": 12, "4eme": 13, "3eme": 14,
  "seconde": 15, "premiere": 16, "terminale": 17,
  "ps": 3, "ms": 4, "gs": 5,

  // Generic lower/upper
  "lower": 6, "upper": 14,
  "level 1": 6,
};

/**
 * Map a grade/year-group name to the typical starting age for that grade.
 * Returns 0 only if no mapping can be determined.
 */
function gradeToAge(grade: string): number {
  // Normalise: lowercase, strip leading/trailing whitespace
  let g = grade.toLowerCase().trim();

  // Extract age from parenthetical hints like "(Ages 3-6)" or "(2 years old)"
  const ageHint = g.match(/\(?\bages?\s*(\d+)/i) || g.match(/\(?(\d+)\s*years?\s*old/i);
  if (ageHint) return parseInt(ageHint[1]);

  // Age-word patterns: "Twos", "Threes", "Fours", "Fives"
  if (/\btwos?\b/i.test(g)) return 2;
  if (/\bthrees?\b/i.test(g)) return 3;
  if (/\bfours?\b/i.test(g)) return 4;
  if (/\bfives?\b/i.test(g)) return 5;

  // Strip campus/programme qualifiers in parentheses for matching
  // e.g. "G1 (Garhoud/Barsha)" → "g1", "Pre-KG (Bilingual)" → "pre-kg"
  const stripped = g
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Strip campus/location prefix before colon
  // e.g. "Petaling Jaya Campus: KG 1" → "kg 1"
  const afterColon = stripped.includes(":")
    ? stripped.split(":").pop()!.trim()
    : stripped;

  // For ranges: handle "to", "-", "–", "&" separators
  // e.g. "Years 1 to 6" → "Years 1", "Grades 6 - 8" → "Grades 6"
  const beforeRange = afterColon
    .replace(/\s*(?:[-–&]|to)\s*.+$/i, "")
    .trim() || afterColon;

  // Try exact/prefix match on AGE_MAP with the stripped version first
  for (const candidate of [beforeRange, afterColon, stripped, g]) {
    for (const [pattern, age] of Object.entries(AGE_MAP)) {
      if (candidate === pattern || candidate.startsWith(pattern + " ") || candidate.startsWith(pattern + "/")) {
        return age;
      }
    }
  }

  // All regex matching uses afterColon (campus-prefix-stripped, parentheses-stripped)
  const s = afterColon;

  // "EY 1", "EY 2", "EY 3", "EY Prep" (Early Years)
  const eyMatch = s.match(/\bey\s*(\d+)/);
  if (eyMatch) return parseInt(eyMatch[1]) + 1;
  if (s.includes("ey prep")) return 3;

  // "K1", "K2", "K3", "K.1", "K.2", "K.3", "K-1", "K-2"
  const kMatch = s.match(/\bk[-.]?\s*(\d+)/);
  if (kMatch) return parseInt(kMatch[1]) + 2;

  // "G1"-"G12", "G.1"-"G.12", "G 1"-"G 12", "Gr 1"-"Gr 12", "GR 1"-"GR 12"
  const gMatch = s.match(/\bg(?:r)?\.?\s*(\d+)/);
  if (gMatch) return parseInt(gMatch[1]) + 5;

  // "Year N" or "Years N" (plural with first number)
  const yearMatch = s.match(/\byears?\s*(\d+)/);
  if (yearMatch) return parseInt(yearMatch[1]) + 4;

  // "Grade N" or "Grades N" (plural with first number)
  const gradeMatch = s.match(/\bgrades?\s*(\d+)/);
  if (gradeMatch) return parseInt(gradeMatch[1]) + 5;

  // "Y1"-"Y13" or "YR 1"-"YR 13" shorthand
  const yShort = s.match(/\byr?\s*(\d+)/);
  if (yShort) return parseInt(yShort[1]) + 4;

  // "Form N" or "F1"-"F7" shorthand
  const formMatch = s.match(/\bforms?\s*(\d+)/);
  if (formMatch) return parseInt(formMatch[1]) + 11;
  const fShort = s.match(/\bf(\d+)/);
  if (fShort) return parseInt(fShort[1]) + 11;

  // "Standard N"
  const stdMatch = s.match(/\bstandard\s*(\d+)/);
  if (stdMatch) return parseInt(stdMatch[1]) + 6;

  // "Class N" or "Classes N"
  const classMatch = s.match(/\bclass(?:es)?\s*(\d+)/);
  if (classMatch) return parseInt(classMatch[1]) + 5;

  // "P.1"-"P.6" (HK primary) or "P1"-"P6" (Thai/SG)
  const pMatch = s.match(/\bp\.?\s*(\d+)/);
  if (pMatch) {
    const n = parseInt(pMatch[1]);
    if (n <= 6) return n + 5;
  }

  // "M1"-"M6" (Thai secondary)
  const mMatch = s.match(/\bm\.?\s*(\d+)/);
  if (mMatch) return parseInt(mMatch[1]) + 11;

  // "S1"-"S4" (SG secondary) or "SD-2" to "SD-6" (Indonesian)
  const sMatch = s.match(/\bs(?:d)?[-.]?\s*(\d+)/);
  if (sMatch) {
    const n = parseInt(sMatch[1]);
    if (s.includes("sd")) return n + 5;
    return n + 11;
  }

  // "SMP-7" to "SMP-9" (Indonesian junior high)
  const smpMatch = s.match(/\bsmp[-.]?\s*(\d+)/);
  if (smpMatch) return parseInt(smpMatch[1]) + 5;

  // "SMA-10" to "SMA-12" (Indonesian senior high)
  const smaMatch = s.match(/\bsma[-.]?\s*(\d+)/);
  if (smaMatch) return parseInt(smaMatch[1]) + 5;

  // "JC1", "JC2" (Junior College)
  const jcMatch = s.match(/\bjc\.?\s*(\d+)/);
  if (jcMatch) return parseInt(jcMatch[1]) + 15;

  // "N-th Grade" format like "1st Grade", "6th Grade"
  const nthGrade = s.match(/(\d+)(?:st|nd|rd|th)\s*grade/);
  if (nthGrade) return parseInt(nthGrade[1]) + 5;

  // "PYP 1-5", "MYP 1-5", "DP 1-2" with ranges
  const pypRange = s.match(/\bpyp\s*(\d+)/);
  if (pypRange) return parseInt(pypRange[1]) + 5;
  const mypRange = s.match(/\bmyp\s*(\d+)/);
  if (mypRange) return parseInt(mypRange[1]) + 10;
  const dpRange = s.match(/\bdp\s*(\d+)/);
  if (dpRange) return parseInt(dpRange[1]) + 15;

  // "Grade-N" with hyphen (Dubai format)
  const gradeHyphen = s.match(/\bgrade-(\d+)/);
  if (gradeHyphen) return parseInt(gradeHyphen[1]) + 5;

  // "Grade I"-"Grade XII" (CBSE Roman numerals)
  const romanMap: Record<string, number> = {
    i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6,
    vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12,
  };
  const gradeRoman = s.match(/\bgrade\s+([ivx]+)\b/);
  if (gradeRoman && romanMap[gradeRoman[1]]) return romanMap[gradeRoman[1]] + 5;

  // "Key Stage N" or "KS N" / "KSN"
  const ksMatch = s.match(/\b(?:key stage|ks)\s*(\d+)/);
  if (ksMatch) {
    const ks = parseInt(ksMatch[1]);
    if (ks === 1) return 5;
    if (ks === 2) return 7;
    if (ks === 3) return 11;
    if (ks === 4) return 14;
    if (ks === 5) return 16;
  }

  // French secondary: "2nde" = 15, "1ere" / "1ère" = 16
  if (/\b2nde\b/.test(s)) return 15;
  if (/\b1[eè]re\b/.test(s)) return 16;

  // "PK2"-"PK4" or "PreK2" (Pre-K numbered)
  const pkMatch = s.match(/\bp(?:re)?k(\d+)/);
  if (pkMatch) return parseInt(pkMatch[1]) + 1;

  // "Std N" (Standard shorthand)
  const stdShort = s.match(/\bstd\s*(\d+)/);
  if (stdShort) return parseInt(stdShort[1]) + 6;

  // "N1", "N2" (Singapore nursery)
  const nMatch = s.match(/\bn(\d+)\b/);
  if (nMatch && parseInt(nMatch[1]) <= 2) return parseInt(nMatch[1]) + 2;

  // "Grade K" (Kindergarten)
  if (/\bgrade\s*k\b/.test(s)) return 4;

  // "Orientation Stage" (German system, ~age 10)
  if (s.includes("orientation")) return 10;

  // Catch-alls on the full original string (g) to catch parenthetical context
  // "Foundation" without a number
  if (g.includes("foundation")) return 4;

  // "Kindergarten" anywhere
  if (g.includes("kindergarten") || g.includes("kinder")) return 4;

  // "Pre-school" / "preschool" catch-all
  if (g.includes("pre-school") || g.includes("preschool") || g.includes("pre school")) return 3;

  // "Early years" catch-all
  if (g.includes("early year") || g.includes("early childhood") || g.includes("early learning")) return 3;

  // "Pre-nursery" / "pre nursery" catch-all
  if (g.includes("pre-nursery") || g.includes("pre nursery")) return 2;

  // "Nursery" catch-all
  if (g.includes("nursery")) return 3;

  // "Toddler" / "playgroup" catch-all
  if (g.includes("toddler") || g.includes("playgroup") || g.includes("play group")) return 2;

  // "Reception" catch-all
  if (g.includes("reception")) return 5;

  // "Middle" (e.g. "Middle (6-8)")
  if (g.includes("middle")) return 11;

  // "High" (e.g. "High (9-12)")
  if (g.includes("high")) return 14;

  // "Elementary" / "primary" catch-all
  if (g.includes("elementary") || g.includes("primary")) return 6;

  // "Secondary" / "senior" catch-all
  if (g.includes("secondary") || g.includes("senior")) return 12;

  // "Junior high" catch-all
  if (g.includes("junior high")) return 12;

  // "A-level" / "A level" / "GCE" catch-all
  if (g.includes("a-level") || g.includes("a level") || g.includes("gce")) return 16;

  // "IGCSE" catch-all
  if (g.includes("igcse")) return 14;

  // "Diploma" / "IB" catch-all
  if (g.includes("diploma") || g.includes("ibdp") || g.includes("ib dp") || /\bib\b/.test(g)) return 16;

  // "Boarding" / "Activity Fee" / "Development Fee" — not a grade, skip
  if (g.includes("boarding") || g.includes("activity fee") || g.includes("development fee") || g.includes("pa fee")) return 0;

  return 0;
}

/** @deprecated Use gradeToAge instead */
const guessAge = gradeToAge;

function parseAmount(text: string): number | null {
  const cleaned = text.replace(/[,\s]/g, "").replace(/^[A-Z$S₹₫₩£€]+/i, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

type ParsedSchool = {
  slug: string;
  feeRows: FeeRow[];
  oneTimeFees: Record<string, number>;
  source: string;
  year: string;
  notAvailable: boolean;
};

function parsePerplexityOutput(text: string): { schools: ParsedSchool[]; unparsed: string[] } {
  const schools: ParsedSchool[] = [];
  const unparsed: string[] = [];
  const lines = text.split("\n");

  let current: ParsedSchool | null = null;
  let section: "annual" | "onetime" | "none" = "none";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // [slug] NOTE: or [slug] NOTES: — informational, skip
    const noteMatch = line.match(/^\[([^\]]+)\]\s*NOTES?\s*:/i);
    if (noteMatch) {
      section = "none";
      continue;
    }

    // [slug] FEES NOT AVAILABLE
    const notAvailMatch = line.match(/^\[([^\]]+)\]\s*FEES?\s*NOT\s*AVAILABLE/i);
    if (notAvailMatch) {
      if (current) schools.push(current);
      current = {
        slug: notAvailMatch[1],
        feeRows: [],
        oneTimeFees: {},
        source: "",
        year: "",
        notAvailable: true,
      };
      section = "none";
      continue;
    }

    // [slug] ANNUAL FEES:
    const annualMatch = line.match(/^\[([^\]]+)\]\s*ANNUAL\s*FEES?\s*:?\s*$/i);
    if (annualMatch) {
      if (current) schools.push(current);
      current = {
        slug: annualMatch[1],
        feeRows: [],
        oneTimeFees: {},
        source: "",
        year: "",
        notAvailable: false,
      };
      section = "annual";
      continue;
    }

    // [slug] ONE-TIME FEES:
    const onetimeMatch = line.match(/^\[([^\]]+)\]\s*ONE-?TIME\s*(?:\/\s*UPFRONT\s*)?FEES?\s*:?\s*$/i);
    if (onetimeMatch) {
      if (!current || current.slug !== onetimeMatch[1]) {
        if (current) schools.push(current);
        current = {
          slug: onetimeMatch[1],
          feeRows: [],
          oneTimeFees: {},
          source: "",
          year: "",
          notAvailable: false,
        };
      }
      section = "onetime";
      continue;
    }

    // Programme sub-headings (e.g. "International Bilingual Programme:") — skip
    if (/^[A-Z][A-Za-z\s\-]+(?:Programme|Program|Track|Stream|Pathway|Campus)\s*:?\s*$/i.test(line) && section === "annual") {
      continue;
    }

    // [slug] SOURCE: url
    const sourceMatch = line.match(/^\[([^\]]+)\]\s*SOURCE\s*:\s*(.+)/i);
    if (sourceMatch) {
      if (current && current.slug === sourceMatch[1]) {
        current.source = sourceMatch[2].trim();
      }
      section = "none";
      continue;
    }

    // [slug] YEAR: 2025-2026
    const yearMatch = line.match(/^\[([^\]]+)\]\s*YEAR\s*:\s*(.+)/i);
    if (yearMatch) {
      if (current && current.slug === yearMatch[1]) {
        current.year = yearMatch[2].trim();
      }
      section = "none";
      continue;
    }

    // Fee line: - Grade Name: 31610  or  - Fee Name: 3270
    const feeLineMatch = line.match(/^[-•*]\s*(.+?):\s*([\d,. ]+)\s*$/);
    if (feeLineMatch && current) {
      const name = feeLineMatch[1].trim();
      const amount = parseAmount(feeLineMatch[2]);
      if (amount !== null && amount > 0) {
        if (section === "annual") {
          current.feeRows.push({
            age: guessAge(name),
            grade: name,
            amount,
          });
        } else if (section === "onetime") {
          current.oneTimeFees[name] = amount;
        }
        continue;
      }
    }

    // Also handle "- None" or "- N/A" for one-time fees
    if (/^[-•*]\s*(none|n\/a|nil|no\s+one-?time)/i.test(line) && section === "onetime") {
      continue;
    }

    // If we can't parse the line and it's not a blank/separator, track it
    if (line && !line.match(/^[-=]{3,}$/) && !line.match(/^#{1,3}\s/) && !line.startsWith("CITY:") && !line.startsWith("CURRENCY:")) {
      unparsed.push(line);
    }
  }

  if (current) schools.push(current);

  return { schools, unparsed };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: npx tsx scripts/import-fees-from-perplexity.ts <file1.txt> [file2.txt ...]");
    process.exit(1);
  }

  const feesPath = path.join(process.cwd(), "data", "fees.json");
  const fees: Record<string, FeeEntry> = JSON.parse(fs.readFileSync(feesPath, "utf-8"));

  let totalUpdated = 0;
  let totalNotAvailable = 0;
  let totalUnknownSlugs: string[] = [];
  let totalUnparsed: string[] = [];

  for (const file of args) {
    if (!fs.existsSync(file)) {
      console.error(`File not found: ${file}`);
      continue;
    }

    const text = fs.readFileSync(file, "utf-8");
    const { schools, unparsed } = parsePerplexityOutput(text);

    console.log(`\n${path.basename(file)}: ${schools.length} schools parsed`);

    for (const school of schools) {
      const existing = fees[school.slug];
      if (!existing) {
        totalUnknownSlugs.push(school.slug);
        console.log(`  WARNING: unknown slug [${school.slug}]`);
        continue;
      }

      if (school.notAvailable) {
        existing.feesAvailable = false;
        existing.feeRows = [];
        // Keep one-time fees if provided (some schools publish one-time but not tuition)
        if (Object.keys(school.oneTimeFees).length > 0) {
          existing.oneTimeFees = school.oneTimeFees;
        } else {
          existing.oneTimeFees = {};
        }
        existing.source = school.source || existing.source;
        existing.sourceDate = school.year || "not available";
        totalNotAvailable++;
        continue;
      }

      if (school.feeRows.length > 0) {
        existing.feeRows = school.feeRows;
      }
      if (Object.keys(school.oneTimeFees).length > 0) {
        existing.oneTimeFees = school.oneTimeFees;
      }
      if (school.source) {
        existing.source = school.source;
      }
      if (school.year) {
        existing.sourceDate = school.year;
      }
      existing.feesAvailable = true;
      totalUpdated++;
    }

    if (unparsed.length > 0) {
      totalUnparsed.push(...unparsed.map((l) => `  ${path.basename(file)}: ${l}`));
    }
  }

  // Write updated fees.json
  const sorted = Object.fromEntries(Object.entries(fees).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(feesPath, JSON.stringify(sorted, null, 2) + "\n");

  console.log(`\n=== IMPORT SUMMARY ===`);
  console.log(`Updated: ${totalUpdated}`);
  console.log(`Fees not available: ${totalNotAvailable}`);
  if (totalUnknownSlugs.length > 0) {
    console.log(`Unknown slugs: ${totalUnknownSlugs.length}`);
    for (const s of totalUnknownSlugs) {
      console.log(`  ${s}`);
    }
  }
  if (totalUnparsed.length > 0) {
    console.log(`\nUnparsed lines (${totalUnparsed.length}):`);
    for (const l of totalUnparsed.slice(0, 20)) {
      console.log(l);
    }
    if (totalUnparsed.length > 20) {
      console.log(`  ... and ${totalUnparsed.length - 20} more`);
    }
  }

  console.log(`\nNext steps:`);
  console.log(`  npx tsx scripts/generate-fee-profiles.ts`);
  console.log(`  npx tsx scripts/validate-fees.ts`);
  console.log(`  npx tsx scripts/sync-card-fees-from-profiles.ts --apply`);
}

main();
