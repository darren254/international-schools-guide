/**
 * Parses EML briefing emails and outputs intelligence overrides for school profiles 21-30.
 * Run: npx tsx scripts/profile-briefings-21-30/parse-eml-briefings.ts
 *
 * Reads: /Users/darren/Desktop/profiles email isg 21-30/*.eml
 * Writes: scripts/profile-briefings-21-30/extracted.json, updates PROGRESS.md
 */

import * as fs from "fs";
import * as path from "path";

const EML_DIR = "/Users/darren/Desktop/profiles email isg 21-30";
const OUT_DIR = path.join(process.cwd(), "scripts/profile-briefings-21-30");

function cityFromFilename(name: string): string {
  if (/Singapore/i.test(name)) return "singapore";
  if (/Kuala Lumpur/i.test(name)) return "kuala-lumpur";
  if (/Bangkok/i.test(name)) return "bangkok";
  if (/Hong Kong/i.test(name)) return "hong-kong";
  if (/Dubai/i.test(name)) return "dubai";
  return "";
}

function decodeQuotedPrintable(raw: string): string {
  return raw
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\r\n/g, "\n");
}

function extractPlainTextFromEml(emlContent: string): string {
  const plainStart = emlContent.indexOf("Content-Type: text/plain");
  if (plainStart === -1) return emlContent;
  const bodyStart = emlContent.indexOf("\n\n", plainStart) + 2;
  const boundaryMatch = emlContent.match(/boundary="([^"]+)"/);
  const boundary = boundaryMatch ? boundaryMatch[1].trim() : null;
  let end = emlContent.length;
  if (boundary) {
    const nextBoundary = emlContent.indexOf("\n--" + boundary, bodyStart);
    if (nextBoundary > bodyStart) end = nextBoundary;
  } else {
    const nextPart = emlContent.indexOf("\n--", bodyStart);
    if (nextPart > bodyStart) {
      const afterDash = emlContent.slice(nextPart, nextPart + 20);
      if (afterDash.startsWith("\n---") && !afterDash.startsWith("\n--===")) end = nextPart;
      else end = nextPart;
    }
  }
  const rawBody = emlContent.slice(bodyStart, end);
  return decodeQuotedPrintable(rawBody);
}

function parseSchoolBlocks(plainText: string): { num: number; name: string; body: string }[] {
  const blocks: { num: number; name: string; body: string }[] = [];
  const re = /^\s*(\d+)\.\s+(.+?)\s+--/gm;
  const matches: { num: number; name: string; index: number }[] = [];
  let m;
  while ((m = re.exec(plainText)) !== null) {
    matches.push({ num: parseInt(m[1], 10), name: m[2].trim(), index: m.index });
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : plainText.length;
    blocks.push({
      num: matches[i].num,
      name: matches[i].name,
      body: plainText.slice(start, end).trim(),
    });
  }
  return blocks;
}

function extractSections(body: string): { vibe: string; tradeoffs: string; pros: string[]; cons: string[] } {
  const vibeMatch = body.match(/THE VIBE\s*\n([\s\S]*?)(?=THE TRADE-OFFS|$)/i);
  const tradeMatch = body.match(/THE TRADE-OFFS\s*\n([\s\S]*?)(?=Pros:|Cons:|\d+\.\s|$)/i);
  const prosMatch = body.match(/Pros:\s*\n([\s\S]*?)(?=Cons:|Data confidence|Questions to ask|\d+\.\s|$)/i);
  const consMatch = body.match(/Cons:\s*\n([\s\S]*?)(?=Data confidence|Questions to ask|\d+\.\s|$)/i);
  const vibe = (vibeMatch ? vibeMatch[1].trim() : "").replace(/\n+/g, " ").replace(/\s+/g, " ");
  const tradeoffs = (tradeMatch ? tradeMatch[1].trim() : "").replace(/\n+/g, " ").replace(/\s+/g, " ");
  const pros: string[] = [];
  if (prosMatch) {
    prosMatch[1].trim().split(/\n/).forEach((line) => {
      const t = line.replace(/^-\s*/, "").trim();
      if (t) pros.push(t.replace(/\n/g, " ").replace(/\s+/g, " "));
    });
  }
  const cons: string[] = [];
  if (consMatch) {
    consMatch[1].trim().split(/\n/).forEach((line) => {
      const t = line.replace(/^-\s*/, "").trim();
      if (t) cons.push(t.replace(/\n/g, " ").replace(/\s+/g, " "));
    });
  }
  return { vibe, tradeoffs, pros, cons };
}

