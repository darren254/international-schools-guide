/**
 * Import leader (head of school) images from a flat folder of files named:
 *   leader-name_school-name-with-dashes.ext
 *
 * Usage:
 *   LEADER_IMAGES_DIR=/Users/darren/Desktop/leader-images npx tsx scripts/import-leader-images-from-desktop.ts
 *
 * - Matches each file's school part to SCHOOL_PROFILES slug (exact, prefix, normalized, alias).
 * - Writes resized WebP to public/images/heads/{citySlug}/{slug}.webp.
 * - Merges into src/data/head-images.json (keeps existing entries for schools with no file).
 * - Optionally adds leader name from filename to head-overrides.json when slug has no override.
 * - Logs assigned, skipped, ambiguous; writes unmatched to leader-images-unmatched.txt.
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const LEADER_IMAGES_DIR = process.env.LEADER_IMAGES_DIR || "/Users/darren/Desktop/leader-images";
const OUT_HEADS_JSON = path.join(process.cwd(), "src/data/head-images.json");
const OUT_OVERRIDES_JSON = path.join(process.cwd(), "src/data/head-overrides.json");
const PUBLIC_HEADS = path.join(process.cwd(), "public/images/heads");
const UNMATCHED_REPORT = path.join(process.cwd(), "leader-images-unmatched.txt");
const HEAD_SIZE = 176;
const WEBP_QUALITY = 85;

/** schoolPart from filename -> slug (for truncated or odd filenames) */
const LEADER_IMAGE_SCHOOL_ALIASES: Record<string, string> = {
  "dulwich-college-international-school-ban": "dulwich-college-international-school",
  "german-swiss-international-school-hong-k": "german-swiss-international-school",
  "lycee-francais-international-de-laflec-d": "lycee-francais-international",
  "stamford-american-school-hong-kong": "stamford-american-international-school",
  "united-world-college-of-south-east-asia-": "united-world-college-of-south-east-asia-east-campus",
  "canadian-international-school-of-hong-ko": "canadian-international-school-of",
  "singapore-international-school-of-bangko": "singapore-international-school-of",
  "international-christian-school-nonthabur": "international-christian-school-nonthaburi",
  "the-international-school-of-choueifat--d": "the-international-school-of-choueifat-dubai-investments-park",
  "ambassador-international-academy-mankhoo": "ambassador-international-academy-mankhool",
  "international-school-of-creative-science": "international-school-of-creative-science-muwaileh",
  "american-school-of-dubai": "american-school-of",
  // Unmatched from Perplexity list – same schools, truncation/spelling/accents
  "lycee-francais-bilingue-international-bi": "lycee-francais-bilingue-international",
  "tenby-international-school-tropicana-ama": "tenby-school-tropicana-aman",
  "tanarata-international-schools": "tanarata-international-school",
  "sri-kdu-international-school-kota-damans": "sri-kdu-school",
  "queen-elizabeths-school-dubai-sports-cit": "queen-elizabeth-s-school-dubai-sports-city",
  "gems-our-own-high-school---al-warqaa": "our-own-high-school",
  "gems-our-own-high-school-al-warqaa": "our-own-high-school",
  "singapore-school-pantai-indah-kapuk": "sis-pantai-indah-kapuk",
  "ris-ruamrudee-international-school": "ruamrudee-international-school",
  "bangkok-international-preparatory-and-se": "bangkok-international-preparatory-secondary-school",
  "la-petite-ecole-singapore": "le-petite-ecole",
  "gems-al-khaleej-international-school-dub": "al-khaleej-international-school",
  "hua-xi-international-school-kuala-lumpur": "hua-xia-international-school",
  "german-european-school-singapore-gess": "gess",
  "star-international-school-al-twar-dubai": "star-international-school-altwar",
  "raffles-international-school-dubai": "raffles-international-schools",
  "denla-british-school": "dbs-denla-british-school",
  "the-international-school--parkcity": "the-international-school-at-parkcity",
  "kings-college-international-school-bangk": "king-s-college-international-school",
  "gems-cambridge-international-school---du": "cambridge-international-school",
  "gems-cambridge-international-school-du": "cambridge-international-school",
  "lycee-francais-international-de-bangkok": "lycee-francais-international-de",
  "lycee-francais-de-kuala-lumpur": "lycee-francais-de",
  "penabur-intercultural-school": "penabur-international-school",
  "sekolah-cikal": "cikal-school",
};

