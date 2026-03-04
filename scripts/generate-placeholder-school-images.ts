/**
 * Generate placeholder campus images for schools that still have no image.
 *
 * Uses one image per city: public/images/cities/<citySlug>.webp. For each school
 * missing from school-images.json, copies that city's image (or a fallback),
 * resizes to card (800px) and profile (1200px), writes webp and appends to manifest.
 *
 * Resumable. Run after fetch-school-images-from-websites.ts or standalone:
 *
 *   npx tsx scripts/generate-placeholder-school-images.ts
 *
 * Resumable: skips schools already in manifest; writes manifest after each school.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { SCHOOL_PROFILES, ALL_SCHOOL_SLUGS } from "../src/data/schools";

const CITIES_IMAGES_DIR = path.join(process.cwd(), "public", "images", "cities");
const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const LOG_DIR = path.join(process.cwd(), "scripts", "logs");

const CARD_WIDTH = 800;
const PROFILE_WIDTH = 1200;
const WEBP_QUALITY = 78;
const MIN_FILE_SIZE_BYTES = 200 * 1024; // 200KB minimum

type ManifestEntry = {
  card: string;
  profile: string;
  sourceFolder?: string;
  sourceFile?: string;
};
type Manifest = {
  generatedAt: string;
  sourceRoot?: string;
  slugs: Record<string, ManifestEntry>;
  unmappedSourceFolders?: string[];
  missingImageFolders?: string[];
};

// ─── Logging ─────────────────────────────────────────────
let logStream: fs.WriteStream | null = null;

function openLog(): void {
  if (logStream) return;
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logFile = path.join(
    LOG_DIR,
    `placeholder-school-images-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.log`
  );
  logStream = fs.createWriteStream(logFile, { flags: "a" });
  logStream.write(`\n--- Started ${new Date().toISOString()} ---\n`);
}

function log(msg: string): void {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(msg);
  openLog();
  logStream?.write(line + "\n");
}

function closeLog(): void {
  if (logStream) {
    logStream.write(`--- Ended ${new Date().toISOString()} ---\n`);
    logStream.end();
    logStream = null;
  }
}

// ─── Manifest ─────────────────────────────────────────────
function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      generatedAt: new Date().toISOString(),
      sourceRoot: "generate-placeholder-school-images",
      slugs: {},
      unmappedSourceFolders: [],
      missingImageFolders: [],
    };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

function saveManifest(m: Manifest): void {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2) + "\n", "utf8");
}

// ─── City image fallback ─────────────────────────────────
function getAvailableCitySlugs(): string[] {
  if (!fs.existsSync(CITIES_IMAGES_DIR)) return [];
  return fs
    .readdirSync(CITIES_IMAGES_DIR)
    .filter((f) => f.endsWith(".webp"))
    .map((f) => path.basename(f, ".webp"));
}

/** Path to city image, or null if not found. */
function getCityImagePath(citySlug: string): string | null {
  const p = path.join(CITIES_IMAGES_DIR, `${citySlug}.webp`);
  return fs.existsSync(p) ? p : null;
}

/** Path to use for a school in citySlug; falls back to first available city image. */
function getPlaceholderSourcePath(
  citySlug: string,
  availableSlugs: string[]
): string | null {
  const direct = getCityImagePath(citySlug);
  if (direct) return direct;
  const fallback = availableSlugs[0];
  return fallback ? getCityImagePath(fallback) : null;
}

/** Encode source image to webp at outputPath; re-encode at higher quality until size >= 200KB. Returns true if ok. */
async function ensureWebpMinSize(
  sourcePath: string,
  outputPath: string,
  width: number
): Promise<boolean> {
  for (const q of [WEBP_QUALITY, 90, 95]) {
    await sharp(sourcePath)
      .resize({ width, fit: "inside", withoutEnlargement: true })
      .webp({ quality: q, effort: 5 })
      .toFile(outputPath);
    if (fs.statSync(outputPath).size >= MIN_FILE_SIZE_BYTES) return true;
  }
  return false;
}

// ─── Process one school ──────────────────────────────────
async function processSchool(
  slug: string,
  citySlug: string,
  sourcePath: string,
  dryRun: boolean
): Promise<ManifestEntry | null> {
  try {
    const dir = path.join(OUTPUT_ROOT, slug);
    const cardPath = path.join(dir, "card.webp");
    const profilePath = path.join(dir, "profile.webp");

    if (!dryRun) {
      fs.mkdirSync(dir, { recursive: true });
      const cardOk = await ensureWebpMinSize(sourcePath, cardPath, CARD_WIDTH);
      const profileOk = await ensureWebpMinSize(sourcePath, profilePath, PROFILE_WIDTH);
      if (!cardOk || !profileOk) {
        log(`  Image(s) under 200KB, skipping`);
        fs.rmSync(dir, { recursive: true });
        return null;
      }
    }

    return {
      card: `/images/schools/${slug}/card.webp`,
      profile: `/images/schools/${slug}/profile.webp`,
      sourceFolder: "placeholder",
      sourceFile: `cities/${citySlug}.webp`,
    };
  } catch (err) {
    log(`  ERROR: ${err}`);
    return null;
  }
}

// ─── Main ────────────────────────────────────────────────
async function run(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  log("Generate placeholder school images (per-city)");
  log(`Dry run: ${dryRun}`);

  const availableSlugs = getAvailableCitySlugs();
  if (availableSlugs.length === 0) {
    log("No city images found in public/images/cities/");
    closeLog();
    return;
  }
  log(`City images available: ${availableSlugs.join(", ")}`);

  const manifest = loadManifest();
  const existingSlugs = new Set(Object.keys(manifest.slugs ?? {}));
  const missingSlugs = ALL_SCHOOL_SLUGS.filter((slug) => !existingSlugs.has(slug));
  log(`Schools already with images: ${existingSlugs.size}`);
  log(`Schools missing images: ${missingSlugs.length}`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of missingSlugs) {
    const profile = SCHOOL_PROFILES[slug];
    const citySlug = profile?.citySlug ?? "jakarta";
    const sourcePath = getPlaceholderSourcePath(citySlug, availableSlugs);
    if (!sourcePath) {
      log(`Skip ${slug}: no city image for ${citySlug}`);
      skipped++;
      continue;
    }
    log(`Processing ${slug} (${citySlug})...`);
    const entry = await processSchool(slug, citySlug, sourcePath, dryRun);
    if (entry) {
      manifest.slugs = manifest.slugs ?? {};
      manifest.slugs[slug] = entry;
      if (!dryRun) saveManifest(manifest);
      processed++;
      log(`  Done`);
    } else {
      failed++;
    }
  }

  manifest.generatedAt = new Date().toISOString();
  if (!dryRun) saveManifest(manifest);

  log("--- Summary ---");
  log(`Processed: ${processed}, Skipped: ${skipped}, Failed: ${failed}`);
  closeLog();
}

run().catch((err) => {
  console.error(err);
  log(String(err));
  closeLog();
  process.exitCode = 1;
});
