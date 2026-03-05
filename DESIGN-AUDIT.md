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
| Arbitrary font sizes across components | Multiple | Prefer text-sm / text-base / label-xs where possible; document one-off rem where needed. |
| Currency dropdown options small touch target | CurrencyToggle.tsx | Increase py for listbox options on touch (e.g. py-2.5 or py-3). |

### Deferred (Phase 3 — design language)

- Full palette/typography shift to Rightmove + Louvre (new tokens, project.mdc, Tailwind theme).
- Replace Hermès orange with new primary where defined.
- Systematic pass to replace all one-off `text-[0.8125rem]` etc. with design scale.

---

## Status

- **Fixed:** Footer duplicate link; footer hex colours replaced with design tokens (text-cream-400, text-charcoal-muted, border-charcoal-light/40); header hamburger 44px min touch target; SchoolCard padding `sm:p-7` → `sm:p-8`; currency dropdown options min-height 44px on mobile; homepage city grid `gap-5` → `gap-6` for scale consistency.
- **Deferred (Phase 3):** New design language (Rightmove + Louvre palette, type scale, project.mdc, Tailwind theme, full component refresh). The skill and this audit support that when you’re ready.
