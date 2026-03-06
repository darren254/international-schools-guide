---
name: web-design-audit
description: "Audits and cleans up the site's design (desktop and mobile). Use when the user asks for a design audit, cleanup, 'looks messy', 'professional', 'mobile and desktop', or references Rightmove or Louvre Abu Dhabi. Encodes audit criteria, cleanup priorities, and design direction (Rightmove + Louvre)."
triggers:
  - design audit
  - clean up design
  - looks messy
  - professional
  - mobile and desktop
  - Rightmove
  - Louvre
---

# Web Design Audit & Cleanup

Audits pages and components for alignment, spacing, typography, touch targets, responsive behaviour, and visual noise. Design direction: **Rightmove** (functionality, layout, cards, filters) + **Louvre Abu Dhabi** (calm aesthetics, typography, space, minimal clutter).

## When to use

- User asks for a design audit, cleanup, or to make the site look sharper or more professional.
- User says the site "looks messy", "not professional", or wants consistency on "mobile and desktop".
- User references Rightmove or Louvre (or similar) as design inspiration.
- When adding new pages or components and you need to match the same design bar.

## Audit checklist (every page/component)

- **Alignment and grid:** Consistent horizontal alignment, column gutters, no floating or misaligned blocks.
- **Spacing:** Use the project spacing scale (4, 8, 12, 16, 24, 32, 48, 64). No arbitrary gaps (e.g. `mb-7`, `gap-11`) unless justified; consistent section rhythm.
- **Typography hierarchy:** One clear H1 per page; heading levels (H2/H3) don't skip; label sizes (`text-label-xs`, `text-label-sm`) and body sizes consistent; no one-off `text-[13px]`-style overrides without reason.
- **Touch targets (mobile):** Buttons and links ≥44px height or padding where possible; no cramped tap areas.
- **Responsive behaviour:** No horizontal scroll; breakpoints consistent (Tailwind `sm`/`md`/`lg`); sticky/fixed elements don't obscure content (e.g. sidebar + overlays).
- **Visual noise:** Redundant borders (double borders where one suffices); too many background shades; inconsistent card styles.
- **Consistency:** Same component (e.g. `SchoolCard`, `SectionHeader`, `Button`) used the same way; no ad-hoc copies with different spacing or borders.

## Cleanup priority

1. Fix alignment and spacing.
2. Unify typography and remove one-off overrides.
3. Reduce visual noise (borders, backgrounds).
4. Improve touch targets and responsive behaviour.
5. Apply Rightmove/Louvre-inspired design language (colours, type, component style) per project design tokens.

## Design direction

- **Rightmove:** Clear filters, card layout, hierarchy, primary actions. Scannable lists; consistent filter/sort placement.
- **Louvre Abu Dhabi:** Calm palette, generous whitespace, restrained typography, minimal decoration, editorial/museum quality.
- The skill treats these as the target look. Once the new system is defined, reference it (and any updated project.mdc / design tokens) in the skill. Use `primary` for links and CTAs (Rightmove + Louvre design language).

## Output format for audits

Produce a structured list:

```markdown
## [Page or component name]
- **Issue:** [what's wrong]
  **Location:** [file or element]
  **Fix:** [brief suggestion]
```

Audit at desktop (e.g. 1280px) and mobile (375px); note any breakpoint where layout or spacing breaks.

## Reference

- Project design system: [.cursor/rules/project.mdc](.cursor/rules/project.mdc) (colours, type, layout rules).
- Design references: Rightmove.co.uk (functionality/layout), louvreabudhabi.ae (aesthetics).
