/**
 * Import school images from /Users/darren/Desktop/pending-images (all subfolders).
 * Applies images only to empty panels: does not overwrite existing profile, card, or photo1..photo20.
 * Converts to webp (profile/card 1600/800, photos 1600), writes to public/images/schools/<slug>/ and updates school-images.json.
 *
 * Run: npx tsx scripts/import-pending-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { HONG_KONG_SCHOOLS } from "../src/data/hong-kong-schools";
import { SINGAPORE_SCHOOLS } from "../src/data/singapore-schools";
import { DUBAI_SCHOOLS } from "../src/data/dubai-schools";
import { BANGKOK_SCHOOLS } from "../src/data/bangkok-schools";

const SOURCE_ROOT = "/Users/darren/Desktop/pending-images";
const OUT_BASE = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 1600;
const WEBP_QUALITY = 78;
const MAX_GALLERY_SLOTS = 20;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type CityConfig = {
  folder: string;
  schools: { name: string; slug: string }[];
  suffix: string;
  fileBaseToSlug: Record<string, string>;
};

const CITY_CONFIGS: CityConfig[] = [
  {
    folder: "images-hongkong",
    schools: HONG_KONG_SCHOOLS,
    suffix: " hong kong",
    fileBaseToSlug: {
      "anfield international school hong kong": "anfield-school",
      "christian alliance pc lau memorial international school": "christian-alliance-p-c-lau-memorial-international-school",
      "esf kennedy school": "kennedy-school",
      "esf quarry bay school": "quarry-bay-school",
      "ichk hong lok yuen kindergarten and primary": "ichk-kindergarten-and-primary",
      "hkila hong kong": "hkila",
      "hkca po leung kuk school": "hkca-po-leung-kuk-school",
      "li po chun united world college of hong kong": "li-po-chun-united-world-college-of",
      "ymca of hong kong christian college": "ymca-of-hong-kong-christian-college",
      "the jockey club sarah roe school hong kong": "the-jockey-club-sarah-roe-school",
      "ymca of hong kong christian college": "ymca-of-hong-kong-christian-college",
    },
  },
  {
    folder: "images-singapore",
    schools: SINGAPORE_SCHOOLS,
    suffix: " singapore",
    fileBaseToSlug: {},
  },
  {
    folder: "images-dubai-final",
    schools: DUBAI_SCHOOLS,
    suffix: " dubai",
    fileBaseToSlug: {},
  },
  {
    folder: "images-bangkok",
    schools: BANGKOK_SCHOOLS,
    suffix: " bangkok",
    fileBaseToSlug: {
      "pensmith international school": "pensmith-school",
      "ait international school bangkok": "ait-international-school",
    },
  },
];

function buildNameToSlug(config: CityConfig): Map<string, string> {
  const map = new Map<string, string>();
  const suffixLen = config.suffix.length;
  for (const s of config.schools) {
    const key = normalizeKey(s.name);
    map.set(key, s.slug);
    if (key.endsWith(config.suffix)) {
      map.set(key.slice(0, -suffixLen).trim(), s.slug);
    }
  }
  return map;
}

function getFilesBySchool(sourceDir: string): Map<string, string[]> {
  const byBase = new Map<string, string[]>();
  if (!fs.existsSync(sourceDir)) return byBase;
  const files = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const f of files) {
    if (!f.isFile()) continue;
    const ext = path.extname(f.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const match = f.name.match(/^(.+)_(\d+)\.(jpg|jpeg|png|webp|gif)$/i);
    if (!match) continue;
    const base = match[1];
    const idx = parseInt(match[2], 10);
    if (idx < 1 || idx > MAX_GALLERY_SLOTS) continue;
    if (!byBase.has(base)) byBase.set(base, []);
    const list = byBase.get(base)!;
    while (list.length < idx) list.push("");
    list[idx - 1] = path.join(sourceDir, f.name);
  }
  for (const [base, list] of byBase) {
    byBase.set(base, list.filter(Boolean));
  }
  return byBase;
}

async function optimizeToWebp(
  inputPath: string,
  outputPath: string,
  width: number
): Promise<boolean> {
  try {
    await sharp(inputPath)
      .rotate()
      .resize({ width, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(outputPath);
    return true;
  } catch (err) {
    console.warn("Skip (invalid/unsupported image):", path.basename(inputPath), (err as Error).message?.slice(0, 60));
    return false;
  }
}

async function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error("Source folder not found:", SOURCE_ROOT);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (!manifest.slugs) manifest.slugs = {};

  let totalProcessed = 0;
  const allSkipped: string[] = [];

  for (const config of CITY_CONFIGS) {
    const sourceDir = path.join(SOURCE_ROOT, config.folder);
    if (!fs.existsSync(sourceDir)) {
      console.warn("Skip folder (not found):", config.folder);
      continue;
    }

    const nameToSlug = buildNameToSlug(config);
    const bySchool = getFilesBySchool(sourceDir);
    const skipped: string[] = [];

    for (const [fileBase, fileList] of bySchool) {
      const key = normalizeKey(fileBase);
      const slug =
        nameToSlug.get(key) ??
        nameToSlug.get(key.replace(new RegExp(config.suffix.replace(" ", "\\s+") + "$"), "").trim()) ??
        config.fileBaseToSlug[key];
      if (!slug) {
        skipped.push(fileBase);
        continue;
      }

      const existing = manifest.slugs[slug] ?? {};
      const newEntry: Record<string, string> = {};
      const first = fileList[0];
      if (!first) continue;

      const outDir = path.join(OUT_BASE, slug);
      fs.mkdirSync(outDir, { recursive: true });

      if (!existing.profile) {
        const ok = await optimizeToWebp(first, path.join(outDir, "profile.webp"), PROFILE_WIDTH);
        if (ok) newEntry.profile = `/images/schools/${slug}/profile.webp`;
      }
      if (!existing.card) {
        const ok = await optimizeToWebp(first, path.join(outDir, "card.webp"), CARD_WIDTH);
        if (ok) newEntry.card = `/images/schools/${slug}/card.webp`;
      }

      for (let i = 0; i < Math.min(fileList.length, MAX_GALLERY_SLOTS); i++) {
        const slot = `photo${i + 1}`;
        if (existing[slot]) continue;
        const file = fileList[i];
        if (!file) continue;
        const outPath = path.join(outDir, `${slot}.webp`);
        const ok = await optimizeToWebp(file, outPath, PHOTO_WIDTH);
        if (ok) newEntry[slot] = `/images/schools/${slug}/${slot}.webp`;
      }

      if (Object.keys(newEntry).length > 0) {
        manifest.slugs[slug] = { ...existing, ...newEntry, sourceFolder: config.folder };
        totalProcessed++;
        console.log(config.folder, slug, ":", Object.keys(newEntry).join(", "));
      }
    }

    if (skipped.length > 0) {
      allSkipped.push(...skipped.map((b) => `[${config.folder}] ${b}`));
    }
  }

  if (allSkipped.length > 0) {
    console.warn("\nSkipped (no matching school):", allSkipped.slice(0, 40).join(", "));
    if (allSkipped.length > 40) console.warn("... and", allSkipped.length - 40, "more");
  }

  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("\nUpdated", MANIFEST_PATH, "—", totalProcessed, "school(s)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
