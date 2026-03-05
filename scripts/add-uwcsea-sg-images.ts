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
  // 002 = main campus image (profile + card). Then photo1–3.
  const campus002 = path.join(ASSETS, "002-af3f512a-149a-43f0-8edb-0c5c0b6002fc.png");
  const students = path.join(ASSETS, "140524_Dover_PS_Student_Council_06-9d12f3ee-20c7-4c5c-aa09-281778920092.png");
  const library = path.join(ASSETS, "UWCSEA_Dover-High-School-library-scaled-52e9c24a-0914-4e65-900c-c0f4451cdeab.png");
  const aerial = path.join(
    ASSETS,
    "2021-College-Perspective-Retrofitting-1280x772jpg-ab3a0686-9acd-40e2-8227-d6c2e8d74d82.png"
  );

  for (const [label, p] of [
    ["002 campus", campus002],
    ["students", students],
    ["library", library],
    ["aerial", aerial],
  ] as const) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${label}: ${p}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  await optimizeToWebp(campus002, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(campus002, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);
  await optimizeToWebp(students, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);
  await optimizeToWebp(library, path.join(OUT_DIR, "photo2.webp"), PHOTO_WIDTH);
  await optimizeToWebp(aerial, path.join(OUT_DIR, "photo3.webp"), PHOTO_WIDTH);

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp, card.webp (002 main campus), photo1–3.webp");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
