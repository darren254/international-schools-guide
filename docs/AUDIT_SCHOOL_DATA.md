# School data audit

Audit of **school cards** (listings) and **full school profiles**, what was filled from the CSV export, and what is still missing so you can supply it.

---

## Inspection vs accreditation (data quality note)

**Inspection body** should be the body that conducts the review/visit (e.g. **CIS**, **WASC**, **BSO**, **COBIS**, **ISI**, **ACSI**). Do **not** use curriculum or authorisation bodies as the inspection body: **IBO** (IB authorisation), **IGCSEs**, **CAIE** (Cambridge), **Korean Ministry**, etc. are not inspectorates. Many schools’ data mistakenly put IBO or IGCSEs in `inspectionBody`; when cleaning or importing, use the actual accrediting/inspecting body (CIS, WASC, BSO, etc.) or leave blank if only curriculum authorisation is known. Formal BSO/ISI-style inspection reports are not always published on school sites; CIS/WASC accreditation visits are the usual “inspection” for international schools in Jakarta.

---

## 1. School cards (listings)

Cards are rendered from `JAKARTA_SCHOOLS` in `src/data/jakarta-schools.ts`. They appear on the Explore (browse) page, shortlist, and compare.

### Fields used by the card

| Field | Source | Status |
|-------|--------|--------|
| name | Listing | ✅ All 66 |
| slug | Listing | ✅ All 66 |
| citySlug | Page | ✅ |
| verified | Listing | ✅ All 66 |
| curricula | Listing | ✅ All 66 |
| area | Listing | ✅ All 66 |
| ageRange | Listing | ✅ All 66 |
| studentCount | Listing | ✅ All 66 |
| feeRange | Listing | ✅ All 66 |
| examResults | Listing | ✅ 10 schools have IB/IGCSE results (was 6; added pass rate for BSJ, Beacon, Sekolah Ciputra, Binus Simprug) |
| editorialSummary | Listing | ✅ All 66 |
| phone, email, website | Listing | ✅ All 66 (filled from CSV earlier) |
| imageUrl | Not passed | ⚠️ **Missing** – card always shows “Photo” placeholder. CSV has `heroImageUrl` for schools; we could add it to the listing type and pass it to the card. |
| hasProfile | From profile slug set | ✅ |

### Filled from CSV in this audit

- **IB pass rate** added to listing for: British School Jakarta (98%), Beacon Academy (91%), Sekolah Ciputra (95%), Binus School Simprug (95%).

### Still missing for cards (not in CSV or not wired)

- **imageUrl** – CSV has `heroImageUrl` per school but the card component does not receive it (listing type has no `imageUrl`). To complete: add `imageUrl?: string` to `JakartaSchoolListing`, populate from CSV/export, and pass it into `SchoolCard` on the Explore page.

---

## 2. Full school profiles (17 schools)

Full profiles live in `src/data/schools.ts`. Each has: head, academics, studentBody (optional inspection), schoolLife (facilities, activitiesCount, paragraphs), contact, campuses, sidebar (quickFacts, otherSchools, relatedInsights), fees, intelligence, jsonLd.

### Per-field status (across the 17 full profiles)

| Field / section | JIS | BSJ | ACG | ISJ | Mentari | AIS | SPH | SPH Kemang | Global Jaya | Binus | Sinarmas | Tunas Muda | BTB | Nord Anglia | NZSJ | Jakarta Nanyang |
|-----------------|-----|-----|-----|-----|---------|-----|-----|------------|--------------|-------|----------|------------|-----|-------------|------|-----------------|
| **head** (name, since, bio) | ✅ Named | ✅ Interim | Generic | ✅ Named | Generic | Generic | Generic | Generic | Generic | Generic | Generic | Generic | Generic | Generic | ✅ Named | Generic |
| **academics.results** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Empty | ✅ | ✅ | ✅ | Empty | Empty | N/A (primary) | Empty | Empty |
| **studentBody.inspection** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **campuses[].address** | ✅ Full | ✅ Full | ✅ | ✅ | Short | Short | Short | Short | Short | Short | Short | Short | Short | Short | Short | Short |
| **schoolLife.facilities** | ✅ Long | ✅ Long | ✅ | ✅ | Short | Short | Short | Short | Short | Short | Short | Short | Short | Short | Short | Short |
| **sidebar quickFacts (Founded)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **contact** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

