# Profile briefings 21–30 — progress log

**Source:** `/Users/darren/Desktop/profiles email isg 21-30`  
**Started:** 2026-03-04  
**Completed:** 2026-03-04

## Batches

| Batch | City         | File (schools) | Status   |
|-------|--------------|----------------|----------|
| 23    | Singapore    | 21-25          | Done     |
| 24    | Singapore    | 26-30          | Done     |
| 25    | Kuala Lumpur | 21-25          | Done     |
| 26    | Kuala Lumpur | 26-30          | Done     |
| 27    | Bangkok      | 21-25          | Done     |
| 28    | Bangkok      | 26-30          | Done     |
| 29    | Hong Kong    | 21-25          | Done     |
| 30    | Hong Kong    | 26-30          | Done     |
| 31    | Dubai        | 21-25          | Skipped (EML format; 0 blocks parsed) |
| 32    | Dubai        | 26-30          | Done     |

## Summary

- **Parsed:** 45 school briefings from 10 EML files (9 files had parseable blocks; Dubai 21-25 had a different header format and yielded 0 blocks).
- **Matched to slug:** 39 schools (6 no-match: St Joseph's Institution International, Taylor's Puchong, St John's KL, Etonhouse KL, St Stephen's Bangkok, International College HK).
- **Intelligence overrides added:**
  - **Singapore:** 9 new (north-london-collegiate-school, brighton-college, the-winstedt-school, dover-court-international-school, dynamics-international-school, sir-manasseh-meyer-international-school, insworld-institute, international-french-school, integrated-international-school).
  - **Kuala Lumpur:** 6 new (peninsula-international-school-australia, eaton-international-school, ucsi-international-school, hibiscus-international-school, tanarata-international-school, idrissi-international-school). Parkcity already had an override.
  - **Bangkok:** 9 new (ruamrudee-international-school, st-andrews-international-school-sukhumvit-107, st-andrews-international-school-sathorn, d-prep-international-school, ascot-international-school, charter-international-school, wells-international-school, garden-international-school, kpis-international-school).
  - **Hong Kong:** 9 new (christian-alliance-international-school, international-christian-school, american-international-school, discovery-bay-international-school, renaissance-college, west-island-school, island-school, concordia-international-school, dsc-international-school).
  - **Dubai:** 5 new (regent-international-school, jebel-ali-school, arcadia-school, universal-american-school, hartland-international-school).

## Files changed

- `src/data/singapore-schools-profiles.ts` — 9 new `applySingaporeIntelligence` calls.
- `src/data/kuala-lumpur-schools-profiles.ts` — 6 new `applyKLIntelligence` calls.
- `src/data/bangkok-schools-profiles.ts` — 9 new `applyBangkokIntelligence` calls.
- `src/data/hong-kong-schools-profiles.ts` — 9 new `applyHongKongIntelligence` calls.
- `src/data/dubai-schools-profiles.ts` — 5 new `applyDubaiIntelligence` calls.

## Scripts and artefacts

- `scripts/profile-briefings-21-30/parse-eml-briefings.ts` — EML parser (extracts plain text, school blocks, vibe/tradeoffs/pros/cons, maps to slug).
- `scripts/profile-briefings-21-30/extracted.json` — Full extracted briefings (with slug when matched).
- `scripts/profile-briefings-21-30/parse-log.txt` — Per-school city, number, name, slug (or NO MATCH).
- Manual slug overrides in parser: THE INTERNATIONAL SCHOOL @ PARKCITY → the-international-school-at-parkcity; ESF ISLAND SCHOOL → island-school; ESF RENAISSANCE COLLEGE (RCHK) → renaissance-college; ESF WEST ISLAND SCHOOL (WIS) → west-island-school.

## Tone and rules

- Verdicts and paragraphs follow `.cursor/rules/tone.mdc`: direct advice, qualifiers, no brochure language, attribution mid-paragraph where used, max 2 hyphens per paragraph.
- Banned phrases avoided; contractions used; positives/considerations kept to 2–3 sentences per bullet where possible.
