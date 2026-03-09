/**
 * Import school head images and Excel summary into the site.
 *
 * Usage:
 *   HEAD_IMAGES_DIR=/Users/darren/Desktop/heads_images \
 *   HEADS_XLSX=/Users/darren/Desktop/School_Heads_Summary.xlsx \
 *   npx tsx scripts/import-heads.ts
 *
 * - Reads Excel "Summary" sheet (columns: #, School, Leader Name, Title, Photo Filename).
 * - Scans HEAD_IMAGES_DIR/{City} for files matching Photo Filename (any extension).
 * - Copies images to public/images/heads/{citySlug}/{schoolSlug}.webp (resized for head shot).
 * - Writes src/data/head-images.json (slug -> photo path) and src/data/head-overrides.json (slug -> { name, title }).
 */

import * as fs from "fs";
import * as path from "path";
import XLSX from "xlsx";
import sharp from "sharp";

const HEAD_IMAGES_DIR = process.env.HEAD_IMAGES_DIR || path.join(process.cwd(), "heads_images");
const HEADS_XLSX = process.env.HEADS_XLSX || path.join(path.dirname(HEAD_IMAGES_DIR), "School_Heads_Summary.xlsx");
const OUT_HEADS_JSON = path.join(process.cwd(), "src/data/head-images.json");
const OUT_OVERRIDES_JSON = path.join(process.cwd(), "src/data/head-overrides.json");
const PUBLIC_HEADS = path.join(process.cwd(), "public/images/heads");

const CITY_FOLDER_TO_SLUG: Record<string, string> = {
  Bangkok: "bangkok",
  Dubai: "dubai",
  "Hong_Kong": "hong-kong",
  Jakarta: "jakarta",
  "Kuala_Lumpur": "kuala-lumpur",
  Singapore: "singapore",
};

const EXCEL_NAME_ALIASES: Record<string, string> = {
  "singapore|uwcsea east campus": "united-world-college-of-south-east-asia-east-campus",
  "singapore|australian international school singapore": "australian-international-school-singapore",
  "singapore|stamford american international school singapore": "stamford-american-international-school-singapore",
  "dubai|queen elizabeths school dubai sports city": "queen-elizabeth-s-school-dubai-sports-city",
  "dubai|nord anglia international school dubai": "nord-anglia-international-school",
  "dubai|brighton college dubai": "brighton-college-dubai",
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

type HeadRow = {
  city: string;
  citySlug: string;
  school: string;
  leader: string;
  title: string;
  photoKey: string;
};

function parseExcel(filePath: string): HeadRow[] {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets["Summary"];
  if (!ws) throw new Error("No 'Summary' sheet");
  const rows = XLSX.utils.sheet_to_json(ws as XLSX.WorkSheet, { header: 1 }) as unknown[][];
  const out: HeadRow[] = [];
  let currentCity: string | null = null;
  let currentCitySlug: string | null = null;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] as unknown[];
    if (!Array.isArray(r) || r.length === 0) continue;
    const first = String(r[0] ?? "");
    if (
      first === "SINGAPORE" ||
      first === "HONG KONG" ||
      first === "DUBAI" ||
      first === "KUALA LUMPUR" ||
      first === "JAKARTA" ||
      first === "BANGKOK"
    ) {
      currentCity = first;
      currentCitySlug = toSlug(first);
      continue;
    }
    if (typeof r[0] === "number" && r[1] && currentCity && currentCitySlug) {
      const school = String(r[1]).trim();
      const leader = String(r[2] ?? "").trim();
      const title = String(r[3] ?? "").trim();
      const photoKey = String(r[4] ?? "").trim();
      if (school && leader) {
        out.push({
          city: currentCity,
          citySlug: currentCitySlug,
          school,
          leader,
          title,
          photoKey,
        });
      }
    }
  }
  return out;
}

function findImageInDir(dir: string, photoKey: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const base = photoKey.toLowerCase();
  for (const f of files) {
    const baseName = path.basename(f, path.extname(f));
    if (baseName.toLowerCase() === base) return path.join(dir, f);
  }
  return null;
}

async function main() {
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
    const aliasKey = citySlug + "|" + normalizeNameForMatch(schoolName);
    if (EXCEL_NAME_ALIASES[aliasKey]) return EXCEL_NAME_ALIASES[aliasKey];
    const byCity = nameToSlugByCity[citySlug];
    if (!byCity) return null;
    const normalized = normalizeNameForMatch(schoolName);
    const slugified = toSlug(schoolName);
    if (byCity[normalized]) return byCity[normalized];
    if (byCity[slugified]) return byCity[slugified];
    for (const [key, s] of Object.entries(byCity)) {
      if (key.includes(normalized) || normalized.includes(key)) return s;
    }
    return null;
  }

  if (!fs.existsSync(HEADS_XLSX)) {
    console.error("Excel not found:", HEADS_XLSX);
    process.exit(1);
  }
  const rows = parseExcel(HEADS_XLSX);
  console.log("Parsed", rows.length, "head rows from Excel");

  const headImages: Record<string, string> = {};
  const headOverrides: Record<string, { name: string; title?: string }> = {};
  const cityDirMap: Record<string, string> = {};
  if (fs.existsSync(HEAD_IMAGES_DIR)) {
    const cityFolders = fs.readdirSync(HEAD_IMAGES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const d of cityFolders) {
      const slug = CITY_FOLDER_TO_SLUG[d.name];
      if (slug) cityDirMap[slug] = path.join(HEAD_IMAGES_DIR, d.name);
    }
  }

  for (const row of rows) {
    const slug = resolveSlug(row.citySlug, row.school);
    if (!slug) {
      console.warn("No slug for", row.citySlug, row.school);
      continue;
    }
    headOverrides[slug] = { name: row.leader, title: row.title || undefined };

    if (!row.photoKey) continue;
    const cityDir = cityDirMap[row.citySlug];
    if (!cityDir) continue;
    const srcPath = findImageInDir(cityDir, row.photoKey);
    if (!srcPath) continue;
    const destDir = path.join(PUBLIC_HEADS, row.citySlug);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const ext = path.extname(srcPath).toLowerCase();
    let publicPath: string;
    const destWebp = path.join(destDir, `${slug}.webp`);
    try {
      await sharp(srcPath)
        .resize(176, 176, { fit: "cover" })
        .webp({ quality: 85 })
        .toFile(destWebp);
      publicPath = `/images/heads/${row.citySlug}/${slug}.webp`;
    } catch {
      const destWithExt = path.join(destDir, `${slug}${ext}`);
      fs.copyFileSync(srcPath, destWithExt);
      publicPath = `/images/heads/${row.citySlug}/${slug}${ext}`;
    }
    headImages[slug] = publicPath;
  }

  fs.writeFileSync(
    OUT_OVERRIDES_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), slugs: headOverrides }, null, 2)
  );
  if (Object.keys(headImages).length > 0) {
    fs.writeFileSync(
      OUT_HEADS_JSON,
      JSON.stringify({ generatedAt: new Date().toISOString(), slugs: headImages }, null, 2)
    );
  }
  console.log("Wrote", OUT_OVERRIDES_JSON, Object.keys(headImages).length > 0 ? "and " + OUT_HEADS_JSON : "(kept existing " + OUT_HEADS_JSON + ")");
  console.log("Head overrides:", Object.keys(headOverrides).length);
  console.log("Head images:", Object.keys(headImages).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
