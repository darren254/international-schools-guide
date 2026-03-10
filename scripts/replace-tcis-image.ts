/**
 * One-off: replace Thai Chinese International School card and profile image with a new source image.
 * Run: npx tsx scripts/replace-tcis-image.ts
 */
import path from "path";
import sharp from "sharp";

const SLUG = "thai-chinese-international-school";
const SOURCE =
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets/2025-08-04_copy-7e9c2e18-ee23-437f-81d2-5cef85fb72e1.png";
const OUT_DIR = path.join(process.cwd(), "public/images/schools", SLUG);
const PROFILE_WIDTH = 1600;
const CARD_WIDTH = 800;
const WEBP_QUALITY = 78;

async function main() {
  const fs = await import("fs");
  if (!fs.existsSync(SOURCE)) {
    console.error("Source image not found:", SOURCE);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await sharp(SOURCE)
    .rotate()
    .resize({ width: PROFILE_WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(path.join(OUT_DIR, "profile.webp"));
  await sharp(SOURCE)
    .rotate()
    .resize({ width: CARD_WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(path.join(OUT_DIR, "card.webp"));
  console.log("Replaced profile.webp and card.webp for", SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
