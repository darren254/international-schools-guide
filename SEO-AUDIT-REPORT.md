# SEO, Performance & Discoverability Audit Report

**Date:** 20 February 2026  
**Scope:** All pages, metadata, structured data, sitemap, robots, llms.txt, GA4, performance.

---

## Summary

- **SEO:** Titles, meta descriptions, canonicals, and Open Graph tags added or fixed across all pages. JSON-LD EducationalOrganization on school profiles enriched with fees/curriculum; BreadcrumbList on city and school pages.
- **Sitemap & robots:** `sitemap.xml` and `robots.txt` generated at build (Next.js metadata routes). Sitemap includes homepage, city index, Jakarta, compare, insights, news, about, one news article, and all 66 school profile URLs.
- **LLM discoverability:** `public/llms.txt` added per llms.txt standard (H1, blockquote, key pages, content structure, JSON-LD guidance, contact).
- **GA4:** Script injected in root layout when `NEXT_PUBLIC_GA_ID` is set; uses `next/script` with `strategy="afterInteractive"`.
- **Performance:** Build completes with no errors. All first-load JS under 104 KB (under 200 KB target). Semantic HTML (header, main, footer, nav, section, article) used across the app.

---

## 1. SEO — What Was Done

### Title tags (<70 chars)

| Page | Title | Length |
|------|--------|--------|
| Home | Find the Right International School | 38 |
| About | About Us | 9 |
| Insights | Insights | 9 |
| News | News | 4 |
| News article | ISJ claims top ranking on international schools platform | 52 |
| Explore | Explore International Schools — Jakarta (from layout) | 43 |
| Jakarta city | International Schools in Jakarta — Fees, Reviews & Comparison | 58 |
| School profiles | From data (e.g. "Jakarta Intercultural School (JIS) — Fees, IB Results & Review") | Varies, under 70 |
| Compare | Compare Schools | 15 |

All titles are unique and under 70 characters. Template suffix " — International Schools Guide" is applied by root layout where needed for full display.

### Meta descriptions (<160 chars)

- Set on all pages; either page-level or layout-level. Descriptions are unique and under 160 characters.

### H1 tags

- One H1 per page verified: Home ("Find the right international school"), About ("We help families find the right school..."), Insights ("Our Insights"), News ("News"), Explore (in client), Jakarta ("International Schools in {city}"), Compare ("Compare Schools"), School profile (in masthead), News article (article title).

### JSON-LD

- **School profiles:** `EducationalOrganization` with name, description, url, telephone, email, address (PostalAddress array), foundingDate, numberOfStudents, **curriculum** (comma-separated), **priceRange** (e.g. "US$23K – US$37K"), and **offers** (AggregateOffer with priceCurrency USD, lowPrice, highPrice) for LLM and search parsing.
- **Breadcrumbs:** `BreadcrumbList` on city page (International Schools → Jakarta) and on school profile (International Schools → Jakarta → School name).

### Open Graph

- Root layout sets default `openGraph.type`, `siteName`, `images` (default `/og-default.png`). Each page (or generateMetadata) sets `openGraph.title`, `description`, `url`; news article sets `type: "article"`, school profile sets `type: "profile"` and image.

### Canonical URLs

- Set via `metadata.alternates.canonical` on all pages using `https://international-schools-guide.com` and the correct path (including dynamic school and news slug).

### Orphan pages

- None. All generated pages (home, about, insights, news, compare, international-schools, jakarta, 66 school profiles, 1 news article) are linked from the header, footer, homepage, or sitemap.

---

## 2. What’s Missing or Broken (No Code Changes)

