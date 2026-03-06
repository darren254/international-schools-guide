/**
 * Fetch city card images from Pexels (by photo ID).
 * Resizes to 800px width, webp 78, saves to public/images/cities/<slug>.webp.
 * Run: npx tsx scripts/fetch-city-images-pexels.ts
 * Use --force to re-download and replace existing images.
 * Optional: PEXELS_API_KEY in .env.local to use API search; otherwise uses config below.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "cities");
const CARD_WIDTH = 800;
const WEBP_QUALITY = 78;

const force = process.argv.includes("--force");

type CityImageConfig = {
  slug: string;
  /** Pexels photo ID (from photo page URL). */
  pexelsPhotoId: string;
};

const CITIES_TO_FETCH: CityImageConfig[] = [
  { slug: "singapore", pexelsPhotoId: "3583192" },
  { slug: "london", pexelsPhotoId: "16622396" },
  { slug: "riyadh", pexelsPhotoId: "325185" },
  { slug: "doha", pexelsPhotoId: "4515573" },
  { slug: "shanghai", pexelsPhotoId: "169647" },
  { slug: "seoul", pexelsPhotoId: "237211" },
  { slug: "munich", pexelsPhotoId: "3847794" },
  { slug: "manila", pexelsPhotoId: "3773288" },
  { slug: "saigon", pexelsPhotoId: "2662116" },
  { slug: "abu-dhabi", pexelsPhotoId: "5045851" },
];

function pexelsImageUrl(photoId: string, ext = "jpeg"): string {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.${ext}?auto=compress&cs=tinysrgb&w=1200`;
}

async function fetchImage(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; InternationalSchoolsGuide/1.0; +https://international-schools-guide.com)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error("Image too small");
  return buf;
}

async function processCity(config: CityImageConfig): Promise<boolean> {
  const { slug, pexelsPhotoId } = config;
  const outPath = path.join(OUTPUT_DIR, `${slug}.webp`);

  if (!force && fs.existsSync(outPath)) {
    console.log(`[skip] ${slug} (already exists; use --force to replace)`);
    return true;
  }

  try {
    console.log(`[${slug}] Fetching Pexels photo ${pexelsPhotoId}`);
    let buffer: Buffer;
    try {
      buffer = await fetchImage(pexelsImageUrl(pexelsPhotoId));
    } catch {
      buffer = await fetchImage(pexelsImageUrl(pexelsPhotoId, "jpg"));
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await sharp(buffer)
      .rotate()
      .resize({ width: CARD_WIDTH, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(outPath);
    console.log(`[${slug}] Saved ${outPath}`);
    return true;
  } catch (err) {
    console.error(`[${slug}] ERROR:`, err);
    return false;
  }
}

async function run(): Promise<void> {
  console.log("Fetch city images from Pexels (800px webp)");
  let ok = 0;
  let fail = 0;
  for (const config of CITIES_TO_FETCH) {
    const success = await processCity(config);
    if (success) ok++;
    else fail++;
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`Done: ${ok} ok, ${fail} failed`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
