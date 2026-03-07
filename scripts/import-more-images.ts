/**
 * Import school images from "more images" folder on Desktop.
 * Converts to .webp, resizes (card 800px, profile 1600px, photos 1600px), writes to
 * public/images/schools/<slug>/ and updates school-images.json.
 *
 * Run: npx tsx scripts/import-more-images.ts
 * Source: /Users/darren/Desktop/more images
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const SOURCE_ROOT = "/Users/darren/Desktop/more images";
const OUTPUT_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");

const CARD_WIDTH = 800;
const PROFILE_WIDTH = 1600;
const PHOTO_WIDTH = 1600;
const WEBP_QUALITY = 78;

/** slug -> folder name in SOURCE_ROOT, then card/profile/photo1-3 source filenames (in folder). null = resolve at runtime via readdir. */
const SCHOOL_SOURCES: Record<
  string,
  { folder: string; card: string | null; profile: string | null; photo1?: string | null; photo2?: string | null; photo3?: string | null }
> = {
  "berkeley-international-school": {
    folder: "Berkley",
    card: "berkeley-international-school-bangkok.webp",
    profile: "berkeley-hero-4-1500x630.webp",
    photo1: "elementary-uniform-regular.webp",
    photo2: "middle-school.webp",
  },
  "dbs-denla-british-school": {
    folder: "DBS Denla",
    card: "DENLA-BRITISH-SCHOOL-DBS-one-of-the-leading-premium-international-schools-in-Thailand-1014x487-1.webp",
    profile: "DENLA-BRITISH-SCHOOL-DBS-one-of-the-leading-premium-international-schools-in-Thailand-1014x487-1.webp",
    photo1: "start-your-journey-img1.webp",
    photo2: "7.webp",
  },
  "kis-international-school": {
    folder: "KIS International School Bangkok Huai Khwang ",
    card: "SecondarySchoolBuilding.webp",
    profile: "SecondarySchoolBuilding.webp",
    photo1: "DesignTechClass.webp",
    photo2: "PYPMusicClass.webp",
    photo3: "Studentsplayingfootball.webp",
  },
  "kis-international-school-reignwood-park": {
    folder: "KIS Intl Bangkok Reignwood Park",
    card: "KIS-Reignwood-Park-Campus-1.jpg",
    profile: "KIS-Reignwood-Park-Campus-1.jpg",
    photo1: "Secondary-04.webp",
    photo2: "475198761_426526397211030_6494721355739971525_n.jpg",
    photo3: "647401711_724597587403908_5306038404446504691_n.jpg",
  },
  "st-andrews-international-school-sukhumvit-107": {
    folder: "St Andrews International School Sukhumvit 107 Bangkok",
    card: null, // resolved at runtime from readdir (Screenshot*.png)
    profile: null,
    photo1: null,
    photo2: null,
    photo3: null,
  },
  "st-andrews-samakee-international-school": {
    folder: "St Andrews Samakee International School Bangkok Nonthaburi",
    card: "570365_main.jpg",
    profile: "570365_main.jpg",
    photo1: "570367_main.jpg",
    photo2: "570369_main.jpg",
    photo3: "570371_main.jpg",
  },
  "xcl-american-school-of": {
    folder: "XCL Bangkok",
    card: "XCL-ASB-School-Front.jpg",
    profile: "XCL-ASB-School-Front.jpg",
    photo1: "585674_main.jpg",
    photo2: "585676_main.jpg",
    photo3: "pic2-mobile.jpg",
  },
  "british-mandarin-international-school": {
    folder: "british mandarin intl school bangkok",
    card: "Mandarin-1-1600x846.webp",
    profile: "Mandarin-1-1600x846.webp",
    photo1: "bmis-mini-sports-day-2025-1.jpg",
    photo2: "640305867_17994295337864162_8145741682586453058_n.jpg",
    photo3: "642327188_17995118585864162_8885760874224663618_n.jpg",
  },
  "montessori-academy-bangkok-international-school": {
    folder: "montessori academy bangkok international school",
    card: "maxresdefault.jpg",
    profile: "maxresdefault.jpg",
    photo1: null, // resolved at runtime: Screenshot*.png
    photo2: null,
    photo3: null,
  },
};

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

