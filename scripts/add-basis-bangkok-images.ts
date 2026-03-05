/**
 * One-off: add BASIS International School Bangkok images.
 * Campus = profile + card; engineering classroom = photo1.
 * Run: npx tsx scripts/add-basis-bangkok-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS =
  process.env.ASSETS ??
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const SLUG = "basis-international-school";
const OUT_DIR = path.join(__dirname, "../public/images/schools", SLUG);
const MANIFEST_PATH = path.join(__dirname, "../src/data/school-images.json");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 1600;
const WEBP_QUALITY = 78;

const CAMPUS =
  "campus_BASIS-International-School-Bangkok_0492031c0-9c78aa36-b239-4820-88b3-60b5918efe4c.png";
const CLASSROOM =
  "Engineering-classroom-as-Basis-International-School-Bangkok-1caffcbb-e408-4b7f-b7d4-92d17611c702.png";

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
  const classroomPath = path.join(ASSETS, CLASSROOM);

  for (const [label, p] of [
    ["campus", campusPath],
    ["classroom", classroomPath],
  ] as const) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${label}: ${p}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  await optimizeToWebp(campusPath, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(campusPath, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);
  await optimizeToWebp(classroomPath, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  manifest.slugs[SLUG] = {
    profile: `/images/schools/${SLUG}/profile.webp`,
    card: `/images/schools/${SLUG}/card.webp`,
    photo1: `/images/schools/${SLUG}/photo1.webp`,
    sourceFolder: "assets",
    sourceFile: "BASIS International School Bangkok",
  };
  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp, card.webp (campus), photo1.webp (engineering classroom)");
  console.log("Updated school-images.json for", SLUG);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
