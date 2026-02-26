## International Schools Guide — Insights style guide (site-wide)

This document defines the **content contract** for all Insights articles so they render consistently across **20+ cities** using the shared template and styling.

If you follow this structure, new city clusters (Hong Kong / KL / Singapore / Dubai / etc.) will inherit the same layout, typography, TOC, share bar, and editorial components automatically.

---

## 1) How Insights articles are rendered (single shared template)

- **Template**: `src/app/insights/[slug]/page.tsx`
- **Typography + editorial styling**: `src/app/globals.css` (the `.article-content` system)
- **Markdown/HTML ingest + transforms**: `src/lib/insights/content.ts`
- **Article sources**: `content/articles/*.(md|html)`

There are **no per-article layouts**. All Insights share the same page component.

---

## 2) Required frontmatter (Markdown articles)

Every `content/articles/*.md` should have YAML frontmatter.

Minimum required:

```yaml
---
title: "Title tag for SEO | The International Schools Guide"
slug: /insights/your-article-slug
h1: "On-page H1"
standfirst: "One-sentence standfirst."
meta_description: "Meta description."
breadcrumbs: "Home > Insights > <Category> > <Page title>"
schema: Article, BreadcrumbList
date: "Originally published: 25 February 2026"
read_time: "9 min read"
internal_links_to:
  - "#1 Best International Schools in Jakarta"
internal_links_from:
  - "#1 Best International Schools in Jakarta"
---
```

Notes:
- **`slug` must start with** `/insights/…`
- **`breadcrumbs` uses `>`** separators (the template renders them as clickable breadcrumbs)
- **`date` must include** `Originally published:` (the template expects this format)

---

## 3) Standard article structure (in the Markdown body)

### 3.1 Hero image placeholder

Put this comment near the top (it will be removed during ingest):

```md
<!-- IMAGE PLACEHOLDER: Hero — short description -->
```

### 3.2 TL;DR (required)

Use exactly this pattern:

```md
## TL;DR

- Bullet 1…
- Bullet 2…
- Bullet 3…
```

- Use **3–6 bullets**
- End bullets with **periods** for consistency

### 3.3 In this article (TOC)

Use:

```md
## In this article

- [Section label](#section-anchor)
- [Next section](#next-anchor)
```

Anchors:
- If you use `{#custom-anchor}` on headings, the ingest pipeline will convert it into a proper HTML id.
- Otherwise, ids are auto-generated from the heading text.

### 3.4 Body headings

- Use **H2 (`##`)** for major sections.
- Use **H3 (`###`)** for subsections.
- Avoid multiple H1s.

---

## 4) “Ranking” articles: required patterns

### 4.1 Ranked school headings (for automatic section photo placeholders)

If you want the template to auto-insert a **photo placeholder block** above each school section, format the H3 like:

```md
### 1. JIS - Jakarta Intercultural School
```

Rules:
- Must be an **H3**
- Must start with `N.` then a space
- Must include `ACRONYM -` (e.g. `JIS -`, `ISJ -`, `BSJ -`, `AIS -`)

### 4.2 Facts panels (Curriculum / Accreditation / Fees, etc.)

Write facts as **bold label + colon**:

```md
**Curriculum:** British (Cambridge)
**Accreditation:** CIS, BSO
**Fees:** $8,919–$32,910
```

This is transformed into a clean, rule-led facts strip.

### 4.3 “Best for” blocks

Use:

```md
**Best for:** Families who…
```

This is transformed into a small-caps label with bullets in the normal flow (no callout box).

### 4.4 Tables

Use normal Markdown tables:

```md
| Rank | School | Fee Range (USD) |
|------|--------|-----------------|
| 1 | JIS | $17K–$36K |
```

Tables are rendered with:
- Light small-caps headers
- A strong rule under the header row
- Thin row rules
- Horizontal scrolling on small screens (wrapper added automatically)

---

## 5) Related school profile cards (“Jump to a school profile”)

The template can show “Jump to a school profile” cards automatically based on **schools mentioned in the article body**.

To ensure a school appears:
- Mention the **school name** (or short name) as it appears in `src/data/schools.ts`.

---

## 6) What NOT to include (critical)

### 6.1 No publisher / affiliation disclosures for schools

Do **not** include any text like:
- “Published by <school>”
- “This comparison is written by <school>”
- “<school> is one of the schools covered…”

The site is the publisher. Articles must not imply ownership, affiliation, or sponsorship by any school.

### 6.2 No brand-name “inspiration” references

Do not reference other publications or internal design codenames in on-site copy (e.g. “FT-style”, “NYT-style”, etc.).

---

## 7) City expansion guidance (20+ cities)

The formatting rules above are **city-agnostic**.

For each new city cluster:
- Create new `content/articles/*` files with slugs like `/insights/best-international-schools-hong-kong`, `/insights/international-school-fees-singapore`, etc.
- Keep the same structure (`TL;DR`, `In this article`, consistent H2/H3 usage, facts labels, tables).

Internal link numbering notes:
- Some older Jakarta content uses `(#12)` / `#12` style numeric references tied to a single city content plan.
- For new city clusters, prefer **direct links** (`/insights/<slug>`) unless/until a multi-city content plan system is added.

---

## 8) Pre-publish checklist (fast)

- [ ] Frontmatter present and correct (`slug`, `breadcrumbs`, `date`, `read_time`)
- [ ] `## TL;DR` exists with 3–6 bullets
- [ ] `## In this article` exists and links work
- [ ] All ranked school headings follow `### N. ACRONYM - Name` (if you want placeholders)
- [ ] Facts use `**Label:** value` formatting
- [ ] No “Published by …” / school affiliation copy anywhere
- [ ] Fees are consistent (USD, same ranges in text + tables)

