/**
 * One-off: add Dulwich College Bangkok and King's College Bangkok campus images.
 * Run: npx tsx scripts/add-dulwich-kings-bangkok-images.ts
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

const SCHOOLS = [
  {
    slug: "dulwich-college-international-school",
    file: "campus_dulwich_college_bangkok-2e73275d-af37-41ab-a6b2-fc78879d3629.png",
    label: "Dulwich College Bangkok",
  },
  {
    slug: "king-s-college-international-school",
    file: "campus_kings_college_bangkok-d7a4ebc8-b5ff-4d15-b838-9f5c07d65c5f.png",
    label: "King's College Bangkok",
  },
] as const;

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
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

  for (const { slug, file, label } of SCHOOLS) {
    const srcPath = path.join(ASSETS, file);
    if (!fs.existsSync(srcPath)) {
      console.error(`Missing ${label}: ${srcPath}`);
      process.exit(1);
    }

    const outDir = path.join(__dirname, "../public/images/schools", slug);
    fs.mkdirSync(outDir, { recursive: true });

    await optimizeToWebp(srcPath, path.join(outDir, "profile.webp"), PROFILE_WIDTH);
    await optimizeToWebp(srcPath, path.join(outDir, "card.webp"), CARD_WIDTH);

    manifest.slugs[slug] = {
      profile: `/images/schools/${slug}/profile.webp`,
      card: `/images/schools/${slug}/card.webp`,
      sourceFolder: "assets",
      sourceFile: label,
    };
    console.log("Added", slug, "-", label);
  }

  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Updated school-images.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
