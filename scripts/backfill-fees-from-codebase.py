#!/usr/bin/env python3
"""
Backfill data/fees.json with fee data from existing codebase TypeScript files
for schools not already present (i.e. not covered by the email import).

Marks these entries as source: "codebase (unverified)".

Usage: python3 scripts/backfill-fees-from-codebase.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


CITY_FILES = {
    "singapore": {
        "path": "src/data/singapore-school-profiles.ts",
        "currency": "SGD",
        "amount_field": "amount",
    },
    "dubai": {
        "path": "src/data/dubai-school-profiles.ts",
        "currency": "AED",
        "amount_field": "amountAed",
    },
    "bangkok": {
        "path": "src/data/bangkok-school-profiles.ts",
        "currency": "THB",
        "amount_field": "amount",
    },
    "hong-kong": {
        "path": "src/data/hong-kong-school-profiles.ts",
        "currency": "HKD",
        "amount_field": "amount",
    },
    "kuala-lumpur": {
        "path": "src/data/kuala-lumpur-school-profiles.ts",
        "currency": "MYR",
        "amount_field": "amount",
    },
}


def extract_schools_from_ts(filepath: Path, amount_field: str) -> dict[str, dict]:
    """Parse a TypeScript fee data file and extract per-school fee data."""
    text = filepath.read_text()
    schools: dict[str, dict] = {}

    # Split into per-school blocks by finding slug keys
    # Pattern: "slug-name": {
    slug_pattern = re.compile(r'"([\w-]+)":\s*\{')
    positions = [(m.start(), m.group(1)) for m in slug_pattern.finditer(text)]

    for i, (pos, slug) in enumerate(positions):
        # Find the end of this school's block (next slug or end of object)
        end_pos = positions[i + 1][0] if i + 1 < len(positions) else len(text)
        block = text[pos:end_pos]

        # Extract feeRows
        fee_rows = []
        for m in re.finditer(
            rf'\{{\s*age:\s*(\d+),\s*grade:\s*"([^"]+)",\s*{amount_field}:\s*(\d+)\s*\}}',
            block,
        ):
            fee_rows.append({
                "age": int(m.group(1)),
                "grade": m.group(2),
                "amount": float(m.group(3)),
            })

        # Extract oneTimeFees
        one_time: dict[str, float] = {}
        otf_m = re.search(r"oneTimeFees:\s*\{([^}]*)\}", block)
        if otf_m:
            otf_block = otf_m.group(1)
            for fm in re.finditer(r'"([^"]+)":\s*(\d+(?:\.\d+)?)', otf_block):
                one_time[fm.group(1)] = float(fm.group(2))

        # Extract website
        website = ""
        web_m = re.search(r'website:\s*"([^"]*)"', block)
        if web_m:
            website = web_m.group(1)

        schools[slug] = {
            "feeRows": fee_rows,
            "oneTimeFees": one_time,
            "source": website,
        }

    return schools


def main():
    project_root = Path(__file__).parent.parent
    fees_path = project_root / "data" / "fees.json"

    with open(fees_path) as f:
        existing = json.load(f)

    print(f"Existing entries in fees.json: {len(existing)}")

    added = 0
    for city, config in CITY_FILES.items():
        filepath = project_root / config["path"]
        if not filepath.exists():
            print(f"  Skipping {city}: file not found")
            continue

        schools = extract_schools_from_ts(filepath, config["amount_field"])
        city_added = 0

        for slug, data in schools.items():
            if slug in existing:
                continue

            existing[slug] = {
                "city": city,
                "currency": config["currency"],
                "source": data["source"] or "codebase (unverified)",
                "sourceDate": "unverified",
                "feesAvailable": len(data["feeRows"]) > 0,
                "feeRows": data["feeRows"],
                "oneTimeFees": data["oneTimeFees"],
            }
            added += 1
            city_added += 1

        print(f"  {city}: {len(schools)} in codebase, {city_added} backfilled")

    existing = dict(sorted(existing.items()))

    with open(fees_path, "w") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"\nTotal backfilled: {added}")
    print(f"Total entries now: {len(existing)}")
    print(f"Written to: {fees_path}")


if __name__ == "__main__":
    main()
