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
  "infant care": 1, "toddler": 2,
  "pre-nursery": 2, "pre nursery": 2, "prenursery": 2,
  "nursery": 3, "nurs.": 3,
  "pre-kg": 3, "pre kg": 3, "prekg": 3, "pre-k": 3,
  "kg 1": 3, "kg1": 3, "kindg. 1": 3, "kindergarten 1": 3, "kinder 1": 3,
  "kg 2": 4, "kg2": 4, "kindg. 2": 4, "kindergarten 2": 4, "kinder 2": 4,
  "kg 3": 5, "kg3": 5, "kindg. 3": 5, "kindergarten 3": 5,
  "reception": 5, "prep": 5, "preparatory": 5,
  "fs 1": 3, "fs1": 3, "foundation stage 1": 3, "foundation 1": 3,
  "fs 2": 4, "fs2": 4, "foundation stage 2": 4, "foundation 2": 4,
  "pre-k1": 3, "pre-k2": 4,
  "preschool": 4, "elementary": 6, "primary": 6,
  "middle school": 11, "secondary": 12, "senior": 12, "high school": 14,
  "pre-ib": 15, "fib": 15, "sixth form": 16,
  "lower": 6, "upper": 14,
};

function guessAge(grade: string): number {
  // For ranges like "EY 2 - EY 3" or "Year 1 - Year 2", use the first part
  const g = grade.toLowerCase().trim().replace(/\s*[-–]\s*.+$/, "").trim()
    // Also strip trailing parenthetical like "(K1-K3)"
    || grade.toLowerCase().trim();

  for (const [pattern, age] of Object.entries(AGE_MAP)) {
    if (g === pattern || g.startsWith(pattern + " ") || g.startsWith(pattern + "/")) {
      return age;
    }
  }

  // Handle "EY 1", "EY 2", "EY 3" (Early Years)
  const eyMatch = g.match(/(?:ey)\s*(\d+)/);
  if (eyMatch) return parseInt(eyMatch[1]) + 1;

  // Handle "K1", "K2", "K3" or "K1-K3" (take first number)
  const kMatch = g.match(/(?:^k|kindergarten\s*\(?k)(\d+)/);
  if (kMatch) return parseInt(kMatch[1]) + 2;

  // Handle "G1"-"G12" shorthand
  const gShortMatch = g.match(/^g(\d+)$/);
  if (gShortMatch) return parseInt(gShortMatch[1]) + 5;

  const yearMatch = g.match(/(?:year)\s*(\d+)/);
  if (yearMatch) return parseInt(yearMatch[1]) + 4;

  const gradeMatch = g.match(/(?:grade)\s*(\d+)/);
  if (gradeMatch) return parseInt(gradeMatch[1]) + 5;

  // Handle "Foundation" without a number
  if (g.includes("foundation")) return 4;

  return 0;
}

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
