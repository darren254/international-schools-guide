/**
 * One-off: convert Winstedt School PNGs to WebP and write to public/images/schools/the-winstedt-school/
 * Run: npx tsx scripts/add-winstedt-school-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS = process.env.WINSTEDT_ASSETS ?? path.join(__dirname, "../assets");
const OUT_DIR = path.join(__dirname, "../public/images/schools/the-winstedt-school");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 800;
const WEBP_QUALITY = 78;

/** Campus / primary image: courtyard with buildings and shade sails (card + profile hero). */
const CAMPUS_IMAGE = path.join(ASSETS, "2025-07-21-a5c2cf4e-f13e-49a7-86fd-ae1840e08f6d.png");

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

  if (!fs.existsSync(CAMPUS_IMAGE)) {
    console.error(`Missing campus image: ${CAMPUS_IMAGE}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Campus image = main card + first spot on profile (hero)
  await optimizeToWebp(CAMPUS_IMAGE, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(CAMPUS_IMAGE, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);

  // Optional: keep existing photo1/photo2 or regenerate if sources exist
  if (fs.existsSync(classroom)) {
    await optimizeToWebp(classroom, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);
  }
  if (fs.existsSync(playground)) {
    await optimizeToWebp(playground, path.join(OUT_DIR, "photo2.webp"), PHOTO_WIDTH);
  }

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp (campus), card.webp (campus)" + (fs.existsSync(classroom) ? ", photo1.webp" : "") + (fs.existsSync(playground) ? ", photo2.webp" : ""));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
