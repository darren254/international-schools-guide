import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_ROOT = "/Users/darren/Desktop/The Guide/Jakarta Images/Google Image Scrape/school_automation/the-guide/images/jakarta";
const SOURCE_ROOT_ALT = "/Users/darren/Desktop/Jakarta School Images";
const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const JAKARTA_SCHOOLS_PATH = path.join(process.cwd(), "src", "data", "jakarta-schools.ts");

const FOLDER_TO_SLUG_OVERRIDES: Record<string, string> = {
  acg: "acg-school-jakarta",
  the_independent_school_of_jakarta: "independent-school-of-jakarta",
  sekolah_pelita_harapan_lippo_village: "sekolah-pelita-harapan",
  sekolah_cita_buana: "cita-buana-school",
  "one_tab_per_school._work_through_cheapest_→_most_expensive._mark_audit_status_as_done_when_tab_is_complete.": "",
};

function normalizeToken(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function tokenize(s: string): string[] {
  return normalizeToken(s).split("-").filter(Boolean);
}

function readSchoolSlugs(): string[] {
  const raw = fs.readFileSync(JAKARTA_SCHOOLS_PATH, "utf8");
  const matches = [...raw.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  return [...new Set(matches)];
}

function chooseSlugForFolder(folderName: string, slugs: string[]): string | null {
  if (folderName in FOLDER_TO_SLUG_OVERRIDES) {
    const forced = FOLDER_TO_SLUG_OVERRIDES[folderName];
    return forced || null;
  }

  const direct = folderName.replace(/_/g, "-").toLowerCase();
  if (slugs.includes(direct)) return direct;

  const folderTokens = tokenize(folderName.replace(/_/g, "-"));
  if (folderTokens.length === 0) return null;

  let bestSlug: string | null = null;
  let bestScore = 0;
  let secondBest = 0;

  for (const slug of slugs) {
    const slugTokens = tokenize(slug);
    if (slugTokens.length === 0) continue;
    const overlap = folderTokens.filter((t) => slugTokens.includes(t)).length;
    if (overlap === 0) continue;

    const coverageFromFolder = overlap / folderTokens.length;
    const coverageFromSlug = overlap / slugTokens.length;
    const firstTokenBonus = folderTokens[0] === slugTokens[0] ? 0.2 : 0;
    const score = coverageFromFolder * 0.6 + coverageFromSlug * 0.4 + firstTokenBonus;

    if (score > bestScore) {
      secondBest = bestScore;
      bestScore = score;
      bestSlug = slug;
    } else if (score > secondBest) {
      secondBest = score;
    }
  }

  if (!bestSlug) return null;
  if (bestScore < 0.55) return null;
  if (bestScore - secondBest < 0.08) return null;
  return bestSlug;
}

async function optimizeImage(inputPath: string, outputPath: string) {
  // Max display width 1600px
  await sharp(inputPath)
    .rotate()
    .resize({ width: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);
}

async function run() {
  const slugs = readSchoolSlugs();
  const manifestRaw = fs.existsSync(MANIFEST_PATH) ? fs.readFileSync(MANIFEST_PATH, "utf8") : "{}";
  let manifest = JSON.parse(manifestRaw);
  if (!manifest.slugs) manifest.slugs = {};

  const sourceFolders = fs.readdirSync(SOURCE_ROOT).filter((name) => fs.statSync(path.join(SOURCE_ROOT, name)).isDirectory());

  for (const folderName of sourceFolders) {
    const folderPath = path.join(SOURCE_ROOT, folderName);
    const slug = chooseSlugForFolder(folderName, slugs);
    if (!slug) continue;

    const files = fs.readdirSync(folderPath);
    const campusFile = files.find((f) => f.toLowerCase().startsWith("campus."));
    if (!campusFile) continue;

    const sourceImage = path.join(folderPath, campusFile);
    const targetDir = path.join(OUTPUT_ROOT, slug);
    const targetOutput = path.join(targetDir, "campus.webp");

    fs.mkdirSync(targetDir, { recursive: true });
    await optimizeImage(sourceImage, targetOutput);

    manifest.slugs[slug] = {
      profile: `/images/schools/${slug}/campus.webp`,
      card: `/images/schools/${slug}/campus.webp`,
      sourceFolder: folderName,
      sourceFile: campusFile,
    };
  }

  // Also check SOURCE_ROOT_ALT just in case
  if (fs.existsSync(SOURCE_ROOT_ALT)) {
      const altFiles = fs.readdirSync(SOURCE_ROOT_ALT);
      for (const file of altFiles) {
          if (file.toLowerCase().includes("campus")) {
              const baseName = file.toLowerCase().split("-campus")[0].split(" campus")[0];
              const slug = chooseSlugForFolder(baseName, slugs);
              if (slug) {
                  const sourceImage = path.join(SOURCE_ROOT_ALT, file);
                  const targetDir = path.join(OUTPUT_ROOT, slug);
                  const targetOutput = path.join(targetDir, "campus.webp");
              
                  fs.mkdirSync(targetDir, { recursive: true });
                  await optimizeImage(sourceImage, targetOutput);
              
                  manifest.slugs[slug] = {
                    profile: `/images/schools/${slug}/campus.webp`,
                    card: `/images/schools/${slug}/campus.webp`,
                    sourceFolder: "Jakarta School Images",
                    sourceFile: file,
                  };
              }
          }
      }
  }

  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log("Done optimizing campus images");
}

run().catch(console.error);
