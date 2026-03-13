/**
 * Scrape additional campus images from KL school websites.
 *
 * For each KL school, fetches the homepage + up to 3 internal pages
 * (gallery, campus, facilities, about, tour, photos), extracts <img> URLs,
 * filters out junk (logos, icons, tiny images), downloads the best candidates,
 * and saves them as additional gallery photos (photo4, photo5, etc.).
 *
 * Usage:
 *   npx tsx scripts/fetch-kl-school-website-images.ts
 *   npx tsx scripts/fetch-kl-school-website-images.ts --dry-run
 *   npx tsx scripts/fetch-kl-school-website-images.ts --limit 3
 *   npx tsx scripts/fetch-kl-school-website-images.ts --force
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import * as cheerio from "cheerio";
import { KUALA_LUMPUR_SCHOOLS } from "../src/data/kuala-lumpur-schools";

const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const LOG_DIR = path.join(process.cwd(), "scripts", "logs");

const GALLERY_WIDTH = 1200;
const WEBP_QUALITY = 78;
const MIN_NATURAL_WIDTH = 400;
const MIN_NATURAL_HEIGHT = 300;
const MIN_DOWNLOAD_BYTES = 5_000;
const MAX_NEW_IMAGES_PER_SCHOOL = 6;
const MAX_TOTAL_PHOTOS = 12;
const MAX_SUBPAGES = 3;
const FETCH_TIMEOUT_MS = 15_000;
const DELAY_BETWEEN_SCHOOLS_MS = 3000;
const DELAY_BETWEEN_REQUESTS_MS = 2000;

const SUBPAGE_KEYWORDS = [
  "gallery", "galleries", "campus", "facilities", "facility",
  "about", "tour", "photos", "photo", "virtual-tour",
  "our-school", "our-campus", "school-life", "life-at",
];

const JUNK_FILENAME_PATTERNS = [
  /logo/i, /icon/i, /favicon/i, /sprite/i, /avatar/i,
  /badge/i, /banner-ad/i, /placeholder/i, /loading/i,
  /spinner/i, /arrow/i, /chevron/i, /caret/i,
  /button/i, /btn/i, /social/i, /facebook/i, /twitter/i,
  /instagram/i, /linkedin/i, /youtube/i, /tiktok/i,
  /whatsapp/i, /wechat/i, /pinterest/i,
  /flag/i, /emoji/i, /pixel/i, /tracking/i, /analytics/i,
  /widget/i, /ad-/i, /advert/i, /sponsor/i,
  /gravatar/i, /wp-emoji/i, /smilies/i,
];

const JUNK_DOMAIN_PATTERNS = [
  /facebook\.com/i, /fbcdn\.net/i, /twitter\.com/i,
  /instagram\.com/i, /youtube\.com/i, /google-analytics/i,
  /doubleclick/i, /googleadservices/i, /googleapis\.com\/maps/i,
  /wp\.com\/latex/i, /gravatar\.com/i,
];

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
    `website-images-kl-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.log`
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

function getNextPhotoIndex(entry: ManifestEntry): number {
  let max = 0;
  for (const key of Object.keys(entry)) {
    const match = key.match(/^photo(\d+)$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return max + 1;
}

function countPhotos(entry: ManifestEntry): number {
  let count = 0;
  for (const key of Object.keys(entry)) {
    if (/^photo\d+$/.test(key)) count++;
  }
  if (entry.profile) count++;
  if (entry.card) count++;
  return count;
}

// ─── Fetch helpers ──────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_DOWNLOAD_BYTES) return null;
    return buf;
  } catch {
    return null;
  }
}

// ─── Image URL extraction ───────────────────────────────
function isJunkUrl(url: string): boolean {
  for (const p of JUNK_DOMAIN_PATTERNS) {
    if (p.test(url)) return true;
  }
  const filename = url.split("/").pop()?.split("?")[0] ?? "";
  for (const p of JUNK_FILENAME_PATTERNS) {
    if (p.test(filename)) return true;
  }
  if (/\.svg(\?|$)/i.test(url)) return true;
  if (url.startsWith("data:")) return true;
  return false;
}

function extractImageUrls(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const urls = new Set<string>();

  $("img").each((_, el) => {
    const src = $(el).attr("src");
    const srcset = $(el).attr("srcset");
    const dataSrc = $(el).attr("data-src") || $(el).attr("data-lazy-src") || $(el).attr("data-original");

    for (const raw of [src, dataSrc]) {
      if (!raw) continue;
      try {
        const resolved = new URL(raw, baseUrl).href;
        if (!isJunkUrl(resolved)) urls.add(resolved);
      } catch { /* skip malformed */ }
    }

    if (srcset) {
      const candidates = srcset.split(",").map((s) => s.trim().split(/\s+/)[0]);
      for (const c of candidates) {
        if (!c) continue;
        try {
          const resolved = new URL(c, baseUrl).href;
          if (!isJunkUrl(resolved)) urls.add(resolved);
        } catch { /* skip */ }
      }
    }
  });

  // Also check CSS background images in style attributes
  $("[style]").each((_, el) => {
    const style = $(el).attr("style") ?? "";
    const bgMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch?.[1]) {
      try {
        const resolved = new URL(bgMatch[1], baseUrl).href;
        if (!isJunkUrl(resolved)) urls.add(resolved);
      } catch { /* skip */ }
    }
  });

  return [...urls];
}

function findSubpageLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const links: string[] = [];
  const seen = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    try {
      const resolved = new URL(href, baseUrl);
      if (resolved.origin !== base.origin) return;

      const pathLower = resolved.pathname.toLowerCase();
      const textLower = ($(el).text() || "").toLowerCase();
      const combined = pathLower + " " + textLower;

      const isRelevant = SUBPAGE_KEYWORDS.some((kw) => combined.includes(kw));
      if (!isRelevant) return;

      const key = resolved.origin + resolved.pathname;
      if (seen.has(key)) return;
      seen.add(key);
      links.push(resolved.href);
    } catch { /* skip */ }
  });

  return links.slice(0, MAX_SUBPAGES);
}

// ─── Deduplicate by choosing largest from srcset variants ─
function deduplicateByBasename(urls: string[]): string[] {
  const groups = new Map<string, string[]>();

  for (const url of urls) {
    const pathname = new URL(url).pathname;
    // Strip common size suffixes like -300x200, _thumb, -scaled
    const base = pathname
      .replace(/-\d+x\d+/g, "")
      .replace(/_thumb/gi, "")
      .replace(/-scaled/gi, "")
      .replace(/-\d+w/gi, "")
      .split("/").pop()?.split(".")[0] ?? url;

    const existing = groups.get(base) ?? [];
    existing.push(url);
    groups.set(base, existing);
  }

  const result: string[] = [];
  for (const variants of groups.values()) {
    // Prefer URLs that look like the largest version
    variants.sort((a, b) => {
      const aSize = (a.match(/-(\d+)x(\d+)/) || []).slice(1).map(Number);
      const bSize = (b.match(/-(\d+)x(\d+)/) || []).slice(1).map(Number);
      const aArea = aSize.length === 2 ? aSize[0] * aSize[1] : Infinity;
      const bArea = bSize.length === 2 ? bSize[0] * bSize[1] : Infinity;
      return bArea - aArea;
    });
    result.push(variants[0]);
  }

  return result;
}

// ─── Validate image dimensions with sharp ───────────────
async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number } | null> {
  try {
    const meta = await sharp(buffer).metadata();
    if (meta.width && meta.height) return { width: meta.width, height: meta.height };
    return null;
  } catch {
    return null;
  }
}

