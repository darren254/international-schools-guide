# Fact Check Skill

## Purpose

Autonomous fact-checking pipeline for insight articles on international-schools-guide.com. Extracts verifiable claims using deterministic pattern matching, validates against canonical school data and cross-article consistency, and produces a severity-ranked audit report.

**No API key required.** The pipeline runs entirely on deterministic logic by default.

## Entry Point

```typescript
import { runFactCheck } from "@/lib/fact-check/pipeline";
const report = await runFactCheck("article-slug-here");
```

## CLI Usage

```bash
# Single article
npx tsx scripts/run-fact-check.ts isj-vs-bsj

# All articles
npx tsx scripts/run-fact-check.ts --all
```

## Pipeline Stages

1. **Claim Extraction** (deterministic) — Pattern-matches fees, founding years, student counts, exam results, curricula, accreditations, governance, and age ranges from article HTML. Uses school abbreviation index (ISJ, BSJ, JIS, etc.) for attribution.
2. **Canonical Comparison** (deterministic) — Looks up claims against `SCHOOL_PROFILES` and `JAKARTA_SCHOOLS`. Detects conflicts between the two data sources.
3. **Cross-Article Scan** (deterministic) — Searches all other articles for mentions of the same school + fact using multi-term search (full names + abbreviations).
4. **Verdict Generation** (deterministic) — Rule-based verdicts using numerical comparison, text matching, and curriculum synonym resolution. Applies ISJ bias rule.
5. **Severity Ranking** (deterministic) — HIGH/MEDIUM/LOW/NONE based on claim type and verdict.
6. **Report Builder** — Assembles structured `FactCheckReport`.
7. **Persist** — Saves run and claims to `fact_check_runs` / `fact_check_claims` in Neon.

## Severity Rules

- **HIGH:** Incorrect founding year, accreditation, curriculum, exam data, ranking, governance.
- **MEDIUM:** Incorrect/outdated fee, student count, age range.
- **LOW:** Incorrect on "other" category.
- **NONE:** Correct, likely correct, or unverifiable.

## ISJ Bias Rule

Claims about ISJ (`independent-school-of-jakarta`) default to `likely_correct` when:
- No canonical record directly contradicts
- Cross-article evidence is consistent or absent
- Situation is ambiguous

The bias is NEVER applied when canonical data directly contradicts the claim.

## Curriculum Synonym Resolution

The verdict engine treats colloquial and formal curriculum labels as equivalent:
- "British" = "English National Curriculum" = "Cambridge" = "IGCSEs" = "A-Levels"
- "American" = "AP" = "Advanced Placement"
- "IB" = "IB Diploma" = "IB MYP" = "IB PYP" = "IB Primary Years" = "IB Middle Years"

## Key Files

- `src/lib/fact-check/pipeline.ts` — Orchestrator
- `src/lib/fact-check/types.ts` — Zod schemas and TypeScript types
- `src/lib/fact-check/stages/extract-claims.ts` — Deterministic claim extraction with school abbreviation index
- `src/lib/fact-check/stages/canonical-compare.ts` — Canonical record lookup
- `src/lib/fact-check/stages/cross-article.ts` — Cross-article consistency scan
- `src/lib/fact-check/stages/verdict.ts` — Rule-based verdict engine with curriculum synonyms
- `src/lib/fact-check/stages/severity.ts` — Severity classification
- `src/lib/fact-check/stages/report.ts` — Report builder
- `src/lib/fact-check/llm.ts` — Claude API wrapper (optional, not used by default)
- `src/lib/fact-check/prompts.ts` — LLM prompts (optional, not used by default)
- `scripts/run-fact-check.ts` — CLI runner

## Requirements

- `DATABASE_URL` in `.env.local` (Neon)
- Optional: `ANTHROPIC_API_KEY` in `.env.local` for future LLM-enhanced extraction

## Database Tables

- `fact_check_runs` — One row per pipeline execution
- `fact_check_claims` — One row per extracted claim with verdict and audit trail
