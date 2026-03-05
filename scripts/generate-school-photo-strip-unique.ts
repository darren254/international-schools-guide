/**
 * Build-time: deduplicate school photo-strip images by file content hash.
 * Reads public/images/schools/{slug}/*.webp, outputs unique URLs in order.
 * Run before next build: tsx scripts/generate-school-photo-strip-unique.ts
 */

import fs from "fs";
import path from "path";
import { createHash } from "crypto";

const ROOT = path.join(process.cwd());
const MANIFEST_PATH = path.join(ROOT, "src/data/school-images.json");
const OUT_PATH = path.join(ROOT, "src/data/school-photo-strip-unique.json");
const VARIANTS = ["profile", "photo1", "photo2", "photo3"] as const;

type Manifest = { slugs: Record<string, { profile?: string; photo1?: string; photo2?: string; photo3?: string }> };

function hashFile(filePath: string): string | null {
  try {
    const buf = fs.readFileSync(filePath);
    return createHash("md5").update(buf).digest("hex");
  } catch {
    return null;
  }
}

function uniqueOrderedUrls(manifest: Manifest, slug: string): string[] {
  const entry = manifest.slugs[slug];
  if (!entry) return [];

  const seen = new Set<string>();
  const urls: string[] = [];

  for (const v of VARIANTS) {
    const url = entry[v];
    if (!url) continue;
    const fullPath = path.join(ROOT, "public", url.replace(/^\//, ""));
    if (!fs.existsSync(fullPath)) continue;
    const hash = hashFile(fullPath);
    if (hash == null) continue;
    if (seen.has(hash)) continue;
    seen.add(hash);
    urls.push(url);
  }

  return urls;
}

function main() {
  const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
  const manifest: Manifest = JSON.parse(raw);
  const slugs = Object.keys(manifest.slugs);
  const result: Record<string, string[]> = {};

  for (const slug of slugs) {
    result[slug] = uniqueOrderedUrls(manifest, slug);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), slugs: result }, null, 2), "utf-8");
  console.log("Wrote", OUT_PATH, "—", slugs.length, "schools");
}

main();
