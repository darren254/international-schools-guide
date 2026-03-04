/**
 * Fetch one campus image per school from school websites (og:image).
 *
 * Only processes schools that do NOT already have an entry in school-images.json.
 * For each missing school with contact.website, fetches the homepage, extracts
 * og:image, downloads the image, resizes to card (800px) and profile (1200px),
 * writes webp and appends to the manifest.
 *
 * Rate-limited and resumable. Run in Terminal (e.g. overnight):
 *
 *   npx tsx scripts/fetch-school-images-from-websites.ts
 *
 * Or: npx tsx scripts/fetch-school-images-from-websites.ts 2>&1 | tee scripts/logs/fetch-$(date +%Y%m%d-%H%M).log
 *
 * Resumable: skips schools already in manifest; writes manifest after each school.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { SCHOOL_PROFILES, ALL_SCHOOL_SLUGS } from "../src/data/schools";

const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const LOG_DIR = path.join(process.cwd(), "scripts", "logs");

const CARD_WIDTH = 800;
const PROFILE_WIDTH = 1200;
const WEBP_QUALITY = 78;
const MIN_FILE_SIZE_BYTES = 200 * 1024; // 200KB minimum
const FETCH_TIMEOUT_MS = 15_000;
const DELAY_BETWEEN_SCHOOLS_MS = 3000;
const DELAY_PER_HOST_MS = 2000;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 2000;

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
    `fetch-school-images-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.log`
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
      sourceRoot: "fetch-school-images-from-websites",
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

// ─── URL / HTML ───────────────────────────────────────────
function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return href;
  }
}

/** Extract og:image content from HTML. */
function extractOgImage(html: string): string | null {
  // property="og:image" content="..."
  const withPropertyFirst = html.match(
    /<meta[^>]*\sproperty=["']og:image["'][^>]*\scontent=["']([^"']+)["']/i
  );
  if (withPropertyFirst) return withPropertyFirst[1].trim();
  // content="..." property="og:image"
  const withContentFirst = html.match(
    /<meta[^>]*\scontent=["']([^"']+)["'][^>]*\sproperty=["']og:image["']/i
  );
  if (withContentFirst) return withContentFirst[1].trim();
  return null;
}

// ─── Fetch with retries ──────────────────────────────────
async function fetchWithRetries(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = FETCH_TIMEOUT_MS, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        ...rest,
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; InternationalSchoolsGuide/1.0; +https://international-schools-guide.com)",
          ...(rest.headers as Record<string, string>),
        },
      });
      clearTimeout(id);
      return res;
    } catch (err) {
      lastError = err;
      clearTimeout(id);
      if (attempt < MAX_RETRIES - 1) {
        const backoff = RETRY_BASE_MS * Math.pow(2, attempt);
        log(`  Retry in ${backoff}ms: ${err}`);
        await sleep(backoff);
      }
    }
  }
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Track last fetch time per host for rate limiting
const lastFetchByHost = new Map<string, number>();

async function rateLimitedFetch(url: string): Promise<Response> {
  const u = new URL(url);
  const host = u.origin;
  const now = Date.now();
  const last = lastFetchByHost.get(host) ?? 0;
  const elapsed = now - last;
  if (elapsed < DELAY_PER_HOST_MS) {
    await sleep(DELAY_PER_HOST_MS - elapsed);
  }
  lastFetchByHost.set(host, Date.now());
  return fetchWithRetries(url);
}

/** Encode image to webp at outputPath; re-encode at higher quality until size >= MIN_FILE_SIZE_BYTES. Returns true if ok. */
async function ensureWebpMinSize(
  buffer: Buffer,
  outputPath: string,
  width: number
): Promise<boolean> {
  for (const q of [WEBP_QUALITY, 90, 95]) {
    await sharp(buffer)
      .rotate()
      .resize({ width, fit: "inside", withoutEnlargement: true })
      .webp({ quality: q, effort: 5 })
      .toFile(outputPath);
    if (fs.statSync(outputPath).size >= MIN_FILE_SIZE_BYTES) return true;
  }
  return false;
}

