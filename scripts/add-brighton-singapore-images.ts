/**
 * One-off: convert Brighton College Singapore PNGs to WebP.
 * Campus exterior = main (profile + card). Run: npx tsx scripts/add-brighton-singapore-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS =
  process.env.BRIGHTON_ASSETS ??
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const OUT_DIR = path.join(__dirname, "../public/images/schools/brighton-college");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 1600;
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
  const campus = path.join(ASSETS, "campus-0e9c58c5-a394-4474-a9e0-bf460e39b140.png");
  const classroom = path.join(ASSETS, "994a902333ca-9f88f7f7-e0f1-4610-b183-436d96316d78.png");
  const woodworking = path.join(
    ASSETS,
    "website-pop-up-banner-960x540px-1_copy-976ae3bf-d860-45da-8659-25909f5fcf60.png"
  );
  const volleyball = path.join(ASSETS, "SS-clubs-45fdd548-1f4c-4f1c-9682-74f34046da43.png");

  for (const [label, p] of [
    ["campus", campus],
    ["classroom", classroom],
    ["woodworking", woodworking],
    ["volleyball", volleyball],
  ] as const) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${label}: ${p}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  await optimizeToWebp(campus, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(campus, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);
  await optimizeToWebp(classroom, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);
  await optimizeToWebp(woodworking, path.join(OUT_DIR, "photo2.webp"), PHOTO_WIDTH);
  await optimizeToWebp(volleyball, path.join(OUT_DIR, "photo3.webp"), PHOTO_WIDTH);

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp, card.webp (campus), photo1–3.webp");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