async function saveWebp(buffer: Buffer, outputPath: string): Promise<boolean> {
  try {
    await sharp(buffer)
      .rotate()
      .resize({ width: GALLERY_WIDTH, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(outputPath);
    return fs.statSync(outputPath).size > 2000;
  } catch {
    return false;
  }
}

// ─── Process one school ─────────────────────────────────
async function processSchool(
  slug: string,
  name: string,
  website: string,
  existingEntry: ManifestEntry | undefined,
  dryRun: boolean
): Promise<ManifestEntry | null> {
  const allImageUrls: string[] = [];

  // Fetch homepage
  log(`  Fetching ${website}`);
  const homepageHtml = await fetchPage(website);
  if (!homepageHtml) {
    log(`  Failed to fetch homepage`);
    return null;
  }

  const homepageImages = extractImageUrls(homepageHtml, website);
  allImageUrls.push(...homepageImages);
  log(`  Homepage: ${homepageImages.length} images found`);

  // Find and fetch subpages
  const subpageLinks = findSubpageLinks(homepageHtml, website);
  if (subpageLinks.length > 0) {
    log(`  Found ${subpageLinks.length} relevant subpage(s)`);
  }

  for (const link of subpageLinks) {
    await sleep(DELAY_BETWEEN_REQUESTS_MS);
    log(`  Fetching subpage: ${link}`);
    const subHtml = await fetchPage(link);
    if (!subHtml) {
      log(`    Failed`);
      continue;
    }
    const subImages = extractImageUrls(subHtml, link);
    allImageUrls.push(...subImages);
    log(`    ${subImages.length} images found`);
  }

  // Deduplicate
  const uniqueUrls = [...new Set(allImageUrls)];
  const dedupedUrls = deduplicateByBasename(uniqueUrls);
  log(`  Total unique image URLs after dedup: ${dedupedUrls.length}`);

  if (dedupedUrls.length === 0) {
    log(`  No candidate images`);
    return null;
  }

  // Determine how many new photos we can add
  const entry: ManifestEntry = existingEntry ? { ...existingEntry } : {};
  const currentPhotoCount = countPhotos(entry);
  const slotsAvailable = Math.min(
    MAX_NEW_IMAGES_PER_SCHOOL,
    MAX_TOTAL_PHOTOS - currentPhotoCount
  );

  if (slotsAvailable <= 0) {
    log(`  Already has ${currentPhotoCount} images, skipping`);
    return null;
  }

  let nextIndex = getNextPhotoIndex(entry);
  let saved = 0;

  // Collect existing image paths to avoid duplicates by filename
  const existingPaths = new Set(
    Object.values(entry).filter((v): v is string => typeof v === "string" && v.startsWith("/images/"))
  );

  if (dryRun) {
    log(`  Would try to download up to ${slotsAvailable} images (starting at photo${nextIndex})`);
    for (const url of dedupedUrls.slice(0, 15)) {
      log(`    Candidate: ${url.slice(0, 120)}`);
    }
    return entry;
  }

  const dir = path.join(OUTPUT_ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });

  for (const url of dedupedUrls) {
    if (saved >= slotsAvailable) break;

    const buffer = await downloadImage(url);
    if (!buffer) continue;

    const dims = await getImageDimensions(buffer);
    if (!dims || dims.width < MIN_NATURAL_WIDTH || dims.height < MIN_NATURAL_HEIGHT) continue;

    // Skip very wide/narrow aspect ratios (likely banners or strips)
    const aspect = dims.width / dims.height;
    if (aspect > 4 || aspect < 0.25) continue;

    const photoKey = `photo${nextIndex}`;
    const photoPath = path.join(dir, `${photoKey}.webp`);
    const ok = await saveWebp(buffer, photoPath);
    if (!ok) continue;

    const manifestPath = `/images/schools/${slug}/${photoKey}.webp`;
    if (existingPaths.has(manifestPath)) continue;

    entry[photoKey] = manifestPath;
    existingPaths.add(manifestPath);
    saved++;
    nextIndex++;
    log(`    Saved ${photoKey} from ${url.slice(0, 80)}...`);
  }

  if (saved === 0) {
    log(`  No usable images downloaded`);
    return null;
  }

  entry.sourceWebsite = "true";
  log(`  Added ${saved} new images (now photo1–photo${nextIndex - 1})`);
  return entry;
}

// ─── Main ───────────────────────────────────────────────
async function run(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const limitArg = process.argv.indexOf("--limit");
  const maxSchools = limitArg >= 0 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;

  log("=== Fetch additional KL school images from school websites ===");
  log(`Dry run: ${dryRun} | Force: ${force} | Limit: ${maxSchools < Infinity ? maxSchools : "none"}`);

  const manifest = loadManifest();

  // Build list of KL schools with websites
  const candidates = KUALA_LUMPUR_SCHOOLS.filter((s) => {
    if (!s.website) return false;
    const entry = manifest.slugs[s.slug];
    if (!entry) return true; // no images at all yet
    if (!force && entry.sourceWebsite) return false; // already scraped from website
    if (countPhotos(entry) >= MAX_TOTAL_PHOTOS) return false; // already full
    return true;
  });

  const toProcess = candidates.slice(0, maxSchools);

  log(`KL schools total: ${KUALA_LUMPUR_SCHOOLS.length}`);
  log(`Candidates (have website, room for more photos): ${candidates.length}`);
  log(`Processing: ${toProcess.length}`);

  let processed = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const { slug, name, website } = toProcess[i];
    log(`\n[${i + 1}/${toProcess.length}] ${name} (${slug})`);

    try {
      const existingEntry = manifest.slugs[slug];
      const result = await processSchool(slug, name, website!, existingEntry, dryRun);
      if (result) {
        manifest.slugs[slug] = result;
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
