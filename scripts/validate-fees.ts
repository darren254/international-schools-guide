/**
 * Validate data/fees.json for anomalies, completeness, and consistency.
 *
 * Checks:
 * 1. Fee amounts within expected ranges per city/currency
 * 2. Schools with feesAvailable=true but empty feeRows
 * 3. Grade continuity (gaps in age sequence)
 * 4. Suspicious amounts (possible per-term instead of annual, wrong currency)
 * 5. Source/provenance tracking
 *
 * Usage: npx tsx scripts/validate-fees.ts
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

type Issue = {
  slug: string;
  city: string;
  severity: "error" | "warning" | "info";
  message: string;
};

const EXPECTED_RANGES: Record<string, { currency: string; min: number; max: number }> = {
  singapore: { currency: "SGD", min: 5000, max: 65000 },
  dubai: { currency: "AED", min: 5000, max: 220000 },
  bangkok: { currency: "THB", min: 50000, max: 1300000 },
  "hong-kong": { currency: "HKD", min: 20000, max: 300000 },
  "kuala-lumpur": { currency: "MYR", min: 2000, max: 140000 },
  jakarta: { currency: "IDR", min: 10000000, max: 600000000 },
};

function validateEntry(slug: string, entry: FeeEntry): Issue[] {
  const issues: Issue[] = [];
  const { city, currency, feeRows, feesAvailable, oneTimeFees, sourceDate } = entry;
  const range = EXPECTED_RANGES[city];

  // Check currency matches city
  if (range && currency !== range.currency) {
    issues.push({
      slug,
      city,
      severity: "error",
      message: `Currency mismatch: ${currency} (expected ${range.currency} for ${city})`,
    });
  }

  // Check provenance
  if (sourceDate === "unverified") {
    issues.push({
      slug,
      city,
      severity: "info",
      message: "Unverified source — not from fact-check emails",
    });
  }

  // Fees available but no rows
  if (feesAvailable && feeRows.length === 0) {
    issues.push({
      slug,
      city,
      severity: "warning",
      message: "Fees marked as available but no fee rows extracted",
    });
  }

  // No fees at all
  if (!feesAvailable && feeRows.length === 0) {
    issues.push({
      slug,
      city,
      severity: "info",
      message: "Fees not publicly available",
    });
  }

  if (feeRows.length === 0) return issues;

  // Check amounts within expected range
  if (range) {
    for (const row of feeRows) {
      if (row.amount < range.min) {
        issues.push({
          slug,
          city,
          severity: "warning",
          message: `Low fee: ${row.grade} = ${row.amount.toLocaleString()} ${currency} (expected >${range.min.toLocaleString()})`,
        });
      }
      if (row.amount > range.max) {
        issues.push({
          slug,
          city,
          severity: "warning",
          message: `High fee: ${row.grade} = ${row.amount.toLocaleString()} ${currency} (expected <${range.max.toLocaleString()})`,
        });
      }
    }
  }

  // Check for possible per-term amounts (unusually low for the city)
  if (range) {
    const median = feeRows.map((r) => r.amount).sort((a, b) => a - b)[Math.floor(feeRows.length / 2)];
    if (median < range.min * 0.5) {
      issues.push({
        slug,
        city,
        severity: "error",
        message: `Median fee ${median.toLocaleString()} ${currency} is very low — possible per-term/per-month instead of annual`,
      });
    }
  }

  // Check age continuity
  const ages = feeRows.map((r) => r.age).filter((a) => a > 0).sort((a, b) => a - b);
  if (ages.length >= 2) {
    for (let i = 1; i < ages.length; i++) {
      const gap = ages[i] - ages[i - 1];
      if (gap > 3) {
        issues.push({
          slug,
          city,
          severity: "info",
          message: `Age gap: ${ages[i - 1]} → ${ages[i]} (gap of ${gap} years)`,
        });
      }
    }
  }

  // Check for zero ages
  const zeroAges = feeRows.filter((r) => r.age === 0);
  if (zeroAges.length > 0) {
    issues.push({
      slug,
      city,
      severity: "warning",
      message: `${zeroAges.length} fee row(s) with age=0: ${zeroAges.map((r) => r.grade).join(", ")}`,
    });
  }

  // Check one-time fees for suspicious amounts
  for (const [name, amount] of Object.entries(oneTimeFees)) {
    if (range && amount > range.max) {
      issues.push({
        slug,
        city,
        severity: "warning",
        message: `One-time fee "${name}" = ${amount.toLocaleString()} ${currency} seems very high`,
      });
    }
  }

  // Check for fee rows that look like they might be non-tuition items
  for (const row of feeRows) {
    const g = row.grade.toLowerCase();
    if (
      g.includes("concert") ||
      g.includes("uniform") ||
      g.includes("transport") ||
      g.includes("lunch") ||
      g.includes("bus") ||
      g.includes("meal")
    ) {
      issues.push({
        slug,
        city,
        severity: "warning",
        message: `Fee row "${row.grade}" may not be tuition`,
      });
    }
  }

  return issues;
}

function main() {
  const feesPath = path.join(process.cwd(), "data", "fees.json");
  const fees: Record<string, FeeEntry> = JSON.parse(
    fs.readFileSync(feesPath, "utf-8")
  );

  const allIssues: Issue[] = [];

  for (const [slug, entry] of Object.entries(fees)) {
    allIssues.push(...validateEntry(slug, entry));
  }

  // Summary
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");
  const infos = allIssues.filter((i) => i.severity === "info");

  console.log(`\n=== FEE VALIDATION REPORT ===`);
  console.log(`Total entries: ${Object.keys(fees).length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Info: ${infos.length}`);

  // Provenance stats
  const verified = Object.values(fees).filter((v) => v.sourceDate !== "unverified").length;
  const withRows = Object.values(fees).filter((v) => v.feeRows.length > 0).length;
  console.log(`\nProvenance:`);
  console.log(`  Verified (from emails): ${verified}`);
  console.log(`  Unverified (from codebase): ${Object.keys(fees).length - verified}`);
  console.log(`  With fee rows: ${withRows}`);
  console.log(`  Without fee rows: ${Object.keys(fees).length - withRows}`);

  // Per-city stats
  const cityCounts: Record<string, { total: number; withRows: number; verified: number }> = {};
  for (const entry of Object.values(fees)) {
    if (!cityCounts[entry.city]) {
      cityCounts[entry.city] = { total: 0, withRows: 0, verified: 0 };
    }
    cityCounts[entry.city].total++;
    if (entry.feeRows.length > 0) cityCounts[entry.city].withRows++;
    if (entry.sourceDate !== "unverified") cityCounts[entry.city].verified++;
  }
  console.log(`\nPer city:`);
  for (const [city, counts] of Object.entries(cityCounts).sort()) {
    console.log(
      `  ${city}: ${counts.total} total, ${counts.withRows} with fees, ${counts.verified} verified`
    );
  }

  // Print errors
  if (errors.length > 0) {
    console.log(`\n--- ERRORS (${errors.length}) ---`);
    for (const i of errors) {
      console.log(`  [${i.city}] ${i.slug}: ${i.message}`);
    }
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(`\n--- WARNINGS (${warnings.length}) ---`);
    for (const i of warnings) {
      console.log(`  [${i.city}] ${i.slug}: ${i.message}`);
    }
  }

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
