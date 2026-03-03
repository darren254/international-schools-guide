# Intelligence briefings pipeline

Parsed school briefings from `.eml` exports (e.g. from `~/Desktop/INTELLIGENCE EDITORIAL/`).

## Extract

From project root:

```bash
python3 scripts/parse-intelligence-eml.py
# Or with a custom folder:
python3 scripts/parse-intelligence-eml.py "/path/to/eml/folder"
```

Output: one JSON file per city under `scripts/intelligence-briefings/` (e.g. `kuala-lumpur.json`, `singapore.json`, `bangkok.json`). Each file is an array of objects with `vibe`, `tradeoffs`, `pros`, `cons`, plus `_source` and `_heading` for mapping.

Hong Kong and Dubai EML files are detected by filename; if they produce empty arrays, the email body structure may differ (e.g. HTML-only or different section markers).

## Map → Adapt → Patch

1. **Map** — Match `_heading` (e.g. "1. INTERNATIONAL SCHOOL OF KUALA LUMPUR (ISKL)") to app slugs in `src/data/{city}-schools.ts`.
2. **Adapt** — Rewrite using `docs/INTELLIGENCE_BRIEFING_ADAPTATION.md`, `TONE.md`, and `docs/SCHOOL_PROFILE_WRITING_GUIDELINES.md`. Apply sensitivity rules; keep copy direct and scannable.
3. **Patch** — In `src/data/{city}-schools-profiles.ts`, after building the profile map, override `intelligence` for each slug (see Dubai JESS and KL Batch 1 in `kuala-lumpur-schools-profiles.ts`).

KL Batch 1 (ISKL, Alice Smith, GIS, BSKL, Epsom) is already patched in `kuala-lumpur-schools-profiles.ts`.
