#!/usr/bin/env python3
"""
Import fee data from fact-check .eml files into data/fees.json.

Usage: python3 scripts/import-fees-from-emails.py [--email-dir PATH]

Default email dir: ~/Desktop/FEES fact check emails/
"""

from __future__ import annotations

import argparse
import email
import json
import os
import re
import sys
from pathlib import Path


CITY_CURRENCY = {
    "singapore": "SGD",
    "dubai": "AED",
    "bangkok": "THB",
    "hong-kong": "HKD",
    "hong kong": "HKD",
    "kuala lumpur": "MYR",
    "kuala-lumpur": "MYR",
    "jakarta": "IDR",
}

CITY_SLUG_MAP = {
    "hong kong": "hong-kong",
    "kuala lumpur": "kuala-lumpur",
}

# Manual name-to-slug overrides for schools the fuzzy matcher can't resolve
MANUAL_SLUG_OVERRIDES: dict[str, str] = {
    "anglo-chinese school (international) singapore": "anglo-chinese-school",
    "la petite ecole singapore": "le-petite-ecole",
    "bangkok international preparatory & secondary school (bangkok prep)": "bangkok-international-preparatory-secondary-school",
    "learn satit pattana school (lsp) - secondary division": "satit-pattana-secondary-school",
    "ris swiss section / swiss school bangkok": "ris-swiss-section-deutschsprachige-schule",
    "jumeirah english speaking school (jess dubai - arabian ranches & jumeirah)": "jess-arabian-ranches",
    "lycée français bilingue international ice (bilingual french international school)": "lycee-francais-bilingue-international",
    "lycée français international (lfi) de l'aflec dubai": "lycee-francais-international",
    "lycée libanais francophone privé meydan (llfpm)": "lycee-libanais-francophone-prive-meydan",
    "dubai english speaking school (dess) academic city": "dubai-english-speaking-school-academic-city",
    "dubai english speaking school (dess) oud metha": "dubai-english-speaking-school-oud-metha",
    "hong kong international learning academy (hkila)": "hkila",
    "international college hong kong (ichk) kindergarten and primary": "ichk-kindergarten-and-primary",
    "international college hong kong (secondary)": "ichk-secondary",
    "al-azhar syifa budi jakarta": "al-azhar-syifa-budi-jakarta",
    "bina tunas bangsa (btb) school jakarta": "bina-tunas-bangsa",
    "gandhi memorial intercontinental school (gmis) jakarta": "gandhi-memorial-international-school",
    "the king's school canterbury": "king-s-college-international-school",
    "tenby schools setia eco park": "tenby-school-setia-eco-park",
}


def load_slug_name_map(project_root: Path) -> dict[str, tuple[str, str]]:
    """Load slug -> (name, city) from listing files."""
    cities = {
        "singapore": "src/data/singapore-schools.ts",
        "dubai": "src/data/dubai-schools.ts",
        "bangkok": "src/data/bangkok-schools.ts",
        "hong-kong": "src/data/hong-kong-schools.ts",
        "kuala-lumpur": "src/data/kuala-lumpur-schools.ts",
        "jakarta": "src/data/jakarta-schools.ts",
    }

    pairs: dict[str, tuple[str, str]] = {}
    for city, rel_path in cities.items():
        fpath = project_root / rel_path
        if not fpath.exists():
            continue
        lines = fpath.read_text().splitlines()
        current_slug = None
        for line in lines:
            slug_m = re.search(r'slug:\s*"([\w-]+)"', line)
            name_m = re.search(r'name:\s*"([^"]+)"', line)
            if slug_m:
                current_slug = slug_m.group(1)
            if name_m and current_slug:
                pairs[current_slug] = (name_m.group(1), city)
                current_slug = None
    return pairs


