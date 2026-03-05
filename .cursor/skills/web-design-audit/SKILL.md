---
name: web-design-audit
description: Audits and cleans up web design for desktop and mobile. Use when the user asks for a design audit, cleanup, "looks messy", "professional", "mobile and desktop", or references Rightmove or Louvre Abu Dhabi. Encodes audit checklist, cleanup priority, and design direction (Rightmove + Louvre).
---

# Web Design Audit & Cleanup

Audits pages and components for alignment, spacing, typography, touch targets, responsive behaviour, and visual noise. Design direction: **Rightmove** (functionality, layout, cards, filters) + **Louvre Abu Dhabi** (calm aesthetics, typography, space, minimal clutter).

## When to use

- User asks for a design audit, cleanup, or to make the site look sharper or more professional.
- User mentions "messy", "not professional", "mobile and desktop", Rightmove, or Louvre.
- Adding or refactoring pages and you need to match the same design bar.

## Audit checklist (every page/component)

- **Alignment and grid:** Consistent horizontal alignment, column gutters, no floating or misaligned blocks.
- **Spacing:** Use spacing scale 4, 8, 12, 16, 24, 32, 48, 64 (Tailwind). Avoid arbitrary values (e.g. `mb-7`, `gap-11`) unless justified; consistent section rhythm.
- **Typography:** One clear H1 per page; heading levels (H2/H3) don't skip; label and body sizes consistent; avoid one-off `text-[13px]`-style overrides.
- **Touch targets (mobile):** Buttons and key links ≥44px height or padding where possible.
- **Responsive:** No horizontal scroll; breakpoints consistent (sm/md/lg); sticky/fixed elements don't obscure content.
- **Visual noise:** No redundant borders (e.g. double borders); limit background shades; consistent card/panel styles.
- **Consistency:** Same component used the same way; no ad-hoc copies with different spacing or borders.

## Cleanup priority

1. Fix alignment and spacing.
2. Unify typography and remove one-off overrides.
3. Reduce visual noise (borders, backgrounds).
4. Improve touch targets and responsive behaviour.
5. Apply design language (Rightmove + Louvre): colours, type, component style per project design tokens.

## Design direction

- **Rightmove:** Clear filters/sort; card layout (image, title, key stats, CTA); consistent primary actions; scannable lists.
- **Louvre Abu Dhabi:** Calm palette; generous whitespace; restrained typography; minimal decoration; editorial quality.
- Reference the project design system (e.g. `.cursor/rules/project.mdc` or design tokens) for current colours, type scale, and components. When a Rightmove/Louvre-inspired system is defined, use those tokens.

## Output format for audits

Produce a structured list:

```markdown
## [Page or component name]
- **Issue:** [what's wrong]
  **Location:** [file or element]
  **Fix:** [brief suggestion]
```

Audit at desktop (e.g. 1280px) and mobile (375px); note breakpoints where layout or spacing breaks.

## Reference

- Project design system: [.cursor/rules/project.mdc](.cursor/rules/project.mdc) (colours, type, layout rules).
- Design references: Rightmove.co.uk (functionality/layout), louvreabudhabi.ae (aesthetics).
