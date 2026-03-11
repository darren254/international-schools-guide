/**
 * Show progress on the Perplexity fee research.
 *
 * Reads data/fees.json and data/fee-research/ to show:
 * - Which batches exist and which have been imported
 * - Per-city completion stats
 * - Which schools still need fees
 *
 * Usage: npx tsx scripts/fee-research-progress.ts [--city singapore] [--pending]
 */

import * as fs from "fs";
import * as path from "path";

type FeeEntry = {
  city: string;
  currency: string;
  source: string;
  sourceDate: string;
  feesAvailable: boolean;
  feeRows: { age: number; grade: string; amount: number }[];
  oneTimeFees: Record<string, number>;
};

const CITY_ORDER = ["singapore", "dubai", "bangkok", "hong-kong", "kuala-lumpur", "jakarta"];

function main() {
  const args = process.argv.slice(2);
  const cityFilter = args.includes("--city") ? args[args.indexOf("--city") + 1] : null;
  const showPending = args.includes("--pending");

  const feesPath = path.join(process.cwd(), "data", "fees.json");
  const fees: Record<string, FeeEntry> = JSON.parse(fs.readFileSync(feesPath, "utf-8"));

  const researchDir = path.join(process.cwd(), "data", "fee-research");
  const resultDir = path.join(researchDir, "results");

  // Find all batch files and result files
  const batchFiles = fs.existsSync(researchDir)
    ? fs.readdirSync(researchDir).filter((f) => f.match(/^[\w-]+-batch-\d+\.txt$/))
    : [];
  const resultFiles = fs.existsSync(resultDir)
    ? fs.readdirSync(resultDir).filter((f) => f.endsWith(".txt"))
    : [];

  // Parse batch files to know which slugs are in which batch
  const batchSlugs: Record<string, string[]> = {};
  for (const bf of batchFiles) {
    const text = fs.readFileSync(path.join(researchDir, bf), "utf-8");
    const slugs = [...text.matchAll(/\[([\w-]+)\]/g)].map((m) => m[1]);
    batchSlugs[bf] = slugs;
  }

  // Determine which batches have results
  const completedBatches = new Set<string>();
  for (const rf of resultFiles) {
    // Match result file to batch: "singapore-batch-1-result.txt" or "singapore-batch-1.txt"
    const batchMatch = rf.match(/^([\w-]+-batch-\d+)/);
    if (batchMatch) {
      const batchName = batchMatch[1] + ".txt";
      if (batchSlugs[batchName]) {
        completedBatches.add(batchName);
      }
    }
  }

  // Also check fees.json for schools that have been updated with Perplexity data
  // (sourceDate is not "unverified" and source is not "codebase (unverified)")
  const isResearched = (entry: FeeEntry): boolean => {
    return (
      entry.sourceDate !== "unverified" &&
      entry.sourceDate !== "" &&
      entry.source !== "codebase (unverified)" &&
      entry.feeRows.length > 0
    );
  };

  console.log("=== FEE RESEARCH PROGRESS ===\n");

  // Per-city summary
  const cities = cityFilter ? [cityFilter] : CITY_ORDER;

  for (const city of cities) {
    const cityEntries = Object.entries(fees).filter(([, v]) => v.city === city);
    const total = cityEntries.length;
    const done = cityEntries.filter(([, v]) => isResearched(v)).length;
    const notAvail = cityEntries.filter(([, v]) => !v.feesAvailable).length;
    const pending = total - done - notAvail;

    const cityBatches = batchFiles.filter((f) => f.startsWith(city + "-batch-"));
    const cityCompleted = cityBatches.filter((f) => completedBatches.has(f));

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const bar = "█".repeat(Math.round(pct / 5)) + "░".repeat(20 - Math.round(pct / 5));

    console.log(`${city.toUpperCase()}`);
    console.log(`  ${bar} ${pct}%  (${done}/${total} researched, ${notAvail} not available, ${pending} pending)`);
    console.log(`  Batches: ${cityCompleted.length}/${cityBatches.length} completed`);

    if (cityBatches.length > 0) {
      const batchStatus = cityBatches
        .sort((a, b) => {
          const na = parseInt(a.match(/batch-(\d+)/)?.[1] ?? "0");
          const nb = parseInt(b.match(/batch-(\d+)/)?.[1] ?? "0");
          return na - nb;
        })
        .map((f) => {
          const num = f.match(/batch-(\d+)/)?.[1] ?? "?";
          return completedBatches.has(f) ? `[${num}]` : ` ${num} `;
        });
      console.log(`  ${batchStatus.join(" ")}`);
      console.log(`  (numbers in brackets = done)\n`);
    } else {
      console.log(``);
    }

    // Show pending schools if requested
    if (showPending) {
      const pendingSchools = cityEntries
        .filter(([, v]) => !isResearched(v) && v.feesAvailable !== false)
        .map(([slug]) => slug)
        .sort();
      if (pendingSchools.length > 0) {
        console.log(`  Pending schools:`);
        for (const s of pendingSchools) {
          console.log(`    ${s}`);
        }
        console.log(``);
      }
    }
  }

  // Overall
  const allEntries = Object.values(fees);
  const totalAll = allEntries.length;
  const doneAll = allEntries.filter(isResearched).length;
  const notAvailAll = allEntries.filter((v) => !v.feesAvailable).length;
  const pendingAll = totalAll - doneAll - notAvailAll;
  const pctAll = Math.round((doneAll / totalAll) * 100);

  console.log(`OVERALL: ${doneAll}/${totalAll} (${pctAll}%) researched, ${notAvailAll} not available, ${pendingAll} pending`);
  console.log(`Batches: ${completedBatches.size}/${batchFiles.length} completed`);
}

main();