async function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error("Source folder not found:", SOURCE_ROOT);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (!manifest.slugs) manifest.slugs = {};

  for (const [slug, config] of Object.entries(SCHOOL_SOURCES)) {
    const dir = path.join(SOURCE_ROOT, config.folder);
    if (!fs.existsSync(dir)) {
      console.warn("Skip", slug, "- folder not found:", config.folder);
      continue;
    }

    let cardFile = config.card;
    let profileFile = config.profile;
    let photo1File = config.photo1 ?? null;
    let photo2File = config.photo2 ?? null;
    let photo3File = config.photo3 ?? null;

    if (cardFile == null || profileFile == null) {
      const screenshots = fs.readdirSync(dir).filter((f) => f.startsWith("Screenshot") && f.endsWith(".png")).sort();
      if (screenshots.length === 0) {
        console.warn("Skip", slug, "- no Screenshot*.png for card/profile");
        continue;
      }
      cardFile = screenshots[0];
      profileFile = screenshots[0];
      if (photo1File == null && screenshots.length > 1) photo1File = screenshots[1];
      if (photo2File == null && screenshots.length > 2) photo2File = screenshots[2];
      if (photo3File == null && screenshots.length > 3) photo3File = screenshots[3];
    } else if (photo1File == null || photo2File == null || photo3File == null) {
      const screenshots = fs.readdirSync(dir).filter((f) => f.startsWith("Screenshot") && f.endsWith(".png")).sort();
      if (photo1File == null && screenshots.length > 0) photo1File = screenshots[0];
      if (photo2File == null && screenshots.length > 1) photo2File = screenshots[1];
      if (photo3File == null && screenshots.length > 2) photo3File = screenshots[2];
    }

    const cardSrc = path.join(dir, cardFile);
    const profileSrc = path.join(dir, profileFile);
    if (!fs.existsSync(cardSrc) || !fs.existsSync(profileSrc)) {
      console.warn("Skip", slug, "- missing card or profile file");
      continue;
    }

    const outDir = path.join(OUTPUT_ROOT, slug);
    fs.mkdirSync(outDir, { recursive: true });

    try {
      await optimizeToWebp(profileSrc, path.join(outDir, "profile.webp"), PROFILE_WIDTH);
      await optimizeToWebp(cardSrc, path.join(outDir, "card.webp"), CARD_WIDTH);

      const entry: Record<string, string> = {
        profile: `/images/schools/${slug}/profile.webp`,
        card: `/images/schools/${slug}/card.webp`,
      };
      if (photo1File && fs.existsSync(path.join(dir, photo1File))) {
        await optimizeToWebp(path.join(dir, photo1File), path.join(outDir, "photo1.webp"), PHOTO_WIDTH);
        entry.photo1 = `/images/schools/${slug}/photo1.webp`;
      }
      if (photo2File && fs.existsSync(path.join(dir, photo2File))) {
        await optimizeToWebp(path.join(dir, photo2File), path.join(outDir, "photo2.webp"), PHOTO_WIDTH);
        entry.photo2 = `/images/schools/${slug}/photo2.webp`;
      }
      if (photo3File && fs.existsSync(path.join(dir, photo3File))) {
        await optimizeToWebp(path.join(dir, photo3File), path.join(outDir, "photo3.webp"), PHOTO_WIDTH);
        entry.photo3 = `/images/schools/${slug}/photo3.webp`;
      }

      manifest.slugs[slug] = { ...manifest.slugs[slug], ...entry, sourceFolder: "more images", sourceFile: config.folder };
      console.log("OK", slug, Object.keys(entry).join(", "));
    } catch (err) {
      console.error("Error", slug, err);
    }
  }

  manifest.generatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Updated", MANIFEST_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