def build_name_to_slug(slug_map: dict[str, tuple[str, str]]) -> dict[str, str]:
    """Build name -> slug lookup (lowercased, stripped of city suffix)."""
    lookup: dict[str, str] = {}
    for slug, (name, city) in slug_map.items():
        lookup[name.lower()] = slug
        # Also index without city suffix
        for suffix in [" singapore", " dubai", " bangkok", " hong kong", " kuala lumpur", " jakarta",
                       " dubai-sharjah-ajman"]:
            if name.lower().endswith(suffix):
                stripped = name[: -len(suffix)].strip().lower()
                if stripped not in lookup:
                    lookup[stripped] = slug
    return lookup


def extract_text_from_eml(eml_path: str) -> str:
    """Extract plain text body from .eml file."""
    with open(eml_path, "rb") as f:
        msg = email.message_from_binary_file(f)

    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            payload = part.get_payload(decode=True)
            if payload:
                return payload.decode("utf-8", errors="replace")
    return ""


def split_into_school_sections(text: str) -> list[str]:
    """Split email text into per-school sections."""
    sections = re.split(r"(?=^SCHOOL:\s)", text, flags=re.MULTILINE)
    return [s.strip() for s in sections if s.strip().startswith("SCHOOL:")]


def parse_currency_amount(text: str) -> float | None:
    """Parse a currency amount like 'S$31,610' or 'AED 54,800' or 'THB 80,250' into a number."""
    cleaned = re.sub(r"[A-Z$£€¥₹₫₩]+\s*", "", text.strip())
    cleaned = cleaned.replace(",", "").replace(" ", "")
    try:
        return float(cleaned)
    except ValueError:
        return None


def extract_annual_fees(section: str) -> list[dict]:
    """Extract per-grade annual fee rows from a school section.
    
    Returns list of {age, grade, amount} dicts.
    Prefers annual amounts when both per-term and annual are given.
    """
    rows: list[dict] = []

    annual_block = ""
    in_annual = False
    for line in section.splitlines():
        lower = line.lower().strip()
        if any(kw in lower for kw in ["annual / ongoing fees", "annual/ongoing fees", "annual fees"]):
            in_annual = True
            annual_block = ""
            continue
        if in_annual:
            if lower.startswith("currency:") or lower.startswith("notes:") or lower.startswith("one-time"):
                break
            annual_block += line + "\n"

    if not annual_block.strip():
        return rows

    # Only flag as per-term if the header/intro describes tuition as per-term/semester
    # (not just a mention of "per term" in a sub-fee like facility fee)
    first_5_lines = "\n".join(annual_block.splitlines()[:5])
    is_per_term = bool(re.search(r"(?:tuition|fees?)\s+.*per\s+(?:semester|term)|per\s+(?:semester|term).*(?:tuition|fees?)|^\s*(?:Fees?\s+(?:are|is)\s+)?(?:charged|payable|billed)\s+per\s+(?:semester|term)", first_5_lines, re.IGNORECASE))

    GRADE_KW = (
        r"(?:Pre-?)?(?:KG|Kindg?\.?|Kindergarten|Grade|Year|Nursery|Reception|"
        r"Foundation|FS|Pre-?Nursery|Pre-?K|Prep|Primary|Secondary|Senior|Junior|"
        r"Preparatory|Early\s*(?:Years?|Childhood)|Infant|Toddler|Sixth\s*Form|"
        r"IB\s*\d|IBDP|IGCSE|A-?Level|GCE|FIB|Pre-?IB|Elementary|Preschool|"
        r"Middle\s*School|High\s*School|Lower|Upper|Key\s*Stage|KS)"
    )
    CURR = r"[A-Z$S\u20b9\u20ab\u20a9\u00a3\u20ac]+"

    for line in annual_block.splitlines():
        stripped = line.strip()
        if not stripped:
            continue

        grade_m = re.match(rf"-?\s*({GRADE_KW}[^:\n]*?):\s*(.*)", stripped, re.IGNORECASE)
        if not grade_m:
            continue

        grade_label = grade_m.group(1).strip()
        rest = grade_m.group(2).strip()

        amounts: list[float] = []
        for am in re.finditer(rf"(?:{CURR}\s*)?([0-9][0-9,. ]+)", rest):
            val = parse_currency_amount(am.group(1))
            if val is not None and val >= 100:
                amounts.append(val)

        if not amounts:
            continue

        if is_per_term and len(amounts) >= 2:
            annual_amount = max(amounts)
        elif is_per_term and len(amounts) == 1:
            multiplier = 3 if "3 terms" in annual_block.lower() or "per term" in annual_block.lower() else 2
            annual_amount = amounts[0] * multiplier
        else:
            annual_amount = amounts[0]

        rows.append({"grade": grade_label, "amount": annual_amount})

    if not rows:
        # Fallback: semicolon-separated inline format like "FS 1: AED 11,596; FS 2: AED 11,596"
        for line in annual_block.splitlines():
            for m in re.finditer(
                rf"({GRADE_KW}[^:;]*?):\s*(?:{CURR}\s*)?([0-9][0-9,. ]+)",
                line,
                re.IGNORECASE,
            ):
                grade_label = m.group(1).strip()
                amount = parse_currency_amount(m.group(2))
                if amount is not None and amount >= 100:
                    rows.append({"grade": grade_label, "amount": amount})

    seen: set[str] = set()
    deduped = []
    for r in rows:
        key = r["grade"].lower()
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    return deduped


