/**
 * Import school images from /Users/darren/Desktop/images subfolders.
 * Each subfolder name maps to one or more Singapore school slugs.
 * Converts to webp (profile 1600px, card 800px, photos 1600px) and updates school-images.json.
 *
 * Run: npx tsx scripts/import-singapore-school-images-from-desktop.ts
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const SOURCE_BASE = "/Users/darren/Desktop/images";
const OUT_BASE = path.join(__dirname, "../public/images/schools");
const MANIFEST_PATH = path.join(__dirname, "../src/data/school-images.json");
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const PHOTO_WIDTH = 1600;
const WEBP_QUALITY = 78;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

/** Folder name (as in Desktop/images) -> one or more slugs to add images for */
const FOLDER_TO_SLUGS: Record<string, string[]> = {
  "stalford academy singapore": ["stalford-academy"],
  "san yu adventist": ["san-yu-adventist-school"],
  "melbourne international school singapore": ["melbourne-international-school"],
  "etonhouse international school singapore": [
    "etonhouse-international-school-broadrick",
    "etonhouse-international-school-orchard",
  ],
  "RD american international school singapore": ["rd-american-school"],
  "guild international school ": ["the-guild-international-college"],
  "kindle kids singapore": ["kindle-kids-international-school"],
  "westbourne college singapore": ["westbourne-college"],
};

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

function getImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).size - fs.statSync(a).size); // largest first
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const folders = fs.readdirSync(SOURCE_BASE, { withFileTypes: true });
  let processed = 0;

  for (const dirent of folders) {
    if (!dirent.isDirectory()) continue;
    const folderName = dirent.name;
    const slugs = FOLDER_TO_SLUGS[folderName];
    if (!slugs?.length) {
      console.warn("Skipping unknown folder:", folderName);
      continue;
    }

    const srcDir = path.join(SOURCE_BASE, folderName);
    const files = getImageFiles(srcDir);
    if (files.length === 0) {
      console.warn("No images in", folderName);
      continue;
    }

    const campusFile = files[0];
    const photoFiles = files.slice(1, 4);

    for (const slug of slugs) {
      const outDir = path.join(OUT_BASE, slug);
      fs.mkdirSync(outDir, { recursive: true });

      await optimizeToWebp(campusFile, path.join(outDir, "profile.webp"), PROFILE_WIDTH);
      await optimizeToWebp(campusFile, path.join(outDir, "card.webp"), CARD_WIDTH);

      const entry: Record<string, string> = {
        profile: `/images/schools/${slug}/profile.webp`,
        card: `/images/schools/${slug}/card.webp`,
        sourceFolder: folderName,
        sourceFile: path.basename(campusFile),
      };

      for (let i = 0; i < photoFiles.length; i++) {
        const outName = `photo${i + 1}.webp`;
        await optimizeToWebp(photoFiles[i], path.join(outDir, outName), PHOTO_WIDTH);
        entry[`photo${i + 1}`] = `/images/schools/${slug}/${outName}`;
      }

      manifest.slugs[slug] = { ...manifest.slugs[slug], ...entry };
      processed++;
      console.log(slug, ":", path.basename(campusFile), "+", photoFiles.length, "photos");
    }
  }

  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("\nUpdated", MANIFEST_PATH, "—", processed, "school(s)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
