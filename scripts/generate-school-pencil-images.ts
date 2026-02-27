import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type Variant = "card" | "profile";

type ImageManifestEntry = {
  card: string;
  profile: string;
  sourceFolder: string;
  sourceFile: string;
};

type ImageManifest = {
  generatedAt: string;
  sourceRoot: string;
  slugs: Record<string, ImageManifestEntry>;
  unmappedSourceFolders: string[];
  missingImageFolders: string[];
};

const SOURCE_ROOT_DEFAULT =
  "/Users/darren/Desktop/The Guide/Jakarta Images/Google Image Scrape/school_automation/the-guide/images/jakarta";
const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");
const JAKARTA_SCHOOLS_PATH = path.join(process.cwd(), "src", "data", "jakarta-schools.ts");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".heic", ".avif"]);
const PREFERRED_BASENAMES = ["campus", "01", "photo_1"];

const FOLDER_TO_SLUG_OVERRIDES: Record<string, string> = {
  acg: "acg-school-jakarta",
  the_independent_school_of_jakarta: "independent-school-of-jakarta",
  sekolah_pelita_harapan_lippo_village: "sekolah-pelita-harapan",
  sekolah_cita_buana: "cita-buana-school",
  "one_tab_per_school._work_through_cheapest_→_most_expensive._mark_audit_status_as_done_when_tab_is_complete.": "",
};

function argValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasArg(flag: string): boolean {
  return process.argv.includes(flag);
}

function normalizeToken(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function tokenize(s: string): string[] {
  return normalizeToken(s)
    .split("-")
    .filter(Boolean);
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

function listImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const names = fs.readdirSync(dir);
  return names
    .map((name) => path.join(dir, name))
    .filter((p) => fs.statSync(p).isFile() && IMAGE_EXTENSIONS.has(path.extname(p).toLowerCase()));
}

function pickSourceImage(filePaths: string[]): string | null {
  if (filePaths.length === 0) return null;

  for (const base of PREFERRED_BASENAMES) {
    const match = filePaths.find((p) => path.parse(p).name.toLowerCase() === base);
    if (match) return match;
  }

  // Otherwise pick largest file (usually best quality).
  return [...filePaths].sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0] ?? null;
}

async function createPencilVariant(inputPath: string, outputPath: string, variant: Variant) {
  const targetWidth = variant === "profile" ? 1200 : 760;
  const quality = variant === "profile" ? 70 : 72;

  const base = sharp(inputPath).rotate().resize({ width: targetWidth, fit: "inside", withoutEnlargement: true });
  const colorBase = await base.clone().modulate({ saturation: 1.08, brightness: 1.03 }).toBuffer();
  const edgeSketch = await base
    .clone()
    .greyscale()
    .normalise()
    .convolve({
      width: 3,
      height: 3,
      kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    })
    .negate()
    .blur(0.8)
    .linear(1.35, -24)
    .toBuffer();

  await sharp(colorBase)
    .composite([
      { input: edgeSketch, blend: "multiply", opacity: 0.42 },
      { input: edgeSketch, blend: "overlay", opacity: 0.2 },
    ])
    .modulate({ saturation: 0.92, brightness: 1.02 })
    .sharpen(1.1, 1, 2)
    .webp({ quality, effort: 5 })
    .toFile(outputPath);
}

async function run() {
  const sourceRoot = argValue("--source") ?? SOURCE_ROOT_DEFAULT;
  const dryRun = hasArg("--dry-run");

  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source root does not exist: ${sourceRoot}`);
  }

  const slugs = readSchoolSlugs();
  const sourceFolders = fs
    .readdirSync(sourceRoot)
    .filter((name) => fs.statSync(path.join(sourceRoot, name)).isDirectory())
    .sort();

  const manifest: ImageManifest = {
    generatedAt: new Date().toISOString(),
    sourceRoot: "external/jakarta-school-automation-images",
    slugs: {},
    unmappedSourceFolders: [],
    missingImageFolders: [],
  };

  if (!dryRun) {
    fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  }

  for (const folderName of sourceFolders) {
    const folderPath = path.join(sourceRoot, folderName);
    const slug = chooseSlugForFolder(folderName, slugs);
    if (!slug) {
      manifest.unmappedSourceFolders.push(folderName);
      continue;
    }

    const imageFiles = listImageFiles(folderPath);
    const sourceImage = pickSourceImage(imageFiles);
    if (!sourceImage) {
      manifest.missingImageFolders.push(folderName);
      continue;
    }

    const targetDir = path.join(OUTPUT_ROOT, slug);
    const profileOutput = path.join(targetDir, "profile.webp");
    const cardOutput = path.join(targetDir, "card.webp");

    if (!dryRun) {
      fs.mkdirSync(targetDir, { recursive: true });
      await createPencilVariant(sourceImage, profileOutput, "profile");
      await createPencilVariant(sourceImage, cardOutput, "card");
    }

    manifest.slugs[slug] = {
      profile: `/images/schools/${slug}/profile.webp`,
      card: `/images/schools/${slug}/card.webp`,
      sourceFolder: folderName,
      sourceFile: path.basename(sourceImage),
    };
  }

  if (!dryRun) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  }

  const summary = {
    sourceFolders: sourceFolders.length,
    mappedAndGenerated: Object.keys(manifest.slugs).length,
    unmapped: manifest.unmappedSourceFolders.length,
    missingImageFolders: manifest.missingImageFolders.length,
    dryRun,
  };

  console.log(JSON.stringify(summary, null, 2));
  if (manifest.unmappedSourceFolders.length) {
    console.log("unmappedSourceFolders:", manifest.unmappedSourceFolders.join(", "));
  }
  if (manifest.missingImageFolders.length) {
    console.log("missingImageFolders:", manifest.missingImageFolders.join(", "));
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