function nameToSlug(name: string, _city: string): string {
  let s = name
    .replace(/\s*--.*$/, "")
    .trim()
    .replace(/\s+(SINGAPORE|KUALA LUMPUR|BANGKOK|HONG KONG|DUBAI|MALAYSIA|THAILAND|UAE)$/i, "")
    .trim();
  s = s.replace(/['']/g, "").replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
  return s;
}

function getSlugsForCity(city: string): string[] {
  const file: Record<string, string> = {
    "singapore": "src/data/singapore-schools.ts",
    "kuala-lumpur": "src/data/kuala-lumpur-schools.ts",
    "bangkok": "src/data/bangkok-schools.ts",
    "hong-kong": "src/data/hong-kong-schools.ts",
    "dubai": "src/data/dubai-schools.ts",
  };
  const p = path.join(process.cwd(), file[city] || "");
  if (!fs.existsSync(p)) return [];
  const content = fs.readFileSync(p, "utf-8");
  const slugs: string[] = [];
  const re = /slug:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(content)) !== null) slugs.push(match[1]);
  return slugs;
}

function findSlug(emailName: string, city: string): string | null {
  const manual: Record<string, string> = {
    "THE INTERNATIONAL SCHOOL @ PARKCITY": "the-international-school-at-parkcity",
    "ESF ISLAND SCHOOL": "island-school",
    "ESF RENAISSANCE COLLEGE (RCHK)": "renaissance-college",
    "ESF WEST ISLAND SCHOOL (WIS)": "west-island-school",
  };
  const key = emailName.toUpperCase().replace(/\s+/g, " ").replace(/\s*\([^)]*\)\s*$/, "").trim();
  const keyWithParen = emailName.toUpperCase().replace(/\s+/g, " ").trim();
  if (manual[key]) return manual[key];
  if (manual[keyWithParen]) return manual[keyWithParen];
  const slug = nameToSlug(emailName, city);
  const slugs = getSlugsForCity(city);
  if (slugs.includes(slug)) return slug;
  const slug2 = nameToSlug(emailName.replace(/\s+(SINGAPORE|KUALA LUMPUR|BANGKOK|HONG KONG|DUBAI)$/i, ""), city);
  if (slugs.includes(slug2)) return slug2;
  const normalized = slug.replace(/-+$/g, "");
  const found = slugs.find((s) => s === normalized || s.startsWith(normalized + "-") || normalized.startsWith(s));
  return found ?? null;
}

interface ExtractedBriefing {
  city: string;
  file: string;
  num: number;
  emailName: string;
  slug: string | null;
  vibe: string;
  tradeoffs: string;
  pros: string[];
  cons: string[];
}

function main() {
  const emlDir = path.isAbsolute(EML_DIR) ? EML_DIR : path.join(process.cwd(), EML_DIR);
  const files = fs.readdirSync(emlDir).filter((f) => f.endsWith(".eml"));
  const all: ExtractedBriefing[] = [];
  const logLines: string[] = [];

  if (files.length === 0) {
    console.error("No EML files in", emlDir);
    process.exit(1);
  }

  for (const file of files) {
    const city = cityFromFilename(file);
    if (!city) continue;
    const fullPath = path.join(emlDir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const plain = extractPlainTextFromEml(raw);
    const blocks = parseSchoolBlocks(plain);
    fs.mkdirSync(OUT_DIR, { recursive: true });
    for (const block of blocks) {
      const sections = extractSections(block.body);
      const slug = findSlug(block.name, city);
      all.push({
        city,
        file,
        num: block.num,
        emailName: block.name,
        slug,
        vibe: sections.vibe,
        tradeoffs: sections.tradeoffs,
        pros: sections.pros,
        cons: sections.cons,
      });
      logLines.push(`${city} ${block.num}: ${block.name} -> ${slug ?? "NO MATCH"}`);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "extracted.json"), JSON.stringify(all, null, 2), "utf-8");
  fs.writeFileSync(path.join(OUT_DIR, "parse-log.txt"), logLines.join("\n"), "utf-8");
  console.log("Extracted", all.length, "briefings. Log:", path.join(OUT_DIR, "parse-log.txt"));
  console.log("No slug match:", all.filter((b) => !b.slug).length);
}

main();
