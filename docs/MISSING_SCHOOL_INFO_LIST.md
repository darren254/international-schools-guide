# Missing school info — list by school

**Current status (February 2026, post–Gemini fill)** — see summary at bottom.

---

## Current status summary

| Area | Status |
|------|--------|
| **Full profiles (16 schools)** | **Head**: all 16 have a **named** head (no placeholders). **Inspection**: all 16 have an inspection/accreditation block (CIS, WASC, BSO, COBIS, etc.). **Academic results**: all 16 have content — either exam stats (IB/IGCSE/NZ/etc.) or, for primary-only Nord Anglia, curriculum paragraphs. |
| **Minimal profiles (50 schools)** | By design: generic head (“School leadership”), no inspection section, academic results only from listing. Address, facilities, nationalities, founded year come from CSV when present; contact (phone, email, website) from listing. |
| **School cards (66)** | **Card image**: not wired. `SchoolCard` accepts `imageUrl` but the Explore page does not pass it; listing type has no `imageUrl`. CSV/export has `heroImageUrl` for many schools (some empty). |

### Full profiles — no longer missing

- **Head** — All 16 full-profile schools have a named head (e.g. Phil Edwards, Shawn Hutchinson, Clarissa Subagyo, Dean Cummins, Helen Schleper, Howard Menand, etc.).
- **Inspection** — All 16 have an inspection/accreditation block (e.g. CIS, WASC, BSO, COBIS, ISI, ACSI).
- **Academic results** — All 16 have either exam results (IB average, pass rate, IGCSE, NZ standards, etc.) or, for Nord Anglia (primary-only), curriculum description only.

### Remaining gaps (optional improvements)

1. **Card image (all 66)**  
   No school shows a photo on the browse card. CSV/export has `heroImageUrl` for many schools. To fix: add `imageUrl?: string` to `JakartaSchoolListing`, populate from CSV/export (by slug), and pass it into `SchoolCard` on the Explore page.

2. **Minimal profiles (50)**  
   For each of the 50 “Profile coming soon” schools, the following are intentionally generic/empty unless you add full profiles later:  
   - **Head** — “School leadership” / “Contact the school for details.”  
   - **Inspection** — no section  
   - **Academic results** — only what’s on the listing (e.g. IB average if present)

3. **Full profiles — minor**  
   - **Nord Anglia School Jakarta**, **New Zealand School Jakarta**: campus `address` is only the area (“South Jakarta”), not a street address. Rest of profile is complete.

---

## Summary counts (current)

| Item | Count |
|------|--------|
| Full profiles with **head** missing or incomplete | **0** |
| Full profiles with **inspection** missing | **0** |
| Full profiles with **academic results** missing | **0** (Nord Anglia is primary-only; has curriculum text) |
| Full profiles with short **campus address** (area only) | 2 (Nord Anglia, NZSJ) |
| Minimal profiles (generic head / no inspection) | 50 (by design) |
| **Card image** not shown for any school | 66 (imageUrl not wired) |

---

## Historical reference (pre–Gemini)

Below is the previous “missing” list, kept for reference. These items have been filled.

### Full profiles — head (previously missing, now filled)

| School name | Previous status |
|-------------|-----------------|
| British School Jakarta | Had "Interim Principal" → now Phil Edwards |
| Mentari, AIS, SPH, Global Jaya, Binus, Sinarmas, Tunas Muda, BTB, SPH Kemang, Nord Anglia, Jakarta Nanyang | Had no named head → now have named heads |

### Full profiles — inspection (previously missing, now filled)

All of ACG, ISJ, Mentari, AIS, SPH, Global Jaya, Binus, Sinarmas, Tunas Muda, BTB, SPH Kemang, Nord Anglia, NZSJ, Jakarta Nanyang now have inspection/accreditation text.

### Full profiles — academic results (previously missing, now filled)

Tunas Muda, BTB, SPH Kemang, NZSJ, Jakarta Nanyang now have academic results text/stats from Gemini.