def extract_one_time_fees(section: str) -> dict[str, float]:
    """Extract one-time/upfront fees from a school section."""
    fees: dict[str, float] = {}

    in_onetime = False
    block = ""
    for line in section.splitlines():
        lower = line.lower().strip()
        if "one-time" in lower or "upfront" in lower:
            in_onetime = True
            block = ""
            continue
        if in_onetime:
            if lower.startswith("annual") or lower.startswith("currency:") or lower.startswith("notes:"):
                break
            block += line + "\n"

    if not block.strip():
        return fees

    if "not publicly" in block.lower() or "none found" in block.lower() or "not available" in block.lower():
        return fees

    CURR_OT = r"[A-Z$S\u20b9\u20ab\u20a9\u00a3\u20ac]+"
    for m in re.finditer(
        rf"-\s*([^:\n]+?):\s*(?:{CURR_OT}\s*)?([0-9][0-9,. ]+)",
        block,
    ):
        name = m.group(1).strip()
        amount = parse_currency_amount(m.group(2))
        if amount is not None and amount > 0:
            # Skip very long names (likely notes, not fee names)
            if len(name) < 80:
                fees[name] = amount

    return fees


def extract_source_info(section: str) -> tuple[str, str]:
    """Extract source website and date from NOTES/WEBSITE fields."""
    website = ""
    source_date = ""

    for line in section.splitlines():
        if line.strip().startswith("WEBSITE:"):
            website = line.split("WEBSITE:", 1)[1].strip()
        if line.strip().startswith("NOTES:"):
            notes = line.split("NOTES:", 1)[1].strip()
            # Look for year patterns like "2025/2026" or "2025-2026" or "2025–2026"
            year_m = re.search(r"(20\d{2})[/–-](20\d{2})", notes)
            if year_m:
                source_date = f"{year_m.group(1)}-{year_m.group(2)}"
            elif re.search(r"20\d{2}", notes):
                source_date = re.search(r"(20\d{2})", notes).group(1)

    return website, source_date


def is_fees_available(section: str) -> bool:
    """Check if fees are publicly available for this school."""
    for line in section.splitlines():
        if "FEES PUBLICLY AVAILABLE:" in line:
            return "yes" in line.lower()
    return True  # Default to yes if not specified


