/**
 * One-off: replace Cita Buana School (Jakarta) main photo (card + profile) with new asset.
 * Run: npx tsx scripts/replace-cita-buana-campus.ts
 */

import path from "path";
import sharp from "sharp";

const ASSETS =
  process.env.ASSETS ??
  "/Users/darren/.cursor/projects/Users-darren-international-schools-guide/assets";
const SLUG = "cita-buana-school";
const OUT_DIR = path.join(process.cwd(), "public/images/schools", SLUG);
const SOURCE = "20102409-1-fc19f044-c407-422a-adbc-5a926f3f35b7.png";
const PROFILE_WIDTH = 1600;
const WEBP_QUALITY = 78;

async function main() {
  const srcPath = path.join(ASSETS, SOURCE);
  const campusPath = path.join(OUT_DIR, "campus.webp");

  await sharp(srcPath)
    .rotate()
    .resize({ width: PROFILE_WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(campusPath);

  console.log("Replaced", campusPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
