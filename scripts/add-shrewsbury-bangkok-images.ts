/**
 * One-off: add/update Shrewsbury International School Bangkok images.
 * Campus aerial = profile + card; students group = photo1; hero/sports = photo2.
 * Run: npx tsx scripts/add-shrewsbury-bangkok-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS =
  process.env.ASSETS ??
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const SLUG = "shrewsbury-international-school";
const OUT_DIR = path.join(__dirname, "../public/images/schools", SLUG);
const MANIFEST_PATH = path.join(__dirname, "../src/data/school-images.json");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 1600;
const WEBP_QUALITY = 78;

const CAMPUS = "campus_shewsbury_bangkok-5cfbe4de-964f-42d3-a204-02791cd39ad1.png";
const STUDENTS = "1711612658473-a6832f98-4029-44be-964b-fdc88a1f9985.png";
const HERO = "Hero-Banner-10-09-24-2ac87aab-0890-4fcf-8ec6-c130490dbe9f.png";

async function optimizeToWebp(
  inputPath: string,
  outputPath: string,
  width: number
): Promise<void> {
  await sharp(inputPath)
    .rotate()
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(outputPath);
}

async function main() {
  const campusPath = path.join(ASSETS, CAMPUS);
  const studentsPath = path.join(ASSETS, STUDENTS);
  const heroPath = path.join(ASSETS, HERO);

  for (const [label, p] of [
    ["campus", campusPath],
    ["students", studentsPath],
    ["hero", heroPath],
  ] as const) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${label}: ${p}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  await optimizeToWebp(campusPath, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(campusPath, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);
  await optimizeToWebp(studentsPath, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);
  await optimizeToWebp(heroPath, path.join(OUT_DIR, "photo2.webp"), PHOTO_WIDTH);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const existing = manifest.slugs[SLUG] ?? {};
  manifest.slugs[SLUG] = {
    ...existing,
    profile: `/images/schools/${SLUG}/profile.webp`,
    card: `/images/schools/${SLUG}/card.webp`,
    photo1: `/images/schools/${SLUG}/photo1.webp`,
    photo2: `/images/schools/${SLUG}/photo2.webp`,
    sourceFolder: "assets",
    sourceFile: "Shrewsbury Bangkok",
  };
  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp, card.webp (campus), photo1.webp (students), photo2.webp (hero)");
  console.log("Updated school-images.json for", SLUG);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
