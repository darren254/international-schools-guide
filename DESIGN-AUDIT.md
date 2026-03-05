# Design audit — International Schools Guide

**Date:** March 2026  
**Scope:** Global (header, footer), key pages (home, city listing, school profile), rest. Desktop + mobile.  
**Design direction:** Rightmove (functionality/layout) + Louvre Abu Dhabi (aesthetics). Clean first, then align to new design language.

---

## Audit findings (summary)

### Global

| Issue | Location | Fix |
|-------|----------|-----|
| Duplicate "Insights" link in footer | SiteFooter.tsx | Remove duplicate; keep one Insights link. |
| Hardcoded hex colors in footer | SiteFooter.tsx | Use design tokens (charcoal-muted, cream-* or extend Tailwind) for #B0ACA5, #8A857E, #2E2E2E, #6A655E. |
| Hamburger touch target &lt; 44px on mobile | SiteHeader.tsx | Increase tap area (e.g. p-3 or min touch 44px) for menu button. |

### Key pages / components

| Issue | Location | Fix |
|-------|----------|-----|
| Card padding `sm:p-7` (28px) off scale | SchoolCard.tsx | Use p-6 (24) or p-8 (32) for consistency. |
| Arbitrary font sizes across components | Multiple | ~~Prefer text-sm / text-base / label-xs~~ **Done.** Theme tokens `body-sm`, `body-xs` added; all one-off rem/px replaced with `text-body-sm`, `text-body-xs`, `text-label-xs`, `text-label-sm`, `text-display-*`, or Tailwind `text-sm`/`text-base`/`text-lg`. globals.css article-content uses rem scale with comments. |
| Currency dropdown options small touch target | CurrencyToggle.tsx | Increase py for listbox options on touch (e.g. py-2.5 or py-3). |

### Deferred (Phase 3 — design language) — DONE

- ~~Full palette/typography shift to Rightmove + Louvre~~ **Done.** New `primary` token (navy-slate #1e3a5f) added; all `hermes` usages replaced with `primary` across the app. project.mdc and code-and-model.mdc updated. Typography (font-display, font-body) unchanged. Insights layout unchanged per user preference.

---

## Status

- **Fixed:** Footer duplicate link; footer hex colours replaced with design tokens; header hamburger 44px min touch target; SchoolCard padding; currency dropdown touch targets; homepage city grid gap. **Phase 3:** primary navy-slate (#1e3a5f) added; all hermes replaced with primary; project.mdc and code-and-model.mdc updated. **Typography pass:** body-sm/body-xs tokens added; one-off font sizes replaced with design scale site-wide; globals.css aligned to scale.
- **Deferred:** None.
