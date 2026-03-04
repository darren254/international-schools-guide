/**
 * One-off: convert Winstedt School PNGs to WebP and write to public/images/schools/the-winstedt-school/
 * Run: npx tsx scripts/add-winstedt-school-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS = process.env.WINSTEDT_ASSETS ?? "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const OUT_DIR = path.join(__dirname, "../public/images/schools/the-winstedt-school");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 800;
const WEBP_QUALITY = 78;

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
  const building = path.join(ASSETS, "Around-the-quad-10-scaled-5b9f0856-4775-487e-99f8-e42f863807cd.png");
  const classroom = path.join(ASSETS, "House-Systems-1-ad06bcf9-8edf-4f65-b352-85e9fce161cb.png");
  const playground = path.join(ASSETS, "Playground-Outdoor-classes-63-scaled-037a438b-209a-4f0a-8d67-e086bb2b1a0f.png");

  for (const p of [building, classroom, playground]) {
    if (!fs.existsSync(p)) {
      console.error(`Missing: ${p}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  await optimizeToWebp(building, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(building, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);
  await optimizeToWebp(classroom, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);
  await optimizeToWebp(playground, path.join(OUT_DIR, "photo2.webp"), PHOTO_WIDTH);

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp (max 1600px), card.webp (800px), photo1.webp, photo2.webp");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
