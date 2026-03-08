/**
 * Update head-overrides.json and head-bios.json from the School Leaders Directory docx.
 * Usage: npx tsx scripts/update-heads-from-directory.ts [path-to-directory.docx or .txt]
 * Default: /Users/darren/Desktop/school-leaders-directory.docx
 *
 * - Extracts text from .docx via textutil (macOS) or reads .txt directly.
 * - Parses "City", "School Name", "Title:", "Name:", "Bio:" blocks.
 * - Resolves school name + city to slug using SCHOOL_PROFILES and aliases.
 * - Writes src/data/head-overrides.json (name, title) and src/data/head-bios.json (bio).
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const DEFAULT_DOCX = "/Users/darren/Desktop/school-leaders-directory.docx";
const OUT_OVERRIDES_JSON = path.join(process.cwd(), "src/data/head-overrides.json");
const OUT_BIOS_JSON = path.join(process.cwd(), "src/data/head-bios.json");

const CITIES: Record<string, string> = {
  Singapore: "singapore",
  "Hong Kong": "hong-kong",
  Dubai: "dubai",
  "Kuala Lumpur": "kuala-lumpur",
  Jakarta: "jakarta",
  Bangkok: "bangkok",
};

const DIRECTORY_NAME_ALIASES: Record<string, string> = {
  "singapore|uwcsea east campus": "united-world-college-of-south-east-asia-east-campus",
  "singapore|united world college of south east asia dover campus": "united-world-college-of-south-east-asia-dover-campus",
  "singapore|united world college of south east asia east campus": "united-world-college-of-south-east-asia-east-campus",
  "singapore|australian international school singapore": "australian-international-school",
  "singapore|stamford american international school singapore": "stamford-american-international-school",
  "singapore|north london collegiate school singapore": "north-london-collegiate-school",
  "dubai|queen elizabeth's school dubai sports city": "queen-elizabeth-s-school-dubai-sports-city",
  "dubai|queen elizabeths school dubai sports city": "queen-elizabeth-s-school-dubai-sports-city",
  "dubai|nord anglia international school dubai": "nord-anglia-international-school",
  "dubai|brighton college dubai": "brighton-college",
  "dubai|dubai english speaking college": "dubai-english-speaking-college",
  "hong kong|kellett school, the british international school in hong kong": "kellett-school",
  "hong kong|the harbour school": "the-harbour-school",
  "hong kong|the isf academy": "the-isf-academy",
  "hong kong|the international montessori school hong kong": "the-international-montessori-school",
  "hong kong|chinese international school": "chinese-international-school",
  "hong kong|hong kong international school": "hong-kong-international-school",
  "hong kong|hong kong academy": "hong-kong-academy",
  "hong kong|dalton school hong kong": "dalton-school",
  "hong kong|singapore international school (hong kong)": "singapore-international-school",
  "jakarta|jakarta intercultural school": "jakarta-intercultural-school",
  "jakarta|british school jakarta": "british-school-jakarta",
  "jakarta|independent school of jakarta": "independent-school-of-jakarta",
  "jakarta|australian independent school jakarta": "australian-independent-school-jakarta",
  "jakarta|acg school jakarta": "acg-school-jakarta",
  "jakarta|sekolah pelita harapan": "sekolah-pelita-harapan",
  "jakarta|sekolah pelita harapan kemang village": "sekolah-pelita-harapan-kemang-village",
  "jakarta|nord anglia school jakarta": "nord-anglia-school-jakarta",
  "bangkok|bangkok patana school": "bangkok-patana-school",
  "bangkok|nist international school": "nist-international-school",
  "bangkok|shrewsbury international school": "shrewsbury-international-school",
  "bangkok|dulwich college international school": "dulwich-college-international-school",
  "bangkok|harrow international school bangkok": "harrows-international-school",
  "bangkok|wellington college international school": "wellington-college-international-school",
  "bangkok|king's college international school": "king-s-college-international-school",
  "bangkok|brighton college bangkok": "brighton-college-bangkok-vibhavadi",
  "bangkok|basis international school bangkok": "basis-international-school",
  "kuala lumpur|the alice smith school": "the-alice-smith-school",
  "kuala lumpur|garden international school": "garden-international-school",
  "kuala lumpur|nexus international school": "nexus-international-school",
  "kuala lumpur|igb international school": "igb-international-school",
  "kuala lumpur|epsom college in malaysia": "epsom-college-in-malaysia",
  "kuala lumpur|sunway international school": "sunway-international-school",
  "kuala lumpur|charterhouse malaysia": "charterhouse-malaysia",
  "kuala lumpur|the british international school of kuala lumpur": "the-british-international-school-of",
  "kuala lumpur|concord college international school": "concord-college-international-school",
};

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeNameForMatch(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

type DirectoryEntry = {
  city: string;
  citySlug: string;
  schoolName: string;
  title: string;
  name: string;
  bio: string;
};

function extractTextFromDocx(docxPath: string): string {
  try {
    return execSync(`textutil -convert txt -stdout "${docxPath}"`, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
  } catch {
    try {
      const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
      return xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    } catch (e) {
      throw new Error(`Could not extract text from ${docxPath}: ${e}`);
    }
  }
}

function parseDirectoryText(text: string): DirectoryEntry[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim());
  const entries: DirectoryEntry[] = [];
  let currentCity: string | null = null;
  let currentCitySlug: string | null = null;
  let schoolName = "";
  let title = "";
  let name = "";
  let bioLines: string[] = [];
  let inBio = false;
  let lastBareLine = "";

  function flush() {
    if (currentCity && currentCitySlug && schoolName && name) {
      const bio = bioLines.join(" ").trim();
      if (bio || title) {
        entries.push({
          city: currentCity,
          citySlug: currentCitySlug,
          schoolName,
          title: title.trim(),
          name: name.trim(),
          bio,
        });
      }
    }
    schoolName = "";
    title = "";
    name = "";
    bioLines = [];
    inBio = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const citySlug = CITIES[line];
    if (citySlug !== undefined) {
      flush();
      currentCity = line;
      currentCitySlug = citySlug;
      lastBareLine = "";
      continue;
    }
    if (!currentCity) continue;

    if (line.startsWith("Title:")) {
      flush();
      schoolName = lastBareLine;
      title = line.slice(6).trim();
      const next = lines[i + 1];
      if (next?.startsWith("Name:")) {
        name = next.slice(5).trim();
        i++;
      }
      inBio = false;
      continue;
    }
    if (line.startsWith("Name:")) {
      name = line.slice(5).trim();
      inBio = false;
      continue;
    }
    if (line.startsWith("Bio:")) {
      bioLines = [line.slice(4).trim()];
      inBio = true;
      continue;
    }

    if (inBio && (title || name)) {
      if (line) bioLines.push(line);
      continue;
    }

    // Next entry: line looks like a school name (not a bio continuation)
    if (line && line.length > 15 && /^(The |[A-Z][a-zA-Z]+).*(School|College|Academy|International|Institution|Centre)/.test(line) && !line.startsWith("Title:") && !line.startsWith("Name:") && !line.startsWith("Bio:")) {
      if (schoolName && name) flush();
      lastBareLine = line;
      inBio = false;
      continue;
    }

    if (line && !line.startsWith("Title:") && !line.startsWith("Name:") && !line.startsWith("Bio:")) {
      lastBareLine = line;
    }
  }
  flush();
  return entries;
}

async function main() {
  const inputPath = process.argv[2] || DEFAULT_DOCX;
  if (!fs.existsSync(inputPath)) {
    console.error("File not found:", inputPath);
    process.exit(1);
  }

  const raw = inputPath.toLowerCase().endsWith(".docx")
    ? extractTextFromDocx(inputPath)
    : fs.readFileSync(inputPath, "utf-8");
  const entries = parseDirectoryText(raw);
  console.log("Parsed", entries.length, "directory entries");

  const { SCHOOL_PROFILES } = await import("../src/data/schools");
  const nameToSlugByCity: Record<string, Record<string, string>> = {};
  for (const [slug, p] of Object.entries(SCHOOL_PROFILES)) {
    const city = p.citySlug;
    if (!nameToSlugByCity[city]) nameToSlugByCity[city] = {};
    nameToSlugByCity[city][normalizeNameForMatch(p.name)] = slug;
    nameToSlugByCity[city][normalizeNameForMatch(p.shortName)] = slug;
    nameToSlugByCity[city][toSlug(p.name)] = slug;
  }

  function resolveSlug(citySlug: string, schoolName: string): string | null {
    const key = citySlug + "|" + normalizeNameForMatch(schoolName);
    if (DIRECTORY_NAME_ALIASES[key]) return DIRECTORY_NAME_ALIASES[key];
    const byCity = nameToSlugByCity[citySlug];
    if (!byCity) return null;
    const normalized = normalizeNameForMatch(schoolName);
    const slugified = toSlug(schoolName);
    if (byCity[normalized]) return byCity[normalized];
    if (byCity[slugified]) return byCity[slugified];
    for (const [k, s] of Object.entries(byCity)) {
      if (k.includes(normalized) || normalized.includes(k)) return s;
    }
    return null;
  }

  const headOverrides: Record<string, { name: string; title?: string }> = {};
  const headBios: Record<string, string> = {};
  let matched = 0;
  let missed: string[] = [];

  // Keep existing overrides/bios for slugs we don't update from the directory
  if (fs.existsSync(OUT_OVERRIDES_JSON)) {
    const existing = JSON.parse(fs.readFileSync(OUT_OVERRIDES_JSON, "utf-8")) as { slugs: Record<string, { name: string; title?: string }> };
    Object.assign(headOverrides, existing.slugs || {});
  }
  if (fs.existsSync(OUT_BIOS_JSON)) {
    const existing = JSON.parse(fs.readFileSync(OUT_BIOS_JSON, "utf-8")) as { slugs: Record<string, string> };
    Object.assign(headBios, existing.slugs || {});
  }

  for (const e of entries) {
    const slug = resolveSlug(e.citySlug, e.schoolName);
    if (!slug) {
      missed.push(`${e.citySlug}: ${e.schoolName}`);
      continue;
    }
    const profile = SCHOOL_PROFILES[slug];
    const dirNorm = normalizeNameForMatch(e.schoolName);
    const profileNameNorm = normalizeNameForMatch(profile.name);
    const profileShortNorm = normalizeNameForMatch(profile.shortName);
    const exactMatch =
      dirNorm === profileNameNorm ||
      dirNorm === profileShortNorm ||
      profileNameNorm.includes(dirNorm) ||
      dirNorm.includes(profileNameNorm);
    if (!exactMatch) continue;
    matched++;
    headOverrides[slug] = { name: e.name, title: e.title || undefined };
    if (e.bio) headBios[slug] = e.bio;
  }

  fs.writeFileSync(
    OUT_OVERRIDES_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), slugs: headOverrides }, null, 2)
  );
  fs.writeFileSync(
    OUT_BIOS_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), slugs: headBios }, null, 2)
  );
  console.log("Wrote", OUT_OVERRIDES_JSON, "and", OUT_BIOS_JSON);
  console.log("Matched", matched, "schools; overrides", Object.keys(headOverrides).length, "bios", Object.keys(headBios).length);
  if (missed.length > 0 && missed.length <= 50) {
    console.log("Unmatched (first 50):", missed.slice(0, 50).join("; "));
  } else if (missed.length > 50) {
    console.log("Unmatched count:", missed.length, "(first 30:", missed.slice(0, 30).join("; ") + ")");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
