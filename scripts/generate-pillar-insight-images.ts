/**
 * Generate hero and card images for pillar insight articles (Best International Schools in [City]).
 *
 * Uses the city card image from public/images/cities/<citySlug>.webp (from Pexels via
 * fetch-city-images-pexels.ts), applies a vibrant watercolour-style treatment, and saves
 * to public/images/insights/best-international-schools-<citySlug>-{hero,card}.webp.
 *
 * Run after adding a new live city (and its city image):
 *   npx tsx scripts/generate-pillar-insight-images.ts
 *   npx tsx scripts/generate-pillar-insight-images.ts --force
 *
 * Pillar slugs are fixed: best-international-schools-<citySlug> for each city below.
 * When you add a new city to LIVE_CITIES and add its image to public/images/cities/,
 * add the city slug to PILLAR_CITY_SLUGS and run this script.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CITIES_DIR = path.join(process.cwd(), "public", "images", "cities");
const INSIGHTS_DIR = path.join(process.cwd(), "public", "images", "insights");
const HERO_WIDTH = 1600;
const CARD_WIDTH = 800;
const WEBP_QUALITY = 82;

/** City slugs that have pillar articles: best-international-schools-<slug>. Keep in sync with LIVE_CITIES. */
const PILLAR_CITY_SLUGS = [
  "singapore",
  "hong-kong",
  "dubai",
  "kuala-lumpur",
  "jakarta",
  "bangkok",
];

const force = process.argv.includes("--force");

/**
 * Vibrant watercolour-style treatment: soft edges (light blur), boosted saturation,
 * slight gamma for a painted pop. Applied after resize.
 */
async function watercolourPipeline(
  inputPath: string,
  outputPath: string,
  width: number
): Promise<void> {
  await sharp(inputPath)
    .resize({ width, fit: "inside", withoutEnlargement: true })
    .blur(0.6)
    .modulate({ saturation: 1.35 })
    .gamma(1.08)
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(outputPath);
}

async function processPillar(citySlug: string): Promise<boolean> {
  const pillarSlug = `best-international-schools-${citySlug}`;
  const sourcePath = path.join(CITIES_DIR, `${citySlug}.webp`);
  const heroPath = path.join(INSIGHTS_DIR, `${pillarSlug}-hero.webp`);
  const cardPath = path.join(INSIGHTS_DIR, `${pillarSlug}-card.webp`);

  if (!fs.existsSync(sourcePath)) {
    console.error(`[${pillarSlug}] Missing city image: ${sourcePath}`);
    console.error("  Run fetch-city-images-pexels.ts for this city first, or add the image manually.");
    return false;
  }

  const skipHero = !force && fs.existsSync(heroPath);
  const skipCard = !force && fs.existsSync(cardPath);
  if (skipHero && skipCard) {
    console.log(`[skip] ${pillarSlug} (hero + card exist; use --force to replace)`);
    return true;
  }

  try {
    if (!skipHero) {
      await watercolourPipeline(sourcePath, heroPath, HERO_WIDTH);
      console.log(`[${pillarSlug}] Saved hero ${heroPath}`);
    }
    if (!skipCard) {
      await watercolourPipeline(sourcePath, cardPath, CARD_WIDTH);
      console.log(`[${pillarSlug}] Saved card ${cardPath}`);
    }
    return true;
  } catch (err) {
    console.error(`[${pillarSlug}] ERROR:`, err);
    return false;
  }
}

async function run(): Promise<void> {
  console.log("Generate pillar insight images (watercolour from city images)");
  fs.mkdirSync(INSIGHTS_DIR, { recursive: true });

  let ok = 0;
  let fail = 0;
  for (const citySlug of PILLAR_CITY_SLUGS) {
    const success = await processPillar(citySlug);
    if (success) ok++;
    else fail++;
  }

  console.log(`Done: ${ok} ok, ${fail} failed`);
  if (fail > 0) {
    console.log("Ensure city images exist in public/images/cities/<slug>.webp (run fetch-city-images-pexels.ts if needed).");
  }
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
