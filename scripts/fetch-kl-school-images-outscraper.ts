/**
 * Fetch up to 8 Google Maps photos per Kuala Lumpur school via Outscraper API.
 *
 * Uses the Outscraper Node SDK to query Google Maps Photos for each school,
 * downloads the images, optimises with sharp, and updates school-images.json.
 *
 * Requires OUTSCRAPER_API_KEY in .env.local
 *
 * Usage:
 *   npx tsx scripts/fetch-kl-school-images-outscraper.ts
 *   npx tsx scripts/fetch-kl-school-images-outscraper.ts --dry-run
 *   npx tsx scripts/fetch-kl-school-images-outscraper.ts --limit 5
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { config } from "dotenv";
import Outscraper from "outscraper";
import { KUALA_LUMPUR_SCHOOLS } from "../src/data/kuala-lumpur-schools";

config({ path: path.join(process.cwd(), ".env.local") });

const API_KEY = process.env.OUTSCRAPER_API_KEY;
if (!API_KEY) {
  console.error("Missing OUTSCRAPER_API_KEY in .env.local");
  process.exit(1);
}

const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const LOG_DIR = path.join(process.cwd(), "scripts", "logs");

const PHOTOS_PER_SCHOOL = 8;
const CARD_WIDTH = 800;
const PROFILE_WIDTH = 1600;
const GALLERY_WIDTH = 1200;
const WEBP_QUALITY = 78;
const FETCH_TIMEOUT_MS = 30_000;
const DELAY_BETWEEN_SCHOOLS_MS = 2000;
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 120; // 10 minutes max per request

// ─── Types ──────────────────────────────────────────────
type ManifestEntry = Record<string, string | undefined>;
type Manifest = {
  generatedAt: string;
  sourceRoot?: string;
  slugs: Record<string, ManifestEntry>;
  unmappedSourceFolders?: string[];
  missingImageFolders?: string[];
};

// ─── Logging ────────────────────────────────────────────
let logStream: fs.WriteStream | null = null;

function openLog(): void {
  if (logStream) return;
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logFile = path.join(
    LOG_DIR,
    `outscraper-kl-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.log`
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

// ─── Manifest ───────────────────────────────────────────
function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return { generatedAt: new Date().toISOString(), slugs: {} };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

function saveManifest(m: Manifest): void {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2) + "\n", "utf8");
}

// ─── Helpers ────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; InternationalSchoolsGuide/1.0; +https://international-schools-guide.com)",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function saveWebp(
  buffer: Buffer,
  outputPath: string,
  width: number
): Promise<boolean> {
  try {
    await sharp(buffer)
      .rotate()
      .resize({ width, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(outputPath);
    return fs.statSync(outputPath).size > 1000;
  } catch {
    return false;
  }
}

// ─── Outscraper API ─────────────────────────────────────
const client = new Outscraper(API_KEY);

async function fetchPhotosForSchool(
  schoolName: string
): Promise<string[]> {
  log(`  Querying Outscraper for "${schoolName}"`);

  const response = await client.getGoogleMapsPhotos([schoolName], {
    photosLimit: PHOTOS_PER_SCHOOL,
    limit: 1,
    tag: "all",
    language: "en",
    region: "MY",
    async: true,
  });

  // Async mode: response has { id, status }
  if (response?.id && response?.status !== "Success") {
    const requestId = response.id;
    log(`  Async request submitted: ${requestId}`);

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await sleep(POLL_INTERVAL_MS);
      const archive = await client.getRequestArchive(requestId);

      if (archive?.status === "Success" && archive?.data) {
        return extractPhotoUrls(archive.data);
      }
      if (archive?.status === "Error" || archive?.error) {
        log(`  API error: ${archive?.error || archive?.errorMessage || "unknown"}`);
        return [];
      }
      if (attempt % 6 === 0) {
        log(`  Still waiting... (${Math.round((attempt * POLL_INTERVAL_MS) / 1000)}s)`);
      }
    }
    log(`  Timed out waiting for results`);
    return [];
  }

  // Sync response or already-resolved async
  if (response?.data) {
    return extractPhotoUrls(response.data);
  }
  if (Array.isArray(response)) {
    return extractPhotoUrls(response);
  }

  log(`  Unexpected response shape: ${JSON.stringify(response).slice(0, 200)}`);
  return [];
}

function extractPhotoUrls(data: unknown): string[] {
  const urls: string[] = [];

  if (!Array.isArray(data)) return urls;

  for (const queryResult of data) {
    const places = Array.isArray(queryResult) ? queryResult : [queryResult];
    for (const place of places) {
      if (!place) continue;
      // photos can be an array of objects with photo_url, or photo_url_big
      const photos = place.photos ?? place.photos_data ?? [];
      if (Array.isArray(photos)) {
        for (const photo of photos) {
          const url =
            photo?.photo_url_big ??
            photo?.photo_url ??
            (typeof photo === "string" ? photo : null);
          if (url && typeof url === "string" && url.startsWith("http")) {
            urls.push(url);
          }
        }
      }
    }
  }

  return urls.slice(0, PHOTOS_PER_SCHOOL);
}

// ─── Process one school ─────────────────────────────────
async function processSchool(
  slug: string,
  name: string,
  dryRun: boolean
): Promise<ManifestEntry | null> {
  const photoUrls = await fetchPhotosForSchool(name);

  if (photoUrls.length === 0) {
    log(`  No photos found`);
    return null;
  }

  log(`  Found ${photoUrls.length} photos`);

  if (dryRun) {
    for (const [i, url] of photoUrls.entries()) {
      log(`    [${i + 1}] ${url.slice(0, 100)}...`);
    }
    return { card: "dry-run", profile: "dry-run" };
  }

  const dir = path.join(OUTPUT_ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });

  const entry: ManifestEntry = {};
  let savedCount = 0;

  for (let i = 0; i < photoUrls.length; i++) {
    const url = photoUrls[i];
    log(`  Downloading photo ${i + 1}/${photoUrls.length}`);
    const buffer = await downloadImage(url);
    if (!buffer || buffer.length < 500) {
      log(`    Skip: too small or failed`);
      continue;
    }

    if (i === 0) {
      // First photo: profile (1600px) + card (800px)
      const profilePath = path.join(dir, "profile.webp");
      const cardPath = path.join(dir, "card.webp");
      const profileOk = await saveWebp(buffer, profilePath, PROFILE_WIDTH);
      const cardOk = await saveWebp(buffer, cardPath, CARD_WIDTH);
      if (profileOk && cardOk) {
        entry.profile = `/images/schools/${slug}/profile.webp`;
        entry.card = `/images/schools/${slug}/card.webp`;
        savedCount++;
      }
    } else {
      // Photos 2-8: gallery as photo1-photo7 (1200px)
      const photoKey = `photo${i}`;
      const photoPath = path.join(dir, `${photoKey}.webp`);
      const ok = await saveWebp(buffer, photoPath, GALLERY_WIDTH);
      if (ok) {
        entry[photoKey] = `/images/schools/${slug}/${photoKey}.webp`;
        savedCount++;
      }
    }
  }

  if (!entry.card && !entry.profile) {
    log(`  No usable photos saved, cleaning up`);
    fs.rmSync(dir, { recursive: true, force: true });
    return null;
  }

  entry.sourceFolder = "outscraper-google-maps";
  log(`  Saved ${savedCount} images`);
  return entry;
}

// ─── Main ───────────────────────────────────────────────
async function run(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.indexOf("--limit");
  const maxSchools = limitArg >= 0 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;

  log("=== Fetch KL school images from Google Maps via Outscraper ===");
  log(`Dry run: ${dryRun}`);
  if (maxSchools < Infinity) log(`Limit: ${maxSchools} schools`);

  const manifest = loadManifest();
  const existingSlugs = new Set(Object.keys(manifest.slugs ?? {}));

  const schools = KUALA_LUMPUR_SCHOOLS.filter((s) => !existingSlugs.has(s.slug));
  const toProcess = schools.slice(0, maxSchools);

  log(`KL schools total: ${KUALA_LUMPUR_SCHOOLS.length}`);
  log(`Already have images: ${KUALA_LUMPUR_SCHOOLS.length - schools.length}`);
  log(`To process: ${toProcess.length}`);

  let processed = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const { slug, name } = toProcess[i];

    if (existingSlugs.has(slug)) continue;

    log(`\n[${i + 1}/${toProcess.length}] ${name} (${slug})`);

    try {
      const entry = await processSchool(slug, name, dryRun);
      if (entry) {
        manifest.slugs[slug] = entry;
        existingSlugs.add(slug);
        if (!dryRun) {
          manifest.generatedAt = new Date().toISOString();
          saveManifest(manifest);
        }
        processed++;
      } else {
        failed++;
      }
    } catch (err) {
      log(`  ERROR: ${err}`);
      failed++;
    }

    if (i < toProcess.length - 1) {
      await sleep(DELAY_BETWEEN_SCHOOLS_MS);
    }
  }

  manifest.generatedAt = new Date().toISOString();
  if (!dryRun) saveManifest(manifest);

  log("\n=== Summary ===");
  log(`Processed: ${processed}`);
  log(`Failed/skipped: ${failed}`);
  log(`Total in manifest: ${Object.keys(manifest.slugs).length}`);
  closeLog();
}

run().catch((err) => {
  console.error(err);
  log(String(err));
  closeLog();
  process.exitCode = 1;
});
