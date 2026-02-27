/**
 * CLI runner for the fact-check pipeline.
 *
 * Usage:
 *   npx tsx scripts/run-fact-check.ts <article-slug>
 *   npx tsx scripts/run-fact-check.ts --all
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { runFactCheck } from "../src/lib/fact-check/pipeline";
import { getAllInsightArticles } from "../src/lib/insights/content";
import type { FactCheckReport } from "../src/lib/fact-check/types";

function printReport(report: FactCheckReport) {
  console.log("\n" + "═".repeat(70));
  console.log(`FACT CHECK REPORT: ${report.articleSlug}`);
  console.log(`Run ID: ${report.runId}`);
  console.log(`Timestamp: ${report.timestamp}`);
  console.log("═".repeat(70));

  console.log(
    `\nSummary: ${report.summary.high} HIGH | ${report.summary.medium} MEDIUM | ${report.summary.low} LOW | ${report.summary.correct} correct | ${report.summary.unverifiable} unverifiable`,
  );

  if (report.highSeverity.length > 0) {
    console.log("\n" + "─".repeat(70));
    console.log("HIGH SEVERITY");
    console.log("─".repeat(70));
    for (const claim of report.highSeverity) {
      console.log(`\n  [${claim.claimType}] ${claim.schoolSlug ?? "general"}`);
      console.log(`  Text: "${claim.originalText.slice(0, 120)}..."`);
      console.log(`  Issue: ${claim.issue}`);
      console.log(`  Canonical: ${claim.canonicalValue ?? "N/A"}`);
      console.log(`  Verdict: ${claim.verdict} (confidence: ${claim.confidence})`);
      console.log(`  Rationale: ${claim.rationale}`);
    }
  }

  if (report.mediumSeverity.length > 0) {
    console.log("\n" + "─".repeat(70));
    console.log("MEDIUM SEVERITY");
    console.log("─".repeat(70));
    for (const claim of report.mediumSeverity) {
      console.log(`\n  [${claim.claimType}] ${claim.schoolSlug ?? "general"}`);
      console.log(`  Text: "${claim.originalText.slice(0, 120)}..."`);
      console.log(`  Issue: ${claim.issue}`);
      console.log(`  Canonical: ${claim.canonicalValue ?? "N/A"}`);
      console.log(`  Verdict: ${claim.verdict} (confidence: ${claim.confidence})`);
    }
  }

  if (report.lowSeverity.length > 0) {
    console.log("\n" + "─".repeat(70));
    console.log("LOW SEVERITY");
    console.log("─".repeat(70));
    for (const claim of report.lowSeverity) {
      console.log(`\n  [${claim.claimType}] ${claim.schoolSlug ?? "general"}`);
      console.log(`  Text: "${claim.originalText.slice(0, 120)}..."`);
      console.log(`  Issue: ${claim.issue}`);
    }
  }

  if (report.consistencyWarnings.length > 0) {
    console.log("\n" + "─".repeat(70));
    console.log("CONSISTENCY WARNINGS");
    console.log("─".repeat(70));
    for (const w of report.consistencyWarnings) {
      console.log(`\n  School: ${w.schoolSlug} | Field: ${w.field}`);
      for (const v of w.values) {
        console.log(`    ${v.source}: ${v.value}`);
      }
    }
  }

  if (report.unverifiableClaims.length > 0) {
    console.log("\n" + "─".repeat(70));
    console.log(`UNVERIFIABLE CLAIMS (${report.unverifiableClaims.length})`);
    console.log("─".repeat(70));
    for (const claim of report.unverifiableClaims.slice(0, 10)) {
      console.log(`  [${claim.claimType}] "${claim.originalText.slice(0, 100)}..."`);
    }
    if (report.unverifiableClaims.length > 10) {
      console.log(`  ... and ${report.unverifiableClaims.length - 10} more`);
    }
  }

  console.log("\n" + "═".repeat(70) + "\n");
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: npx tsx scripts/run-fact-check.ts <slug> | --all");
    process.exit(1);
  }

  if (args[0] === "--all") {
    const articles = getAllInsightArticles();
    console.log(`Running fact check on ${articles.length} articles...\n`);

    let totalHigh = 0;
    let totalMedium = 0;

    for (const article of articles) {
      try {
        const report = await runFactCheck(article.slug);
        totalHigh += report.summary.high;
        totalMedium += report.summary.medium;
        printReport(report);
      } catch (err) {
        console.error(`Failed: ${article.slug} — ${err}`);
      }
    }

    console.log(`\nAll done. Total: ${totalHigh} HIGH, ${totalMedium} MEDIUM across ${articles.length} articles.`);
  } else {
    const slug = args[0];
    const report = await runFactCheck(slug);
    printReport(report);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
