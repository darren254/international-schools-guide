import { neon } from "@neondatabase/serverless";
import { getInsightArticleBySlug } from "@/lib/insights/content";
import { extractClaims } from "./stages/extract-claims";
import { compareCanonical } from "./stages/canonical-compare";
import { scanCrossArticle } from "./stages/cross-article";
import { generateVerdicts } from "./stages/verdict";
import { classifySeverity } from "./stages/severity";
import { buildReport } from "./stages/report";
import type {
  FactCheckReport,
  JudgedClaim,
  PipelineContext,
  ClaimType,
  Verdict,
  Severity,
} from "./types";

type Sql = ReturnType<typeof neon>;

function getSql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is required");
  return neon(url);
}

async function createRun(sql: Sql, articleSlug: string): Promise<string> {
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO fact_check_runs (id, article_slug, status, started_at)
    VALUES (${id}, ${articleSlug}, 'running', NOW())
  `;
  return id;
}

async function updateRunStage(sql: Sql, runId: string, stage: string) {
  await sql`
    UPDATE fact_check_runs SET stage_reached = ${stage} WHERE id = ${runId}
  `;
}

async function completeRun(
  sql: Sql,
  runId: string,
  report: FactCheckReport,
) {
  const duration = Date.now() - new Date(report.timestamp).getTime();
  await sql`
    UPDATE fact_check_runs SET
      status = 'completed',
      stage_reached = 'report',
      claims_extracted = ${report.summary.high + report.summary.medium + report.summary.low + report.summary.correct + report.summary.unverifiable},
      high_count = ${report.summary.high},
      medium_count = ${report.summary.medium},
      low_count = ${report.summary.low},
      report = ${JSON.stringify(report)},
      completed_at = NOW(),
      duration_ms = ${duration}
    WHERE id = ${runId}
  `;
}

async function failRun(sql: Sql, runId: string, error: string) {
  await sql`
    UPDATE fact_check_runs SET
      status = 'failed',
      error = ${error},
      completed_at = NOW()
    WHERE id = ${runId}
  `;
}

async function persistClaims(
  sql: Sql,
  runId: string,
  claims: JudgedClaim[],
) {
  for (const claim of claims) {
    await sql`
      INSERT INTO fact_check_claims (
        id, run_id, claim_index, original_text, claim_type,
        school_slug, canonical_value, verdict, severity,
        rationale, confidence, isj_bias_applied, stage_data
      ) VALUES (
        ${crypto.randomUUID()},
        ${runId},
        ${claim.claimIndex},
        ${claim.originalText},
        ${claim.claimType},
        ${claim.schoolSlug},
        ${claim.canonical.canonicalValue},
        ${claim.verdict},
        ${claim.severity},
        ${claim.rationale},
        ${claim.confidence},
        ${claim.isjBiasApplied},
        ${JSON.stringify({
          extraction: { extractedValue: claim.extractedValue },
          canonical: claim.canonical,
          crossArticle: claim.crossArticleMatches,
        })}
      )
    `;
  }
}

export async function runFactCheck(articleSlug: string): Promise<FactCheckReport> {
  console.log(`\n=== Fact Check: ${articleSlug} ===\n`);

  const sql = getSql();
  const runId = await createRun(sql, articleSlug);

  try {
    const article = getInsightArticleBySlug(articleSlug);
    if (!article) {
      throw new Error(`Article not found: ${articleSlug}`);
    }

    const ctx: PipelineContext = {
      runId,
      articleSlug,
      articleText: "",
      articleHtml: article.bodyHtml,
      startedAt: new Date(),
    };

    // Stage 1: Extract claims
    await updateRunStage(sql, runId, "extract_claims");
    const rawClaims = await extractClaims(ctx);

    // Stage 2: Canonical comparison
    await updateRunStage(sql, runId, "canonical_compare");
    const { annotated, warnings } = compareCanonical(rawClaims);

    // Stage 3: Cross-article consistency
    await updateRunStage(sql, runId, "cross_article");
    const withCrossArticle = scanCrossArticle(annotated, articleSlug);

    // Stage 4: Verdict generation
    await updateRunStage(sql, runId, "verdict");
    const verdicts = await generateVerdicts(withCrossArticle);

    // Stage 5: Severity ranking
    await updateRunStage(sql, runId, "severity");
    const judgedClaims: JudgedClaim[] = withCrossArticle.map((claim) => {
      const v = verdicts.find((vr) => vr.claimIndex === claim.claimIndex);
      const verdict: Verdict = v?.verdict ?? "unverifiable";
      const severity: Severity = classifySeverity(verdict, claim.claimType as ClaimType);

      return {
        ...claim,
        verdict,
        severity,
        rationale: v?.rationale ?? "No verdict generated",
        confidence: v?.confidence ?? 0,
        isjBiasApplied: v?.isjBiasApplied ?? false,
      };
    });

    // Stage 6: Build report
    await updateRunStage(sql, runId, "report");
    const report = buildReport(articleSlug, runId, judgedClaims, warnings);

    // Stage 7: Persist
    await persistClaims(sql, runId, judgedClaims);
    await completeRun(sql, runId, report);

    console.log(`\n=== Fact Check Complete ===`);
    console.log(`  Run ID: ${runId}`);
    console.log(`  Claims: ${judgedClaims.length}`);
    console.log(`  HIGH: ${report.summary.high} | MEDIUM: ${report.summary.medium} | LOW: ${report.summary.low}`);
    console.log(`  Correct: ${report.summary.correct} | Unverifiable: ${report.summary.unverifiable}`);
    console.log(`  Warnings: ${warnings.length}\n`);

    return report;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n=== Fact Check FAILED: ${message} ===\n`);
    await failRun(sql, runId, message);
    throw err;
  }
}
