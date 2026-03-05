/**
 * One-off: convert UWCSEA Singapore East Campus PNGs to WebP.
 * 001 = main campus image (profile + card). Run: npx tsx scripts/add-uwcsea-east-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS =
  process.env.UWCSEA_ASSETS ??
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const OUT_DIR = path.join(
  __dirname,
  "../public/images/schools/united-world-college-of-south-east-asia-east-campus"
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
  // 001 = main campus image (profile + card). Then photo1–3.
  const campus001 = path.join(ASSETS, "001-d6e35e76-a930-4537-a6fe-c4800d1b8b66.png");
  const building = path.join(ASSETS, "campus-ebc0030d-75df-4278-9706-1d90c6a570e1.png");
  const courtyard = path.join(ASSETS, "maxresdefault-501ebdd6-cdb3-440e-a99c-d3e736cde767.png");
  const playground = path.join(
    ASSETS,
    "2023_08_east_ps_playground_10-1920x1280-d4224e7f-bbf4-4fa4-86f3-f67d6867f7cb.png"
  );

  for (const [label, p] of [
    ["001 campus", campus001],
    ["building", building],
    ["courtyard", courtyard],
    ["playground", playground],
  ] as const) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${label}: ${p}`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  await optimizeToWebp(campus001, path.join(OUT_DIR, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(campus001, path.join(OUT_DIR, "card.webp"), CARD_WIDTH);
  await optimizeToWebp(building, path.join(OUT_DIR, "photo1.webp"), PHOTO_WIDTH);
  await optimizeToWebp(courtyard, path.join(OUT_DIR, "photo2.webp"), PHOTO_WIDTH);
  await optimizeToWebp(playground, path.join(OUT_DIR, "photo3.webp"), PHOTO_WIDTH);

  console.log("Wrote:", OUT_DIR);
  console.log("  profile.webp, card.webp (001 main campus), photo1–3.webp");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
