/**
 * Apply image edits exported from the KL image review gallery.
 *
 * Reads kl-image-edits.json (from ~/Downloads or a provided path),
 * then for each school:
 *  - Deletes flagged image files from public/images/schools/<slug>/
 *  - Renumbers remaining gallery photos in the new order (photo1, photo2, ...)
 *  - Updates school-images.json manifest to match
 *
 * Usage:
 *   npx tsx scripts/apply-kl-image-edits.ts
 *   npx tsx scripts/apply-kl-image-edits.ts /path/to/kl-image-edits.json
 *   npx tsx scripts/apply-kl-image-edits.ts --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const IMG_ROOT = path.join(process.cwd(), "public", "images", "schools");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "school-images.json");

type ManifestEntry = Record<string, string | undefined>;
type Manifest = {
  generatedAt: string;
  sourceRoot?: string;
  slugs: Record<string, ManifestEntry>;
  [key: string]: unknown;
};

interface SchoolEdit {
  slug: string;
  name: string;
  deleted: string[];
  order: string[];
}

interface EditsFile {
  exportedAt: string;
  edits: SchoolEdit[];
}

function log(msg: string): void {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

function findEditsFile(): string {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (args.length > 0) {
    if (fs.existsSync(args[0])) return args[0];
    console.error(`File not found: ${args[0]}`);
    process.exit(1);
  }

  const candidates = [
    path.join(os.homedir(), "Downloads", "kl-image-edits.json"),
    path.join(process.cwd(), "kl-image-edits.json"),
    path.join(process.cwd(), "scripts", "review", "kl-image-edits.json"),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  console.error(
    "Could not find kl-image-edits.json. Looked in:\n" +
      candidates.map((c) => `  ${c}`).join("\n") +
      "\n\nProvide the path as an argument, or export from the review gallery first."
  );
  process.exit(1);
}

function run(): void {
  const dryRun = process.argv.includes("--dry-run");
  const editsPath = findEditsFile();

  log(`Reading edits from: ${editsPath}`);
  if (dryRun) log("DRY RUN - no files will be changed");

  const editsFile: EditsFile = JSON.parse(fs.readFileSync(editsPath, "utf8"));
  log(`Exported at: ${editsFile.exportedAt}`);
  log(`Schools to edit: ${editsFile.edits.length}`);

  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

  let totalDeleted = 0;
  let totalReordered = 0;

  for (const edit of editsFile.edits) {
    const { slug, name, deleted, order } = edit;
    const schoolDir = path.join(IMG_ROOT, slug);
    const entry = manifest.slugs[slug];

    log(`\n--- ${name} (${slug}) ---`);

    if (!entry) {
      log(`  SKIP: not in manifest`);
      continue;
    }

    if (!fs.existsSync(schoolDir)) {
      log(`  SKIP: directory missing`);
      continue;
    }

    // 1. Delete flagged files
    for (const file of deleted) {
      const filePath = path.join(schoolDir, file);
      if (fs.existsSync(filePath)) {
        log(`  DELETE: ${file}`);
        if (!dryRun) fs.unlinkSync(filePath);
        totalDeleted++;
      } else {
        log(`  DELETE (already gone): ${file}`);
      }
    }

    // 2. Renumber remaining files in new order
    // order[] contains files like ["profile.webp", "photo3.webp", "photo1.webp", ...]
    // We need to rename them to: profile.webp (first), photo1.webp, photo2.webp, ...

    const newEntry: ManifestEntry = {};
    const tempRenames: { from: string; to: string }[] = [];

    // First pass: rename to temp names to avoid collisions
    for (let i = 0; i < order.length; i++) {
      const srcFile = order[i];
      const srcPath = path.join(schoolDir, srcFile);
      if (!fs.existsSync(srcPath) && !dryRun) {
        log(`  WARN: ${srcFile} missing, skipping`);
        continue;
      }

      if (i === 0) {
        // First image becomes profile + card
        if (srcFile !== "profile.webp") {
          const tempFile = `_temp_profile.webp`;
          tempRenames.push({ from: srcFile, to: tempFile });
          log(`  REORDER: ${srcFile} -> profile.webp (via temp)`);
        } else {
          log(`  KEEP: profile.webp (position 1)`);
        }
        newEntry.profile = `/images/schools/${slug}/profile.webp`;
        newEntry.card = `/images/schools/${slug}/card.webp`;
      } else {
        const photoKey = `photo${i}`;
        const targetFile = `${photoKey}.webp`;
        if (srcFile !== targetFile) {
          const tempFile = `_temp_${photoKey}.webp`;
          tempRenames.push({ from: srcFile, to: tempFile });
          log(`  REORDER: ${srcFile} -> ${targetFile} (via temp)`);
          totalReordered++;
        } else {
          log(`  KEEP: ${targetFile} (position ${i + 1})`);
        }
        newEntry[photoKey] = `/images/schools/${slug}/${targetFile}`;
      }
    }

    if (!dryRun && tempRenames.length > 0) {
      // Rename to temp names
      for (const { from, to } of tempRenames) {
        const fromPath = path.join(schoolDir, from);
        const toPath = path.join(schoolDir, to);
        if (fs.existsSync(fromPath)) {
          fs.renameSync(fromPath, toPath);
        }
      }

      // Rename from temp to final names
      for (let i = 0; i < order.length; i++) {
        const srcFile = order[i];
        const targetFile = i === 0 ? "profile.webp" : `photo${i}.webp`;

        if (srcFile === targetFile) continue;

        const tempFile = i === 0 ? "_temp_profile.webp" : `_temp_photo${i}.webp`;
        const tempPath = path.join(schoolDir, tempFile);
        const finalPath = path.join(schoolDir, targetFile);

        if (fs.existsSync(tempPath)) {
          fs.renameSync(tempPath, finalPath);
        }
      }

      // Regenerate card from profile if profile changed
      if (order[0] !== "profile.webp") {
        const profilePath = path.join(schoolDir, "profile.webp");
        const cardPath = path.join(schoolDir, "card.webp");
        if (fs.existsSync(profilePath)) {
          fs.copyFileSync(profilePath, cardPath);
          log(`  Copied profile -> card`);
        }
      }

      // Clean up any orphaned files not in the new order
      const keepFiles = new Set(["profile.webp", "card.webp"]);
      for (let i = 1; i < order.length; i++) {
        keepFiles.add(`photo${i}.webp`);
      }
      const allFiles = fs.readdirSync(schoolDir);
      for (const f of allFiles) {
        if (!keepFiles.has(f) && f.endsWith(".webp") && !f.startsWith("_temp_")) {
          log(`  CLEANUP: removing orphaned ${f}`);
          fs.unlinkSync(path.join(schoolDir, f));
        }
      }
    }

    // 3. Update manifest
    newEntry.sourceFolder = entry.sourceFolder ?? "outscraper-google-maps";
    if (!dryRun) {
      manifest.slugs[slug] = newEntry;
    }
  }

  // Save manifest
  if (!dryRun) {
    manifest.generatedAt = new Date().toISOString();
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  }

  log("\n=== Summary ===");
  log(`Schools edited: ${editsFile.edits.length}`);
  log(`Images deleted: ${totalDeleted}`);
  log(`Images reordered: ${totalReordered}`);
  if (dryRun) log("DRY RUN - no changes were made");
}

run();
