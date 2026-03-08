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
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Score 0-100: how well directory name matches profile name (higher = better). */
function scoreNameMatch(profileNameNorm: string, dirNameNorm: string): number {
  if (profileNameNorm === dirNameNorm) return 100;
  const p = profileNameNorm;
  const d = dirNameNorm;
  if (d.includes(p) || p.includes(d)) return 80;
  const pWords = new Set(p.split(/\s+/).filter(Boolean));
  const dWords = new Set(d.split(/\s+/).filter(Boolean));
  let overlap = 0;
  for (const w of pWords) {
    if (dWords.has(w)) overlap++;
    else if (w.length > 2 && [...dWords].some((dw) => dw.includes(w) || w.includes(dw))) overlap += 0.5;
  }
  const maxWords = Math.max(pWords.size, dWords.size, 1);
  return Math.round((overlap / maxWords) * 60);
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
    // When inBio, detect next school name before appending line to bio
    if (inBio && line && line.length > 15 && /^(The |[A-Z][a-zA-Z]+).*(School|College|Academy|International|Institution|Centre|Institute)/.test(line)) {
      if (schoolName && name) flush();
      lastBareLine = line;
      inBio = false;
      continue;
    }
    if (inBio && (title || name)) {
      if (line) bioLines.push(line);
      continue;
    }
    // Next entry: line looks like a school name (not a bio continuation)
    if (line && line.length > 15 && /^(The |[A-Z][a-zA-Z]+).*(School|College|Academy|International|Institution|Centre|Institute)/.test(line) && !line.startsWith("Title:") && !line.startsWith("Name:") && !line.startsWith("Bio:")) {
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
  const allEntries = parseDirectoryText(raw);
  console.log("Parsed", allEntries.length, "directory entries");

  const dirByKey = new Map<string, DirectoryEntry>();
  for (const e of allEntries) {
    const key = e.citySlug + "|" + normalizeNameForMatch(e.schoolName);
    if (!dirByKey.has(key)) dirByKey.set(key, e);
  }
  const directory = [...dirByKey.values()];
  console.log("After dedupe:", directory.length, "unique directory entries");

  const { SCHOOL_PROFILES } = await import("../src/data/schools");
  const profiles = Object.entries(SCHOOL_PROFILES).map(([slug, p]) => ({ slug, ...p }));

  const dirByCity = new Map<string, DirectoryEntry[]>();
  for (const e of directory) {
    if (!dirByCity.has(e.citySlug)) dirByCity.set(e.citySlug, []);
    dirByCity.get(e.citySlug)!.push(e);
  }

  type Pair = { slug: string; entry: DirectoryEntry; score: number };
  const pairs: Pair[] = [];
  for (const profile of profiles) {
    const cityDir = dirByCity.get(profile.citySlug) ?? [];
    const profileNorm = normalizeNameForMatch(profile.name);
    const shortNorm = normalizeNameForMatch(profile.shortName);
    for (const e of cityDir) {
      const dirNorm = normalizeNameForMatch(e.schoolName);
      const score = Math.max(scoreNameMatch(profileNorm, dirNorm), scoreNameMatch(shortNorm, dirNorm));
      pairs.push({ slug: profile.slug, entry: e, score });
    }
  }
  pairs.sort((a, b) => b.score - a.score);

  const assignedSlugs = new Set<string>();
  const assignedDirKeys = new Set<string>();
  const slugToEntry = new Map<string, DirectoryEntry>();
  for (const { slug, entry, score } of pairs) {
    const dkey = entry.citySlug + "|" + normalizeNameForMatch(entry.schoolName);
    if (assignedSlugs.has(slug) || assignedDirKeys.has(dkey)) continue;
    if (score < 10) continue;
    assignedSlugs.add(slug);
    assignedDirKeys.add(dkey);
    slugToEntry.set(slug, entry);
  }

  for (const profile of profiles) {
    if (slugToEntry.has(profile.slug)) continue;
    const cityDir = dirByCity.get(profile.citySlug) ?? [];
    const profileNorm = normalizeNameForMatch(profile.name);
    let best: { entry: DirectoryEntry; score: number } | null = null;
    for (const e of cityDir) {
      const dkey = e.citySlug + "|" + normalizeNameForMatch(e.schoolName);
      if (assignedDirKeys.has(dkey)) continue;
      const score = scoreNameMatch(profileNorm, normalizeNameForMatch(e.schoolName));
      if (!best || score > best.score) best = { entry: e, score };
    }
    if (best) {
      slugToEntry.set(profile.slug, best.entry);
      assignedDirKeys.add(best.entry.citySlug + "|" + normalizeNameForMatch(best.entry.schoolName));
    } else if (cityDir.length > 0) {
      slugToEntry.set(profile.slug, cityDir[0]);
    }
  }

  const headOverrides: Record<string, { name: string; title?: string; schoolDisplayName?: string }> = {};
  const headBios: Record<string, string> = {};
  for (const profile of profiles) {
    const e = slugToEntry.get(profile.slug);
    if (e) {
      headOverrides[profile.slug] = {
        name: e.name,
        title: e.title || undefined,
        schoolDisplayName: e.schoolName,
      };
      if (e.bio) headBios[profile.slug] = e.bio;
    }
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
  console.log("Profiles:", profiles.length, "Overrides:", Object.keys(headOverrides).length, "Bios:", Object.keys(headBios).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