const CITY_SUFFIXES = ["dubai", "bangkok", "singapore", "hong-kong", "kuala-lumpur", "jakarta"];

/** Strip accents for matching (é → e, etc.) so "lycée" matches "lycee" */
function normalizeAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{Mc}|\p{Mn}|\p{M}/gu, "");
}

function normalizeDashes(s: string): string {
  return s.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function parseFilename(fileName: string): { leaderPart: string; schoolPart: string } | null {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  const i = base.indexOf("_");
  if (i <= 0 || i === base.length - 1) return null;
  return {
    leaderPart: base.slice(0, i),
    schoolPart: base.slice(i + 1).toLowerCase(),
  };
}

/** Format "chris-sammons" -> "Chris Sammons" */
function leaderPartToDisplayName(leaderPart: string): string {
  return leaderPart
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Find exactly one matching slug for schoolPart, or null. */
function matchSchoolPart(schoolPart: string, slugByExact: Set<string>): string | null {
  const normalized = normalizeDashes(schoolPart);
  const noAccents = normalizeAccents(schoolPart);
  const noAccentsNorm = normalizeAccents(normalized);

  const aliasKey =
    LEADER_IMAGE_SCHOOL_ALIASES[schoolPart] ??
    LEADER_IMAGE_SCHOOL_ALIASES[normalized] ??
    LEADER_IMAGE_SCHOOL_ALIASES[noAccents] ??
    LEADER_IMAGE_SCHOOL_ALIASES[noAccentsNorm];
  if (aliasKey && slugByExact.has(aliasKey)) return aliasKey;
  if (aliasKey) return aliasKey;

  if (slugByExact.has(schoolPart)) return schoolPart;
  if (slugByExact.has(normalized)) return normalized;
  if (slugByExact.has(noAccents)) return noAccents;
  if (slugByExact.has(noAccentsNorm)) return noAccentsNorm;

  const candidates: string[] = [];

  for (const slug of slugByExact) {
    if (slug === schoolPart || slug === normalized || slug === noAccents || slug === noAccentsNorm) return slug;
    const partVariants = [schoolPart, normalized, noAccents, noAccentsNorm];
    for (const p of partVariants) {
      if (schoolPart.startsWith(slug + "-") || p.startsWith(slug + "-")) candidates.push(slug);
      if (slug.startsWith(p) || slug.startsWith(schoolPart) || slug.startsWith(normalized)) candidates.push(slug);
    }
  }

  const withoutCity = CITY_SUFFIXES.reduce((s, city) => {
    const suffix = "-" + city;
    if (s.endsWith(suffix)) return s.slice(0, -suffix.length);
    return s;
  }, noAccentsNorm);
  if (withoutCity !== noAccentsNorm && slugByExact.has(withoutCity)) candidates.push(withoutCity);

  const unique = [...new Set(candidates)];
  return unique.length === 1 ? unique[0]! : null;
}

async function main() {
  if (!fs.existsSync(LEADER_IMAGES_DIR)) {
    console.error("LEADER_IMAGES_DIR not found:", LEADER_IMAGES_DIR);
    process.exit(1);
  }

  const { SCHOOL_PROFILES } = await import("../src/data/schools");
  const slugToCity = new Map<string, string>();
  const slugByExact = new Set<string>();
  for (const [slug, p] of Object.entries(SCHOOL_PROFILES)) {
    slugToCity.set(slug, p.citySlug);
    slugByExact.add(slug);
  }

  const existingHeads = fs.existsSync(OUT_HEADS_JSON)
    ? (JSON.parse(fs.readFileSync(OUT_HEADS_JSON, "utf-8")) as { slugs: Record<string, string> }).slugs
    : {};
  const existingOverrides = fs.existsSync(OUT_OVERRIDES_JSON)
    ? (JSON.parse(fs.readFileSync(OUT_OVERRIDES_JSON, "utf-8")) as { slugs: Record<string, { name?: string }> }).slugs
    : {};

  const headImages: Record<string, string> = { ...existingHeads };
  const headOverrides: Record<string, { name: string; title?: string }> = { ...existingOverrides };

  const files = fs.readdirSync(LEADER_IMAGES_DIR, { withFileTypes: true }).filter((f) => f.isFile());
  const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const assigned: { file: string; slug: string; path: string }[] = [];
  const skipped: string[] = [];
  const ambiguous: { file: string; schoolPart: string; candidates: string[] }[] = [];
  const unmatched: string[] = [];

  for (const f of files) {
    const ext = path.extname(f.name).toLowerCase();
    if (!imageExts.has(ext)) continue;

    const parsed = parseFilename(f.name);
    if (!parsed) {
      skipped.push(f.name);
      continue;
    }

    const slug = matchSchoolPart(parsed.schoolPart, slugByExact);
    if (!slug) {
      const normalized = normalizeDashes(parsed.schoolPart);
      const candidates: string[] = [];
      for (const s of slugByExact) {
        if (s === parsed.schoolPart || s === normalized) candidates.push(s);
        else if (parsed.schoolPart.startsWith(s + "-") || s.startsWith(parsed.schoolPart) || s.startsWith(normalized))
          candidates.push(s);
      }
      if (candidates.length > 1) ambiguous.push({ file: f.name, schoolPart: parsed.schoolPart, candidates });
      else unmatched.push(`${f.name}\tschoolPart=${parsed.schoolPart}`);
      continue;
    }

    const citySlug = slugToCity.get(slug);
    if (!citySlug) {
      unmatched.push(`${f.name}\tslug=${slug} (no city)`);
      continue;
    }

    const srcPath = path.join(LEADER_IMAGES_DIR, f.name);
    const destDir = path.join(PUBLIC_HEADS, citySlug);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const destWebp = path.join(destDir, `${slug}.webp`);
    const publicPath = `/images/heads/${citySlug}/${slug}.webp`;

    try {
      await sharp(srcPath)
        .rotate()
        .resize(HEAD_SIZE, HEAD_SIZE, { fit: "cover" })
        .webp({ quality: WEBP_QUALITY, effort: 5 })
        .toFile(destWebp);
    } catch (err) {
      console.warn("Skip (invalid image):", f.name, (err as Error).message?.slice(0, 50));
      skipped.push(f.name);
      continue;
    }

    headImages[slug] = publicPath;
    assigned.push({ file: f.name, slug, path: publicPath });

    if (!existingOverrides[slug] && parsed.leaderPart) {
      headOverrides[slug] = { name: leaderPartToDisplayName(parsed.leaderPart) };
    }
  }

  fs.writeFileSync(
    OUT_HEADS_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), slugs: headImages }, null, 2)
  );
  fs.writeFileSync(
    OUT_OVERRIDES_JSON,
    JSON.stringify({ generatedAt: new Date().toISOString(), slugs: headOverrides }, null, 2)
  );
  fs.writeFileSync(UNMATCHED_REPORT, unmatched.join("\n") + "\n", "utf-8");

  console.log("Assigned:", assigned.length);
  console.log("Skipped:", skipped.length);
  console.log("Ambiguous:", ambiguous.length);
  console.log("Unmatched:", unmatched.length, "->", UNMATCHED_REPORT);
  if (ambiguous.length > 0) {
    console.log("Ambiguous (add to LEADER_IMAGE_SCHOOL_ALIASES):");
    ambiguous.slice(0, 15).forEach((a) => console.log(" ", a.file, "->", a.candidates));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