// ─── Process one school ──────────────────────────────────
async function processSchool(slug: string, website: string, dryRun: boolean): Promise<ManifestEntry | null> {
  try {
    log(`  Fetching ${website}`);
    const htmlRes = await rateLimitedFetch(website);
    if (!htmlRes.ok) {
      log(`  HTTP ${htmlRes.status}`);
      return null;
    }
    const html = await htmlRes.text();
    const ogImageHref = extractOgImage(html);
    if (!ogImageHref) {
      log(`  No og:image found`);
      return null;
    }
    const imageUrl = resolveUrl(ogImageHref, website);
    if (!isValidUrl(imageUrl)) {
      log(`  Invalid image URL: ${imageUrl}`);
      return null;
    }

    log(`  Downloading image`);
    const imageRes = await rateLimitedFetch(imageUrl);
    if (!imageRes.ok) {
      log(`  Image HTTP ${imageRes.status}`);
      return null;
    }
    const contentType = imageRes.headers.get("content-type") ?? "";
    if (!/^image\//i.test(contentType)) {
      log(`  Not an image: ${contentType}`);
      return null;
    }
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    if (buffer.length < 500) {
      log(`  Image too small (${buffer.length} bytes)`);
      return null;
    }

    const dir = path.join(OUTPUT_ROOT, slug);
    const cardPath = path.join(dir, "card.webp");
    const profilePath = path.join(dir, "profile.webp");

    if (!dryRun) {
      fs.mkdirSync(dir, { recursive: true });
      const cardOk = await ensureWebpMinSize(buffer, cardPath, CARD_WIDTH);
      const profileOk = await ensureWebpMinSize(buffer, profilePath, PROFILE_WIDTH);
      if (!cardOk || !profileOk) {
        log(`  Image(s) under 200KB, skipping`);
        fs.rmSync(dir, { recursive: true });
        return null;
      }
    }

    return {
      card: `/images/schools/${slug}/card.webp`,
      profile: `/images/schools/${slug}/profile.webp`,
      sourceFolder: "website",
      sourceFile: new URL(imageUrl).pathname.split("/").pop() ?? "og:image",
    };
  } catch (err) {
    log(`  ERROR: ${err}`);
    return null;
  }
}

// ─── Main ────────────────────────────────────────────────
async function run(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  log("Fetch school images from websites (og:image)");
  log(`Dry run: ${dryRun}`);

  const manifest = loadManifest();
  const existingSlugs = new Set(Object.keys(manifest.slugs ?? {}));
  const missingSlugs = ALL_SCHOOL_SLUGS.filter((slug) => !existingSlugs.has(slug));
  log(`Schools already with images: ${existingSlugs.size}`);
  log(`Schools missing images: ${missingSlugs.length}`);

  const withWebsite: { slug: string; website: string }[] = [];
  for (const slug of missingSlugs) {
    const profile = SCHOOL_PROFILES[slug];
    if (!profile?.contact?.website) continue;
    const w = profile.contact.website.trim();
    if (w && isValidUrl(w)) withWebsite.push({ slug, website: w });
  }
  log(`Missing schools with valid website: ${withWebsite.length}`);

  let processed = 0;
  let failed = 0;

  for (let i = 0; i < withWebsite.length; i++) {
    const { slug, website } = withWebsite[i];
    if (existingSlugs.has(slug)) continue;
    log(`[${i + 1}/${withWebsite.length}] ${slug}`);
    const entry = await processSchool(slug, website, dryRun);
    if (entry) {
      manifest.slugs = manifest.slugs ?? {};
      manifest.slugs[slug] = entry;
      existingSlugs.add(slug);
      if (!dryRun) saveManifest(manifest);
      processed++;
      log(`  Done`);
    } else {
      failed++;
    }
    if (i < withWebsite.length - 1) {
      await sleep(DELAY_BETWEEN_SCHOOLS_MS);
    }
  }

  manifest.generatedAt = new Date().toISOString();
  if (!dryRun) saveManifest(manifest);

  log("--- Summary ---");
  log(`Processed: ${processed}, Failed: ${failed}`);
  closeLog();
}

run().catch((err) => {
  console.error(err);
  log(String(err));
  closeLog();
  process.exitCode = 1;
});