“Generic” head = “School Leadership Team” or “Interim Principal” with generic bio. “Short” address = area only (e.g. “South Jakarta”) or one line. “Short” facilities = 2–4 items.

### Filled from CSV in this audit

- **Minimal profiles (49 schools):** Minimal profile builder now reads from `jakarta_csv_export.json` (copied to `src/data/jakarta_csv_export.json`) for:
  - **Address** – `addressFull` → `campuses[0].address`
  - **Facilities** – `facilities` (split by `|`) → `schoolLife.facilities` and a short paragraph
  - **Nationalities** – `nationalitiesCount` → sidebar quick fact “Nationalities”
  - **Founded** – `foundedYear` → sidebar “Founded” and `jsonLd.foundingDate`
- **Listings:** IB pass rate added for BSJ, Beacon, Sekolah Ciputra, Binus Simprug (see above).

No change to the 17 full profiles from CSV in this pass (BSJ already had inspection; CSV has no full inspection text for the others; head names in CSV only for 4 schools, already used where applicable).

---

## 3. What is still missing (to get from you or another source)

These are gaps that the CSV does not fix. Supplying them will allow all data fields to be complete.

### For school cards

1. **Hero/card image (imageUrl)**  
   - CSV has `heroImageUrl` for some schools. To show real photos on cards we need to: add `imageUrl` to the listing type, populate it (e.g. from CSV or a single source of truth), and pass it into `SchoolCard`. If your canonical URLs are in the CSV, we can wire that; otherwise we need a list of slug → image URL.

### For full profiles (17 schools)

2. **Head of school (name, since, bio)**  
   - Still generic for: ACG, Mentari, AIS, SPH, Global Jaya, Binus, Sinarmas, Tunas Muda, BTB, SPH Kemang, Nord Anglia, Jakarta Nanyang.  
   - Need: current head name, year in post, and 1–2 sentence bio per school.

3. **Inspection (date, body, rating, findings)**  
   - Only JIS and BSJ have a full inspection block.  
   - Need for the other 15: last inspection date, body (e.g. CIS, BSO, WASC), rating, and 1–2 sentence findings (or “Contact school for report” if you only have rating).

4. **Academics.results**  
   - Empty for: Tunas Muda, BTB, SPH Kemang, NZSJ, Jakarta Nanyang (Nord Anglia is primary-only, so N/A).  
   - Need: latest IB/IGCSE/A-Level (or equivalent) averages and pass rates where applicable, so we can add `results` and a short paragraph.

5. **Campuses – full address**  
   - Many full profiles use a short address (e.g. “South Jakarta” or one line).  
   - Need: full street address (and optional lat/lng) per campus so we can show “Getting there” and maps.

6. **School life – facilities list**  
   - Several full profiles have only 2–4 facilities.  
   - Need: a fuller list (e.g. pool, labs, theatre, sports, libraries) so we can match the level of detail of JIS/BSJ.

7. **Fees – detailed rows**  
   - Full profiles have a fee structure (rows + one-time). Some may be placeholders or outdated.  
   - Need: current year group tuition, capital/enrolment fees, and one-time fees (application, etc.) per school so we can keep the fees section accurate.

### For minimal profiles (49 schools)

8. **Head, inspection, academics**  
   - Minimal profiles use generic “School leadership” and “Contact the school for details” and do not have inspection or real academic results.  
   - To “complete” these like full profiles you’d need the same as (2), (3), (4) for each; otherwise they remain intentionally light (contact + address/facilities/founded from CSV as now).

---

## 4. Summary

- **Done:** Listings have contact and exam results (including IB pass rate for 4 more). Minimal profiles now get address, facilities, nationalities, and founded from the CSV where present.
- **Still missing:**  
  - Cards: wire and populate **imageUrl** (CSV has `heroImageUrl`; we can use that once the listing and Explore page pass it through).  
  - Full profiles: **head** (12 schools), **inspection** (15 schools), **academics.results** (5 schools), **full address** and **facilities** where still short, and **fees** where placeholder or outdated.  
  - Optional: same head/inspection/academics for minimal-profile schools if you want them to match full-profile completeness.

If you provide the missing head, inspection, academic results, addresses, and facilities (and confirm fee source), we can plug them in so every field is complete.
