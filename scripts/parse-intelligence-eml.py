#!/usr/bin/env python3
"""
Parse .eml school briefing emails from INTELLIGENCE EDITORIAL folder.
Extracts THE VIBE, THE TRADE-OFFS, PROS, CONS per school and outputs JSON per city.
Usage: python scripts/parse-intelligence-eml.py [path-to-eml-folder]
Default path: ~/Desktop/INTELLIGENCE EDITORIAL
"""

import email
import json
import os
import re
import sys
from pathlib import Path


def decode_quoted_printable(body: bytes) -> str:
    try:
        return email.contentmanager.get_content_manager().get_payload(body)
    except Exception:
        pass
    import quopri
    return quopri.decodestring(body).decode("utf-8", errors="replace")


def get_plain_body(eml_path: Path) -> str:
    with open(eml_path, "rb") as f:
        msg = email.message_from_binary_file(f)
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                payload = part.get_payload(decode=True)
                if payload:
                    charset = part.get_content_charset() or "utf-8"
                    return payload.decode(charset, errors="replace")
                return part.get_payload()
    payload = msg.get_payload(decode=True)
    return (payload or b"").decode("utf-8", errors="replace")


def extract_section(text: str, start_marker: str, end_markers: list) -> str:
    """Get content between start_marker and the first of end_markers."""
    idx = text.find(start_marker)
    if idx < 0:
        return ""
    start = idx + len(start_marker)
    end = len(text)
    for em in end_markers:
        pos = text.find(em, start)
        if pos >= 0:
            end = min(end, pos)
    return text[start:end].strip()


def split_school_blocks(text: str) -> list:
    """Return list of (school_heading_line, block_content). Handles 'N. SCHOOL NAME', 'SCHOOL N OF M', and 'SCHOOL N - NAME' formats."""
    blocks = []
    # Dubai-style: "SCHOOL 1 - BRIGHTON COLLEGE DUBAI" ... "---" ... "SCHOOL 2 - ..."
    dubai_pattern = re.compile(r"SCHOOL\s+(\d+)\s*[-–]\s*([^\n]+)")
    dubai_matches = list(dubai_pattern.finditer(text))
    if dubai_matches:
        for i, m in enumerate(dubai_matches):
            num, name = m.group(1), m.group(2).strip()
            start = m.start()
            end = dubai_matches[i + 1].start() if i + 1 < len(dubai_matches) else len(text)
            block = text[start:end].strip()
            heading = f"{num}. {name}"
            blocks.append((heading, block))
        return blocks

    # KL/Singapore/Bangkok: split by "---" then accept "N. SCHOOL NAME" or "SCHOOL N OF M"
    parts = re.split(r"\n---\s*\n", text)
    for part in parts:
        part = part.strip()
        if not part:
            continue
        # Format 1: "1. INTERNATIONAL SCHOOL OF KUALA LUMPUR (ISKL)"
        match = re.match(r"^(\d+)\.\s+(.+?)(?:\n|$)", part, re.DOTALL)
        if match:
            heading_first = (match.group(2) or "").split("\n")[0].strip()
            heading = f"{match.group(1)}. {heading_first}"
            rest = part[match.end():].strip()
            blocks.append((heading, rest))
            continue
        # Format 2: "SCHOOL 1 OF 5" then optional next line = school name
        match2 = re.match(r"^SCHOOL\s+(\d+)\s+OF\s+\d+\s*\n?(.*)", part, re.DOTALL)
        if match2:
            num = match2.group(1)
            rest = (match2.group(2) or "").strip()
            lines = rest.split("\n")
            name_line = ""
            if lines:
                for line in lines:
                    line = line.strip()
                    if line and not line.startswith("Tier:") and "THE VIBE" not in line and "Generated" not in line:
                        name_line = line[:100]
                        break
            heading = f"{num}. {name_line}" if name_line else f"SCHOOL {num} OF 5"
            blocks.append((heading, rest))
    return blocks