- **Broken internal links (target pages don’t exist):**
  - **/for-schools/** — linked from homepage "Claim Your Profile". No route exists.
  - **/contact/** — linked from About "Get in Touch" and footer "Contact" and "For Schools" (Update Your Info, etc.). No route exists.
  - **/privacy/** and **/terms/** — linked from footer. No routes exist.

  Add these routes when ready, or change links to `#` / mailto until then.

- **Insight article URLs:** Insights index links to paths like `/insights/choosing-international-school-jakarta`. There is no `app/insights/[slug]/page.tsx`, so those URLs 404. Only the insights index is in the sitemap.

- **OG image:** Default `openGraph.images` points to `/og-default.png`. That file is not in `public/`. Add a 1200×630 image at `public/og-default.png` (and optionally per-school images later) for correct social previews.

---

## 3. LLM Discoverability

- **llms.txt** added at **/llms.txt** (from `public/llms.txt`):
  - H1: International Schools Guide
  - Blockquote: what the site is, independence statement
  - Sections: What This Site Is, Key Pages (with links), Content Structure, Data for LLMs (JSON-LD usage), What We Do Not Do, Contact

- **Structured data:** School profile JSON-LD includes name, fees (priceRange + AggregateOffer low/high USD), curricula, locations, so an LLM can extract school names, fees, curricula, locations; ratings are not in schema (no aggregateRating).

---

## 4. Performance

- **Semantic HTML:** `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>` used in layout and pages.
- **Images:** SchoolCard and PhotoStrip use `<img>` with `alt` (and next/image is not required with `images.unoptimized: true` for static export). Placeholders on news/insights are divs with descriptive text (no img).
- **Fonts:** Cormorant Garamond and Inter loaded via `next/font/google` with `display: "swap"`; no extra preload needed.
- **Build:** `npm run build` completes; no build warnings or errors.
- **Bundle size:** No page exceeds 200 KB first-load JS. Largest: /compare and /international-schools at ~103 KB first-load; others 94–97 KB. Shared JS ~87 KB.

---

## 5. GA4

- In **`src/app/layout.tsx`**:
  - If `process.env.NEXT_PUBLIC_GA_ID` is set:
    - Script tag loads `https://www.googletagmanager.com/gtag/js?id={id}` with `strategy="afterInteractive"`.
    - Inline script configures `gtag('config', id)` with `strategy="afterInteractive"`.
  - If unset, no GA script is rendered.

Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in `.env.local` (and in Cloudflare build env) to enable GA4.

---

## 6. Files Touched

| File | Change |
|------|--------|
| `src/app/layout.tsx` | metadataBase, default openGraph/twitter/robots; GA4 Script when NEXT_PUBLIC_GA_ID set |
| `src/app/page.tsx` | canonical, openGraph |
| `src/app/about/page.tsx` | canonical, openGraph |
| `src/app/insights/page.tsx` | canonical, openGraph |
| `src/app/news/page.tsx` | canonical, openGraph |
| `src/app/news/[slug]/page.tsx` | generateMetadata with canonical/OG, title shortened for length |
| `src/app/compare/layout.tsx` | **New** — metadata for compare (title, description, canonical, openGraph) |
| `src/app/international-schools/layout.tsx` | canonical, openGraph |
| `src/app/international-schools/[city]/page.tsx` | generateMetadata (canonical, OG), BreadcrumbList JSON-LD |
| `src/app/international-schools/[city]/[school]/page.tsx` | generateMetadata (canonical, OG, image), BreadcrumbList + enriched EducationalOrganization (curriculum, priceRange, offers), fees helpers import |
| `src/app/sitemap.ts` | **New** — sitemap for all static + school URLs |
| `src/app/robots.ts` | **New** — allow /, disallow /api/, sitemap URL |
| `public/llms.txt` | **New** — llms.txt for LLM discoverability |

---

## 7. Next Steps (Optional)

1. Add **public/og-default.png** (1200×630) for default OG/Twitter cards.
2. Add **/contact**, **/for-schools**, **/privacy**, **/terms** (or replace links with mailto/#).
3. Add **app/insights/[slug]/page.tsx** and list insight articles in sitemap when you have content.
4. When moving to server rendering, consider dynamic sitemap/robots if URLs become dynamic.
git push origin main
