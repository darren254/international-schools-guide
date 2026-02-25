# ISG Insights Deployment Checkpoint

Last updated: 2026-02-20

## Completed

- Imported source content into `content/articles/`:
  - 48 article markdown files from the content pack
  - Additional HTML source files provided by user
  - Reference docs: content plan, production prompt, fees master reference
- Replaced hardcoded insights pages with data-driven rendering:
  - `src/app/insights/page.tsx`
  - `src/app/insights/[slug]/page.tsx`
- Added article parsing/normalization pipeline:
  - `src/lib/insights/content.ts`
  - Added backlink enforcement pass: `internal_links_from` now backfills related links when direct body link is missing
  - Added stricter placeholder cleanup for all-caps production note lines
- Added "Was this helpful?" component:
  - `src/components/insights/WasHelpful.tsx`
- Build is passing (`npm run build`).
- Content plan coverage check complete:
  - expected slugs: 56
  - generated slugs: 56
  - missing: 0
  - extra: 0
- Generated HTML QA scan complete:
  - unresolved `(#number)` links: 0
  - production placeholder remnants: 0
  - internal checklist remnants: 0

## In Progress

- Editorial QA pass for generated pages:
  - verify structure parity against production prompt

## Completed QA Checks

- Metadata parity against content plan:
  - title tag: pass
  - H1: pass
  - meta description: pass
  - breadcrumbs: pass
  - mismatches found: 0
- Layout flow fix applied:
  - moved Reader Pulse + "You might also be interested in" into mid-article insertion point
  - removed pre-body interruption
  - build pass confirmed after change
- Internal link normalization pass applied:
  - stale `/insights/...` links from imported HTML sources mapped to valid site slugs
  - fallback to hub slug for any unresolved internal insight links
  - broken internal insights links remaining: 0
- Insights index layout refresh:
  - FT-style hierarchy applied to `/insights`
  - lead pillar article pinned at top
  - pillar articles highlighted in main stream
  - right sidebar sections added: "Editor's picks" and "Most read"
  - build pass confirmed after layout change

## Remaining

- Optional: strict contextual backlink insertion inside article body (currently enforced through related links block).
- Optional: additional visual styling refinements after live review.

## Resume Instructions

If session is interrupted, resume from:

1. Read this file.
2. Continue with "In Progress" and "Remaining" items.
3. Do not re-import or rebuild pipeline unless files are missing.