def extract_vibe_tradeoffs_pros_cons(block: str) -> dict:
    out = {"vibe": "", "tradeoffs": "", "pros": [], "cons": []}

    vibe = extract_section(block, "THE VIBE\n", ["THE TRADE-OFFS", "THE TRADE-OFFS\n", "PROS\n", "CONS\n"])
    if vibe:
        out["vibe"] = re.sub(r"\s+", " ", vibe).strip()

    tradeoffs = extract_section(block, "THE TRADE-OFFS\n", ["PROS\n", "CONS\n", "Pros:\n", "Cons:\n"])
    if tradeoffs:
        out["tradeoffs"] = re.sub(r"\s+", " ", tradeoffs).strip()

    pros_text = extract_section(block, "PROS\n", ["CONS\n", "Cons:\n", "---", "DATA CONFIDENCE", "Data confidence", "Questions to ask"])
    if not pros_text and "Pros:\n" in block:
        pros_text = extract_section(block, "Pros:\n", ["Cons:\n", "CONS\n", "---", "Data confidence"])
    if pros_text:
        lines = [l.strip() for l in pros_text.split("\n") if l.strip() and (l.strip().startswith("-") or l.strip().startswith("•"))]
        out["pros"] = [re.sub(r"^[-•]\s*", "", l).strip() for l in lines]

    cons_text = extract_section(block, "CONS\n", ["---", "END OF", "DATA CONFIDENCE", "Data confidence", "Questions to ask"])
    if not cons_text and "Cons:\n" in block:
        cons_text = extract_section(block, "Cons:\n", ["---", "END OF", "Data confidence"])
    if cons_text:
        lines = [l.strip() for l in cons_text.split("\n") if l.strip() and (l.strip().startswith("-") or l.strip().startswith("•"))]
        out["cons"] = [re.sub(r"^[-•]\s*", "", l).strip() for l in lines]

    return out


def city_from_filename(name: str) -> str:
    n = name.upper()
    if "KUALA LUMPUR" in n or "KL " in n:
        return "kuala-lumpur"
    if "SINGAPORE" in n:
        return "singapore"
    if "BANGKOK" in n:
        return "bangkok"
    if "HONG KONG" in n:
        return "hong-kong"
    if "DUBAI" in n:
        return "dubai"
    return "unknown"


def main():
    default_dir = Path.home() / "Desktop" / "INTELLIGENCE EDITORIAL"
    eml_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else default_dir
    if not eml_dir.exists():
        print(f"Directory not found: {eml_dir}", file=sys.stderr)
        sys.exit(1)

    out_dir = Path(__file__).resolve().parent.parent / "scripts" / "intelligence-briefings"
    out_dir.mkdir(parents=True, exist_ok=True)

    by_city = {}
    eml_files = sorted(eml_dir.glob("*.eml"))

    for eml_path in eml_files:
        city = city_from_filename(eml_path.name)
        if city == "unknown":
            continue
        try:
            body = get_plain_body(eml_path)
        except Exception as e:
            print(f"Skip {eml_path.name}: {e}", file=sys.stderr)
            continue

        body = body.replace("=\n", "")
        body = re.sub(r"=([0-9A-Fa-f]{2})", lambda m: chr(int(m.group(1), 16)) if len(m.group(1)) == 2 else m.group(0), body)

        blocks = split_school_blocks(body)
        for heading, block in blocks:
            parsed = extract_vibe_tradeoffs_pros_cons(block)
            parsed["_source"] = eml_path.name
            parsed["_heading"] = heading
            by_city.setdefault(city, []).append(parsed)

    for city, schools in by_city.items():
        out_path = out_dir / f"{city}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(schools, f, indent=2, ensure_ascii=False)
        print(f"Wrote {out_path} ({len(schools)} schools)")


if __name__ == "__main__":
    main()
