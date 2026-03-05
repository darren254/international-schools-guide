/**
 * One-off: convert UWCSEA Singapore (Dover) PNGs to WebP.
 * Campus = main image (profile + card). Run: npx tsx scripts/add-uwcsea-sg-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS =
  process.env.UWCSEA_ASSETS ??
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const OUT_DIR = path.join(
  __dirname,
  "../public/images/schools/united-world-college-of-south-east-asia-dover-campus"
);
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
  // Campus courtyard = main (profile + card). Then photo1–3.
  const campus = path.join(ASSETS, "campus-cf245fb0-72a0-49a2-b510-22f98c1c6b55.png");
  const gardening = path.join(ASSETS, "609956_main-a64fed17-07b2-4f8e-a112-8d8e76e35e6d.png");
  const workshop = path.join(ASSETS, "609954_main-529af902-b359-4f87-ac04-9dc68ddf7760.png");
  const aerial = path.join(
    ASSETS,
    "2021-College-Perspective-Retrofitting-1280x772jpg-ab3a0686-9acd-40e2-8227-d6c2e8d74d82.png"
  );

  for (const [label, p] of [
    ["campus", campus],
    ["gardening", gardening],
    ["workshop", workshop],
    ["aerial", aerial],
  ] as const) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${label}: ${p}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  await optimizeToWebp(campus, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(campus, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);
  await optimizeToWebp(gardening, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);
  await optimizeToWebp(workshop, path.join(OUT_DIR, "photo2.webp"), PHOTO_WIDTH);
  await optimizeToWebp(aerial, path.join(OUT_DIR, "photo3.webp"), PHOTO_WIDTH);

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp, card.webp (campus main), photo1–3.webp");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