def guess_age_for_grade(grade: str, city: str) -> int:
    """Guess age for a grade label. Returns 0 if unknown."""
    g = grade.lower().strip()

    # Common patterns
    age_map = {
        "infant care": 1, "toddler": 2,
        "pre-nursery": 2, "pre nursery": 2, "prenursery": 2,
        "nursery": 3, "nurs.": 3, "nurs": 3,
        "pre-kg": 3, "pre kg": 3, "prekg": 3, "pre-k": 3, "pre-k1": 3, "pre-k2": 4,
        "kg 1": 3, "kg1": 3, "kindg. 1": 3, "kindergarten 1": 3, "kinder 1": 3,
        "kg 2": 4, "kg2": 4, "kindg. 2": 4, "kindergarten 2": 4, "kinder 2": 4,
        "kg 3": 5, "kg3": 5, "kindg. 3": 5, "kindergarten 3": 5,
        "reception": 5, "prep": 5, "preparatory": 5,
        "fs 1": 3, "fs1": 3, "foundation stage 1": 3, "foundation 1": 3,
        "fs 2": 4, "fs2": 4, "foundation stage 2": 4, "foundation 2": 4,
    }

    for pattern, age in age_map.items():
        if g == pattern or g.startswith(pattern + " ") or g.startswith(pattern + "/"):
            return age

    # Grade N or Year N
    m = re.search(r"(?:grade|year)\s*(\d+)", g)
    if m:
        n = int(m.group(1))
        if "year" in g:
            return n + 4  # Year 1 = age 5
        else:
            return n + 5  # Grade 1 = age 6

    if "elementary" in g:
        return 6
    if "primary" in g:
        return 6
    if "middle" in g:
        return 11
    if "secondary" in g or "senior" in g or "high school" in g:
        return 12
    if "pre-ib" in g or "fib" in g:
        return 15
    if "preschool" in g:
        return 4
    if "infant" in g:
        return 1
    if "toddler" in g:
        return 2
    if "lower" in g:
        return 6
    if "upper" in g:
        return 14

    return 0


def parse_school_section(section: str, city: str, name_to_slug: dict[str, str]) -> tuple[str | None, dict | None]:
    """Parse a single school section into a fees.json entry.
    
    Returns (slug, entry) or (None, None) if can't match.
    """
    # Extract school name
    name_m = re.match(r"SCHOOL:\s*(.+)", section)
    if not name_m:
        return None, None
    school_name = name_m.group(1).strip()

    # Find slug
    slug = find_slug(school_name, city, name_to_slug)
    if not slug:
        return school_name, None

    currency = CITY_CURRENCY.get(city, "USD")

    if not is_fees_available(section):
        return slug, {
            "city": CITY_SLUG_MAP.get(city, city),
            "currency": currency,
            "source": "",
            "sourceDate": "",
            "feesAvailable": False,
            "feeRows": [],
            "oneTimeFees": {},
        }

    annual_rows = extract_annual_fees(section)
    one_time = extract_one_time_fees(section)
    website, source_date = extract_source_info(section)

    # Add ages to rows
    city_slug = CITY_SLUG_MAP.get(city, city)
    for row in annual_rows:
        if "age" not in row:
            row["age"] = guess_age_for_grade(row["grade"], city_slug)

    return slug, {
        "city": city_slug,
        "currency": currency,
        "source": website,
        "sourceDate": source_date or "2025-2026",
        "feesAvailable": True,
        "feeRows": annual_rows,
        "oneTimeFees": one_time,
    }


