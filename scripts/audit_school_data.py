#!/usr/bin/env python3
"""
Audit school cards (listings) and full profiles against CSV export.
Outputs: what's missing in code, what CSV has, and after fill what's still missing.
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CSV_PATH = REPO / "scripts" / "jakarta_csv_export.json"

# Full profile slugs (have full profile in schools.ts)
FULL_PROFILE_SLUGS = {
    "jakarta-intercultural-school", "british-school-jakarta", "acg-school-jakarta",
    "independent-school-of-jakarta", "mentari-intercultural-school-jakarta",
    "australian-independent-school-jakarta", "sekolah-pelita-harapan",
    "global-jaya-school", "binus-school-serpong", "sinarmas-world-academy",
    "tunas-muda-school", "btb-school", "sekolah-pelita-harapan-kemang-village",
    "nord-anglia-school-jakarta", "new-zealand-school-jakarta", "jakarta-nanyang-school",
}


def load_csv():
    with open(CSV_PATH, encoding="utf-8") as f:
        return json.load(f)


def audit_listings_from_ts():
    """Parse jakarta-schools.ts and report listing field coverage (by slug)."""
    path = REPO / "src" / "data" / "jakarta-schools.ts"
    text = path.read_text(encoding="utf-8")
    # Find each listing block: slug, then fields. We look for slug: "xxx" and then phone/email/website, examResults
    slugs_with_contact = set(re.findall(r'slug: "([^"]+)"[^}]*phone:', text))
    slugs_with_exam = set(re.findall(r'slug: "([^"]+)"[^}]*examResults: \[\s*\{', text))
    all_slugs = set(re.findall(r'slug: "([^"]+)"', text))
    all_slugs = {s for s in all_slugs if not s.startswith("city")}  # filter noise
    return {
        "all_slugs": sorted(all_slugs),
        "with_contact": slugs_with_contact,
        "with_exam_results": slugs_with_exam,
    }


def audit_full_profiles_from_ts():
    """Grep schools.ts for generic/empty patterns in full profiles."""
    path = REPO / "src" / "data" / "schools.ts"
    text = path.read_text(encoding="utf-8")
    # Find head: { name: "School Leadership Team" or "Interim"
    generic_head = set(re.findall(r'slug: "([^"]+)"[\s\S]*?head: \{\s*name: "(?:School Leadership Team|Interim Principal)"', text))
    # Slugs that have inspection: (in studentBody then inspection:)
    has_inspection = "inspection: {" in text and "date:" in text
    # Count facilities length per profile - hard to do by regex. Instead report by known slugs.
    return {"generic_head_slugs": generic_head}


def run_audit():
    csv = load_csv()
    listing_audit = audit_listings_from_ts()
    profile_audit = audit_full_profiles_from_ts()

    # CSV coverage
    csv_slugs = set(csv.keys())
    csv_has_address = {s for s in csv_slugs if (csv[s].get("addressFull") or "").strip()}
    csv_has_head = {s for s in csv_slugs if (csv[s].get("headName") or "").strip()}
    csv_has_inspection = {s for s in csv_slugs if (csv[s].get("lastInspected") or csv[s].get("inspectionRating") or "").strip()}
    csv_has_facilities = {s for s in csv_slugs if (csv[s].get("facilities") or "").strip()}
    csv_has_ib = {s for s in csv_slugs if (csv[s].get("ibAverage") or csv[s].get("ibPassRate") or "").strip()}
    csv_has_founded = {s for s in csv_slugs if (csv[s].get("foundedYear") or "").strip()}

    lines = []
    lines.append("# School data audit")
    lines.append("")
    lines.append("## 1. School cards (listings – jakarta-schools.ts)")
    lines.append("")
    lines.append(f"- Total listings: {len(listing_audit['all_slugs'])}")
    lines.append(f"- With contact (phone/email/website): {len(listing_audit['with_contact'])}")
    lines.append(f"- With exam results (IB/IGCSE etc.): {len(listing_audit['with_exam_results'])}")
    missing_contact = set(listing_audit["all_slugs"]) - listing_audit["with_contact"]
    if missing_contact:
        lines.append(f"- **Missing contact:** {len(missing_contact)} schools")
    lines.append("")
    lines.append("## 2. Full profiles (17 schools in schools.ts)")
    lines.append("")
    lines.append(f"- With generic head ('School Leadership Team' / 'Interim'): {len(profile_audit['generic_head_slugs'])}")
    for s in sorted(profile_audit["generic_head_slugs"]):
        lines.append(f"  - {s}")
    lines.append("")
    lines.append("## 3. CSV export coverage (what CSV has)")
    lines.append("")
    lines.append(f"- Address (addressFull): {len(csv_has_address)}/66")
    lines.append(f"- Head (headName): {len(csv_has_head)}/66 → {sorted(csv_has_head)}")
    lines.append(f"- Inspection (lastInspected or inspectionRating): {len(csv_has_inspection)}/66")
    lines.append(f"- Facilities: {len(csv_has_facilities)}/66")
    lines.append(f"- IB (ibAverage/ibPassRate): {len(csv_has_ib)}/66 → {sorted(csv_has_ib)}")
    lines.append(f"- Founded year: {len(csv_has_founded)}/66")
    lines.append("")
    lines.append("## 4. Listing fields that could be filled from CSV")
    lines.append("")
    for slug in listing_audit["all_slugs"]:
        r = csv.get(slug, {})
        gaps = []
        if slug not in listing_audit["with_contact"] and (r.get("phone") or r.get("email") or r.get("website")):
            gaps.append("contact")
        if slug not in listing_audit["with_exam_results"] and (r.get("ibAverage") or r.get("ibPassRate")):
            gaps.append("exam_results")
        if gaps:
            lines.append(f"- **{slug}**: {', '.join(gaps)}")
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    print(run_audit())
