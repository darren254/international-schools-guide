/**
 * One-off: add Brighton College Bangkok (Krungthep Kreetha) campus image and
 * The Westminster School Dubai students image.
 * Run: npx tsx scripts/add-brighton-bkk-westminster-images.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ASSETS =
  process.env.ASSETS ??
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const MANIFEST_PATH = path.join(__dirname, "../src/data/school-images.json");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const WEBP_QUALITY = 78;

const BRIGHTON_BKK_CAMPUS =
  "campus_brighton_bangkok_krungthep_kreetha-f7278c59-5882-4acb-964a-291cf4cfe83a.png";
const WESTMINSTER_STUDENTS =
  "1756887318-1688-x-800-px-wide-1079ee63-df33-4ba3-b6e7-2a9ddbacaa13.png";

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
  const brightonSrc = path.join(ASSETS, BRIGHTON_BKK_CAMPUS);
  const westminsterSrc = path.join(ASSETS, WESTMINSTER_STUDENTS);

  for (const [label, p] of [
    ["Brighton Bangkok campus", brightonSrc],
    ["Westminster students", westminsterSrc],
  ] as const) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${label}: ${p}`);
      process.exit(1);
    }
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

  // 1. Brighton College Bangkok (Krungthep Kreetha) - slug brighton-college
  const brightonDir = path.join(__dirname, "../public/images/schools/brighton-college");
  fs.mkdirSync(brightonDir, { recursive: true });
  await optimizeToWebp(brightonSrc, path.join(brightonDir, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(brightonSrc, path.join(brightonDir, "card.webp"), CARD_WIDTH);
  manifest.slugs["brighton-college"] = {
    ...manifest.slugs["brighton-college"],
    profile: "/images/schools/brighton-college/profile.webp",
    card: "/images/schools/brighton-college/card.webp",
    sourceFolder: "assets",
    sourceFile: "Brighton College Bangkok Krungthep Kreetha campus",
  };
  console.log("Updated brighton-college (profile + card from Bangkok KK campus)");

  // 2. The Westminster School Dubai
  const westminsterSlug = "the-westminster-school";
  const westminsterDir = path.join(__dirname, "../public/images/schools", westminsterSlug);
  fs.mkdirSync(westminsterDir, { recursive: true });
  await optimizeToWebp(westminsterSrc, path.join(westminsterDir, "profile.webp"), PROFILE_WIDTH);
  await optimizeToWebp(westminsterSrc, path.join(westminsterDir, "card.webp"), CARD_WIDTH);
  manifest.slugs[westminsterSlug] = {
    profile: `/images/schools/${westminsterSlug}/profile.webp`,
    card: `/images/schools/${westminsterSlug}/card.webp`,
    sourceFolder: "assets",
    sourceFile: "Westminster School Dubai students",
  };
  console.log("Added the-westminster-school (profile + card)");

  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Updated school-images.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