def find_slug(school_name: str, city: str, name_to_slug: dict[str, str]) -> str | None:
    """Find the slug for a school name. Tries various normalizations."""
    name_lower = school_name.lower().strip()

    # Manual overrides first
    if name_lower in MANUAL_SLUG_OVERRIDES:
        return MANUAL_SLUG_OVERRIDES[name_lower]

    # Direct match
    if name_lower in name_to_slug:
        return name_to_slug[name_lower]

    # Strip city suffix
    city_suffixes = [
        " singapore", " dubai", " bangkok", " hong kong", " kuala lumpur",
        " jakarta", " dubai-sharjah-ajman", " (singapore)", " (dubai)",
        " (bangkok)", " (hong kong)", " (kuala lumpur)", " (jakarta)",
    ]
    stripped = name_lower
    for suffix in city_suffixes:
        if stripped.endswith(suffix):
            stripped = stripped[: -len(suffix)].strip()
            break

    if stripped in name_to_slug:
        return name_to_slug[stripped]

    # Try slugifying the name directly
    slugified = re.sub(r"[^a-z0-9]+", "-", stripped).strip("-")
    # Check if this slug exists in the slug map
    for slug in name_to_slug.values():
        if slug == slugified:
            return slug

    # Try partial matching — find best match
    best_slug = None
    best_score = 0
    for lookup_name, slug in name_to_slug.items():
        # Check if one contains the other
        if stripped in lookup_name or lookup_name in stripped:
            score = len(set(stripped.split()) & set(lookup_name.split()))
            if score > best_score:
                best_score = score
                best_slug = slug

    if best_score >= 2:
        return best_slug

    return None


def main():
    parser = argparse.ArgumentParser(description="Import fees from fact-check emails")
    parser.add_argument(
        "--email-dir",
        default=os.path.expanduser("~/Desktop/FEES fact check emails"),
        help="Directory containing .eml files",
    )
    parser.add_argument(
        "--project-root",
        default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        help="Project root directory",
    )
    args = parser.parse_args()

    project_root = Path(args.project_root)
    email_dir = Path(args.email_dir)

    if not email_dir.exists():
        print(f"Error: email directory not found: {email_dir}", file=sys.stderr)
        sys.exit(1)

    # Load slug mappings
    slug_map = load_slug_name_map(project_root)
    name_to_slug = build_name_to_slug(slug_map)
    print(f"Loaded {len(slug_map)} school slugs from codebase")

    # Process all .eml files
    fees_data: dict[str, dict] = {}
    unmatched: list[tuple[str, str]] = []
    total_schools = 0

    eml_files = sorted(f for f in os.listdir(email_dir) if f.endswith(".eml"))
    print(f"Found {len(eml_files)} .eml files")

    for eml_file in eml_files:
        text = extract_text_from_eml(str(email_dir / eml_file))
        if not text:
            print(f"  Warning: no text in {eml_file}")
            continue

        # Detect city from header (first line matching "City: ...")
        city_m = re.search(r"^City:\s*(.+)$", text, re.MULTILINE)
        city = city_m.group(1).strip().lower() if city_m else "unknown"

        sections = split_into_school_sections(text)

        for section in sections:
            total_schools += 1
            result = parse_school_section(section, city, name_to_slug)
            slug_or_name, entry = result

            if entry is None:
                unmatched.append((slug_or_name or "unknown", city))
                continue

            if slug_or_name and entry:
                fees_data[slug_or_name] = entry

    # Sort by slug
    fees_data = dict(sorted(fees_data.items()))

    # Write output
    output_path = project_root / "data" / "fees.json"
    with open(output_path, "w") as f:
        json.dump(fees_data, f, indent=2, ensure_ascii=False)

    # Stats
    with_rows = sum(1 for v in fees_data.values() if v["feeRows"])
    without_rows = sum(1 for v in fees_data.values() if not v["feeRows"])

    print(f"\nResults:")
    print(f"  Total school sections parsed: {total_schools}")
    print(f"  Matched to slugs: {len(fees_data)}")
    print(f"  With fee rows: {with_rows}")
    print(f"  Without fee rows (fees unavailable/unparsed): {without_rows}")
    print(f"  Unmatched: {len(unmatched)}")

    if unmatched:
        print(f"\nUnmatched schools:")
        for name, city in unmatched:
            print(f"  [{city}] {name}")

    print(f"\nWritten to: {output_path}")


if __name__ == "__main__":
    main()
