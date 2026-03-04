/**
 * Import school images from "The Guide" folder into the site.
 *
 * Sources:
 * 1. Images March 1/school_images/{Jakarta|Singapore|Dubai|Bangkok}/
 *    Files: {City}_{School_Name}_campus{N}.jpg
 * 2. Jakarta Images etc/.../images/jakarta/{slug_folder}/
 *    Folder names = slug with underscores; images inside.
 *
 * Only processes schools that do NOT already have an image in school-images.json.
 * Writes card (800px), profile (1200px), and photo1–3 from campus1–3 as webp.
 *
 * Run once and leave it (e.g. overnight). To avoid any timeout, run in Terminal.app
 * (or iTerm) rather than inside Cursor, so the process is not tied to the editor:
 *
 *   npx tsx scripts/import-school-images-from-guide.ts
 *
 * Or with a timestamped log file:
 *
 *   ./scripts/run-import-school-images.sh
 *
 * Or: npx tsx scripts/import-school-images-from-guide.ts 2>&1 | tee scripts/logs/import-$(date +%Y%m%d-%H%M).log
 *
 * Resumable: skips schools that already have card/profile; writes manifest after each school.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const GUIDE_ROOT = "/Users/darren/Desktop/The Guide/Images";
const MARCH1_ROOT = path.join(GUIDE_ROOT, "Images March 1", "school_images");
const JAKARTA_SCRAPE_ROOT = path.join(
  GUIDE_ROOT,
  "Jakarta Images etc",
  "Jakarta Scrape Images",
  "Google Image Scrape",
  "school_automation",
  "the-guide",
  "images",
  "jakarta"
);
const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const LOG_DIR = path.join(process.cwd(), "scripts", "logs");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const CARD_WIDTH = 800;
const PROFILE_WIDTH = 1200;
const PHOTO_WIDTH = 1200;
const WEBP_QUALITY = 78;

type SchoolRecord = { citySlug: string; slug: string; name: string };
type SourceImages = {
  card: string;
  profile: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
};

type ManifestEntry = {
  card: string;
  profile: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
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
    `import-school-images-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.log`
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

// ─── School data (read from data files) ───────────────────
function extractSlugsFromFile(filePath: string): { slug: string; name: string }[] {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return [];
  const raw = fs.readFileSync(fullPath, "utf8");
  const out: { slug: string; name: string }[] = [];
  const slugMatches = [...raw.matchAll(/slug:\s*["']([^"']+)["']/g)];
  const nameMatches = [...raw.matchAll(/name:\s*["']([^"']+)["']/g)];
  for (let i = 0; i < slugMatches.length; i++) {
    const name = nameMatches[i]?.[1] ?? "";
    out.push({ slug: slugMatches[i][1], name: name.trim() });
  }
  return out;
}

function loadAllSchools(): SchoolRecord[] {
  const cities: { citySlug: string; file: string }[] = [
    { citySlug: "jakarta", file: "src/data/jakarta-schools.ts" },
    { citySlug: "singapore", file: "src/data/singapore-schools.ts" },
    { citySlug: "dubai", file: "src/data/dubai-schools.ts" },
    { citySlug: "bangkok", file: "src/data/bangkok-schools.ts" },
  ];
  const records: SchoolRecord[] = [];
  for (const { citySlug, file } of cities) {
    const list = extractSlugsFromFile(file);
    for (const { slug, name } of list) {
      records.push({ citySlug, slug, name });
    }
  }
  return records;
}

// ─── Slug / name matching ─────────────────────────────────
function normalizeToSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tokenize(s: string): string[] {
  return normalizeToSlug(s)
    .split("-")
    .filter(Boolean);
}

function findSlugForMarch1Name(
  citySlug: string,
  nameFromFile: string,
  schoolsByCity: Map<string, SchoolRecord[]>
): string | null {
  const list = schoolsByCity.get(citySlug);
  if (!list) return null;
  const fileSlug = normalizeToSlug(nameFromFile.replace(/_/g, " "));
  const exact = list.find((s) => s.slug === fileSlug);
  if (exact) return exact.slug;
  const nameTokens = tokenize(nameFromFile.replace(/_/g, " "));
  let best: string | null = null;
  let bestScore = 0;
  let secondBest = 0;
  for (const s of list) {
    const slugTokens = tokenize(s.slug);
    const nameMatch = tokenize(s.name);
    const overlap = nameTokens.filter((t) => slugTokens.includes(t) || nameMatch.includes(t)).length;
    if (overlap === 0) continue;
    const covFile = overlap / nameTokens.length;
    const covSlug = overlap / slugTokens.length;
    const firstBonus = nameTokens[0] === slugTokens[0] ? 0.2 : 0;
    const score = covFile * 0.6 + covSlug * 0.4 + firstBonus;
    if (score > bestScore) {
      secondBest = bestScore;
      bestScore = score;
      best = s.slug;
    } else if (score > secondBest) {
      secondBest = score;
    }
  }
  if (!best || bestScore < 0.5 || bestScore - secondBest < 0.08) return null;
  return best;
}

// ─── Discover sources ───────────────────────────────────
function parseMarch1Filename(base: string): { city: string; namePart: string; campus: number } | null {
  const match = base.match(/^(Jakarta|Singapore|Dubai|Bangkok)_(.+)_campus(\d+)$/i);
  if (!match) return null;
  return {
    city: match[1].toLowerCase().replace(/ /g, "-"),
    namePart: match[2].replace(/_/g, " "),
    campus: parseInt(match[3], 10),
  };
}

function discoverMarch1Sources(
  schoolsByCity: Map<string, SchoolRecord[]>
): Map<string, Map<number, string>> {
  const bySlug = new Map<string, Map<number, string>>();
  if (!fs.existsSync(MARCH1_ROOT)) return bySlug;
  const cities = fs.readdirSync(MARCH1_ROOT);
  for (const cityFolder of cities) {
    const cityKey = cityFolder.toLowerCase().replace(/ /g, "-");
    const dir = path.join(MARCH1_ROOT, cityFolder);
    if (!fs.statSync(dir).isDirectory()) continue;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const ext = path.extname(f).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      const parsed = parseMarch1Filename(path.basename(f, ext));
      if (!parsed) continue;
      const slug = findSlugForMarch1Name(
        cityKey,
        parsed.namePart.replace(/ /g, "_"),
        schoolsByCity
      );
      if (!slug) continue;
      if (!bySlug.has(slug)) bySlug.set(slug, new Map());
      bySlug.get(slug)!.set(parsed.campus, path.join(dir, f));
    }
  }
  return bySlug;
}

function discoverJakartaScrapeSources(): Map<string, string[]> {
  const bySlug = new Map<string, string[]>();
  if (!fs.existsSync(JAKARTA_SCRAPE_ROOT)) return bySlug;
  const folders = fs.readdirSync(JAKARTA_SCRAPE_ROOT);
  for (const folder of folders) {
    const dir = path.join(JAKARTA_SCRAPE_ROOT, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    const slug = folder.replace(/_/g, "-").toLowerCase();
    const files = fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .map((f) => path.join(dir, f));
    if (files.length) bySlug.set(slug, files);
  }
  return bySlug;
}

function mergeSources(
  march1: Map<string, Map<number, string>>,
  jakartaScrape: Map<string, string[]>
): Map<string, SourceImages | null> {
  const result = new Map<string, SourceImages | null>();

  for (const [slug, campusMap] of march1) {
    const c1 = campusMap.get(1);
    const c2 = campusMap.get(2);
    const c3 = campusMap.get(3);
    const first = c1 ?? c2 ?? c3;
    if (!first) continue;
    result.set(slug, {
      card: first,
      profile: first,
      photo1: c1,
      photo2: c2 ?? c1,
      photo3: c3 ?? c2 ?? c1,
    });
  }

  for (const [slug, files] of jakartaScrape) {
    if (result.has(slug)) continue;
    const sorted = [...files].sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
    const first = sorted[0];
    if (!first) continue;
    result.set(slug, {
      card: first,
      profile: first,
      photo1: sorted[0],
      photo2: sorted[1],
      photo3: sorted[2],
    });
  }
  return result;
}

// ─── Optimize and write ──────────────────────────────────
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

async function processSchool(
  slug: string,
  sources: SourceImages,
  dryRun: boolean
): Promise<ManifestEntry | null> {
  const dir = path.join(OUTPUT_ROOT, slug);
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });

  const cardPath = path.join(dir, "card.webp");
  const profilePath = path.join(dir, "profile.webp");
  const photo1Path = path.join(dir, "photo1.webp");
  const photo2Path = path.join(dir, "photo2.webp");
  const photo3Path = path.join(dir, "photo3.webp");

  try {
    if (!dryRun) {
      await optimizeToWebp(sources.card, cardPath, CARD_WIDTH);
      await optimizeToWebp(sources.profile, profilePath, PROFILE_WIDTH);
      if (sources.photo1) await optimizeToWebp(sources.photo1, photo1Path, PHOTO_WIDTH);
      if (sources.photo2) await optimizeToWebp(sources.photo2, photo2Path, PHOTO_WIDTH);
      if (sources.photo3) await optimizeToWebp(sources.photo3, photo3Path, PHOTO_WIDTH);
    }
  } catch (err) {
    log(`  ERROR processing ${slug}: ${err}`);
    return null;
  }

  const entry: ManifestEntry = {
    card: `/images/schools/${slug}/card.webp`,
    profile: `/images/schools/${slug}/profile.webp`,
    sourceFolder: "The Guide/Images",
    sourceFile: path.basename(sources.card),
  };
  if (sources.photo1) entry.photo1 = `/images/schools/${slug}/photo1.webp`;
  if (sources.photo2) entry.photo2 = `/images/schools/${slug}/photo2.webp`;
  if (sources.photo3) entry.photo3 = `/images/schools/${slug}/photo3.webp`;
  return entry;
}

function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      generatedAt: new Date().toISOString(),
      sourceRoot: GUIDE_ROOT,
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

// ─── Main ────────────────────────────────────────────────
async function run(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  log("Import school images from The Guide");
  log(`Source: ${GUIDE_ROOT}`);
  log(`Dry run: ${dryRun}`);

  const allSchools = loadAllSchools();
  const schoolsByCity = new Map<string, SchoolRecord[]>();
  for (const s of allSchools) {
    if (!schoolsByCity.has(s.citySlug)) schoolsByCity.set(s.citySlug, []);
    schoolsByCity.get(s.citySlug)!.push(s);
  }
  log(`Loaded ${allSchools.length} schools across ${schoolsByCity.size} cities`);

  const manifest = loadManifest();
  const existingSlugs = new Set(Object.keys(manifest.slugs ?? {}));
  const missingSlugs = [
    ...new Set(
      allSchools
        .filter((s) => !existingSlugs.has(s.slug))
        .map((s) => s.slug)
    ),
  ];
  log(`Schools already with images: ${existingSlugs.size}`);
  log(`Schools missing images (unique slugs): ${missingSlugs.length}`);

  const march1 = discoverMarch1Sources(schoolsByCity);
  const jakartaScrape = discoverJakartaScrapeSources();
  const merged = mergeSources(march1, jakartaScrape);
  log(`Discovered source images for ${merged.size} slugs from The Guide`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of missingSlugs) {
    const sources = merged.get(slug);
    if (!sources) {
      skipped++;
      continue;
    }
    log(`Processing ${slug}...`);
    const entry = await processSchool(slug, sources, dryRun);
    if (entry) {
      manifest.slugs = manifest.slugs ?? {};
      manifest.slugs[slug] = entry;
      if (!dryRun) saveManifest(manifest);
      processed++;
      log(`  Done: card, profile, ${entry.photo1 ? "photo1" : ""} ${entry.photo2 ? "photo2" : ""} ${entry.photo3 ? "photo3" : ""}`);
    } else {
      failed++;
    }
  }

  manifest.generatedAt = new Date().toISOString();
  if (!dryRun) saveManifest(manifest);

  log("--- Summary ---");
  log(`Processed: ${processed}, Skipped (no source): ${skipped}, Failed: ${failed}`);
  closeLog();
}

run().catch((err) => {
  console.error(err);
  log(String(err));
  closeLog();
  process.exitCode = 1;
});
