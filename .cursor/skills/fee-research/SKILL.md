---
name: fee-research
description: Imports school fee research data into the fee pipeline. Use when the user pastes structured fee data with [slug] ANNUAL FEES format, mentions "batch", "fees", "fee research", or asks to import, update, or check progress on school fees. Also use when the user asks to generate new research sheets or validate fee data.
---

# Fee Research

## Architecture

`data/fees.json` is the single source of truth for all school fee data. The city profile TypeScript files (`src/data/*-school-profiles.ts`) are **generated** from it — never hand-edit them.

### Key paths

- SSOT: `data/fees.json`
- Batch prompts: `data/fee-research/<city>-batch-<n>.txt`
- Results: `data/fee-research/results/<city>-batch-<n>-result.txt`
- Scripts: `scripts/import-fees-from-perplexity.ts`, `generate-fee-profiles.ts`, `validate-fees.ts`, `sync-card-fees-from-profiles.ts`, `fee-research-progress.ts`, `generate-fee-research-sheets.ts`

---

## Workflow: User pastes fee research output

When the user pastes fee data in the `[slug] ANNUAL FEES:` format (from any source — Perplexity, Claude, manual research, etc.):

### 1. Identify the batch

Match the slugs against `data/fee-research/<city>-batch-<n>.txt` files to determine the city and batch number. If unclear, check which batch contains those slugs.

### 2. Save the result file

Save the pasted content to `data/fee-research/results/<city>-batch-<n>-result.txt`. Keep only the structured `[slug]` format lines — strip any commentary, markdown formatting, or conversational text that isn't part of the data format.

### 3. Run the import pipeline

Run these scripts **in order**:

```bash
npx tsx scripts/import-fees-from-perplexity.ts data/fee-research/results/<file>.txt
npx tsx scripts/generate-fee-profiles.ts
npx tsx scripts/validate-fees.ts
npx tsx scripts/sync-card-fees-from-profiles.ts --apply
npx tsx scripts/fee-research-progress.ts
```

### 4. Report results

After the pipeline completes, report:
- How many schools were updated vs marked "fees not available"
- Any unknown slugs or unparsed lines (these need attention)
- Any new validation warnings specific to the imported schools
- Card fee sync changes
- Updated progress (city completion %, batch status)

---

## Expected input format

```
[slug] ANNUAL FEES:
- Grade Name: 122,500
- Grade Name: 146,500
[slug] ONE-TIME FEES:
- Fee Name: 5,000
[slug] SOURCE: https://example.com
[slug] YEAR: 2025-2026
```

Or for unavailable fees:

```
[slug] FEES NOT AVAILABLE
[slug] SOURCE: https://example.com
```

### Handled edge cases

The import script already handles these — no manual cleanup needed:

- **Commas in numbers** (122,500 → 122500)
- **Programme sub-headings** ("International Bilingual Programme:") — skipped
- **NOTE/NOTES lines** (`[slug] NOTE: ...`) — skipped
- **FEES NOT AVAILABLE with one-time fees** — marks `feesAvailable: false` but preserves one-time fees
- **Grade ranges** ("Year 1 - Year 2") — age guessed from first grade in range
- **Shorthand grades** (G1, G6, K1, EY1) — mapped to ages

---

## Other operations

### Generate new research batch files

If the user asks for new or regenerated batch files:

```bash
npx tsx scripts/generate-fee-research-sheets.ts
```

Output goes to `data/fee-research/`. Each file contains a research prompt with 10 schools, their slugs, names, and websites.

### Check progress

```bash
npx tsx scripts/fee-research-progress.ts
```

Shows per-city completion bars, which batches are done `[n]` vs pending `n`, and overall stats.

### Validate all fees

```bash
npx tsx scripts/validate-fees.ts
```

Checks for: out-of-range amounts, empty fee rows with `feesAvailable: true`, age=0 rows, suspicious low amounts (possible per-term), unverified sources.

### Publishing

When the user says "pub" or "publish" after importing batches, follow the standard publish workflow (sync schools from DB, git add, commit, push).
