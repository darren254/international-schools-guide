/**
 * Import Dubai school images from /Users/darren/Desktop/images-dubai-final.
 * Files named like "School-Name-Dubai_1.jpg", "School-Name-Dubai_2.jpg".
 * Converts to webp (profile 1600px, card 800px, photo1/2 1600px) and updates school-images.json.
 *
 * Run: npx tsx scripts/import-dubai-school-images-from-desktop.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { DUBAI_SCHOOLS } from "../src/data/dubai-schools";

const SOURCE_BASE = "/Users/darren/Desktop/images-dubai-final";
const OUT_BASE = path.join(__dirname, "../public/images/schools");
const MANIFEST_PATH = path.join(__dirname, "../src/data/school-images.json");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 1600;
const WEBP_QUALITY = 78;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build map: normalized school name -> slug */
const nameToSlug = new Map<string, string>();
for (const s of DUBAI_SCHOOLS) {
  const key = normalizeKey(s.name);
  nameToSlug.set(key, s.slug);
  if (key.endsWith(" dubai")) {
    nameToSlug.set(key.slice(0, -6).trim(), s.slug);
  }
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

function getFilesBySchool(): Map<string, string[]> {
  const files = fs.readdirSync(SOURCE_BASE, { withFileTypes: true });
  const byBase = new Map<string, string[]>();

  for (const f of files) {
    if (!f.isFile()) continue;
    const ext = path.extname(f.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const base = f.name.replace(/_[12]\.(jpg|jpeg|png|webp|gif)$/i, "");
    if (!byBase.has(base)) byBase.set(base, []);
    const full = path.join(SOURCE_BASE, f.name);
    const list = byBase.get(base)!;
    const num = f.name.match(/_([12])\./)?.[1];
    const idx = num === "1" ? 0 : 1;
    list[idx] = full;
  }

  for (const [base, list] of byBase) {
    const ordered = [list[0], list[1]].filter(Boolean) as string[];
    byBase.set(base, ordered);
  }
  return byBase;
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (!manifest.slugs) manifest.slugs = {};
  const bySchool = getFilesBySchool();
  let processed = 0;
  const skipped: string[] = [];

  for (const [fileBase, fileList] of bySchool) {
    const key = normalizeKey(fileBase);
    let slug = nameToSlug.get(key) ?? nameToSlug.get(key.replace(/\s+dubai$/, ""));
    if (!slug) {
      skipped.push(fileBase);
      continue;
    }

    const [first, second] = fileList;
    if (!first) continue;

    const outDir = path.join(OUT_BASE, slug);
    fs.mkdirSync(outDir, { recursive: true });

    const ok1 = await optimizeToWebp(first, path.join(outDir, "profile.webp"), PROFILE_WIDTH);
    const ok2 = await optimizeToWebp(first, path.join(outDir, "card.webp"), CARD_WIDTH);
    if (!ok1 || !ok2) {
      skipped.push(fileBase + " (first image failed)");
      continue;
    }

    const entry: Record<string, string> = {
      profile: `/images/schools/${slug}/profile.webp`,
      card: `/images/schools/${slug}/card.webp`,
      sourceFolder: "images-dubai-final",
      sourceFile: path.basename(first),
    };

    if (second) {
      const ok3 = await optimizeToWebp(second, path.join(outDir, "photo1.webp"), PHOTO_WIDTH);
      if (ok3) entry.photo1 = `/images/schools/${slug}/photo1.webp`;
    }

    manifest.slugs[slug] = { ...manifest.slugs[slug], ...entry };
    processed++;
    console.log(slug, ":", path.basename(first), second ? "+ photo1" : "");
  }

  if (skipped.length > 0) {
    console.warn("\nSkipped (no matching Dubai school):", skipped.slice(0, 20).join(", "));
    if (skipped.length > 20) console.warn("... and", skipped.length - 20, "more");
  }

  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("\nUpdated", MANIFEST_PATH, "—", processed, "school(s)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
