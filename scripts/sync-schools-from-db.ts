/**
 * Sync school images from Neon (school_media + schools.hero_image_url etc.) into school-images.json.
 * Run after editing in admin. Requires DATABASE_URL (e.g. in .env.local).
 * Usage: npx tsx scripts/sync-schools-from-db.ts
 *
 * Optional: R2_PUBLIC_URL — if school_media.url stores R2 keys (e.g. schools/slug/uuid.webp),
 * set this to the public base URL (e.g. in Cloudflare Pages env or .env.local when running sync)
 * so output paths are full URLs.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { neon } from "@neondatabase/serverless";

const OUT_PATH = path.join(process.cwd(), "src/data/school-images.json");
const LAST_PUBLISH_PATH = path.join(process.cwd(), "src/data/last-publish.json");
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

function normalizeImageUrl(url: string): string {
  if (url.startsWith("//") && url.slice(2).startsWith("images/")) return "/" + url.slice(2);
  return url;
}
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL required");
    process.exit(1);
  }
  const sql = neon(url);

  const schools = (await sql`
    SELECT id, slug, hero_image_url, og_image_url, logo_url, head_photo_url
    FROM schools
    WHERE slug IS NOT NULL
  `) as { id: string; slug: string; hero_image_url: string | null; og_image_url: string | null; logo_url: string | null; head_photo_url: string | null }[];

  const media = (await sql`
    SELECT school_id, variant, url FROM school_media ORDER BY school_id, display_order, created_at
  `) as { school_id: string; variant: string; url: string }[];

  const mediaBySchool: Record<string, Record<string, string>> = {};
  for (const m of media) {
    if (!mediaBySchool[m.school_id]) mediaBySchool[m.school_id] = {};
    const urlStr = m.url.startsWith("http") ? m.url : R2_PUBLIC_URL ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${m.url}` : `/${m.url}`;
    mediaBySchool[m.school_id][m.variant] = normalizeImageUrl(urlStr);
  }

  const slugs: Record<string, Record<string, string>> = {};
  for (const s of schools) {
    const entry: Record<string, string> = { ...mediaBySchool[s.id] };
    if (s.hero_image_url) entry.hero = normalizeImageUrl(s.hero_image_url.startsWith("http") ? s.hero_image_url : (R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${s.hero_image_url}` : s.hero_image_url));
    if (s.og_image_url) entry.og = normalizeImageUrl(s.og_image_url.startsWith("http") ? s.og_image_url : (R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${s.og_image_url}` : s.og_image_url));
    if (s.logo_url) entry.logo = normalizeImageUrl(s.logo_url.startsWith("http") ? s.logo_url : (R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${s.logo_url}` : s.logo_url));
    if (s.head_photo_url) entry.head = normalizeImageUrl(s.head_photo_url.startsWith("http") ? s.head_photo_url : (R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${s.head_photo_url}` : s.head_photo_url));
    if (Object.keys(entry).length > 0) slugs[s.slug] = entry;
  }

  const existing = fs.existsSync(OUT_PATH)
    ? (JSON.parse(fs.readFileSync(OUT_PATH, "utf-8")) as { generatedAt?: string; sourceRoot?: string; slugs: Record<string, Record<string, string>> })
    : { slugs: {} };
  const merged = { ...existing.slugs };
  for (const [slug, entry] of Object.entries(slugs)) {
    merged[slug] = { ...merged[slug], ...entry };
  }
  // Normalize any protocol-relative //images/... to /images/... in merged output
  for (const slug of Object.keys(merged)) {
    const e = merged[slug];
    for (const k of Object.keys(e)) {
      e[k] = normalizeImageUrl(e[k]);
    }
  }
  const out = {
    generatedAt: new Date().toISOString(),
    ...(existing.sourceRoot && { sourceRoot: existing.sourceRoot }),
    slugs: merged,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  fs.writeFileSync(LAST_PUBLISH_PATH, JSON.stringify({ publishedAt: out.generatedAt }, null, 2));
  console.log("Wrote", OUT_PATH, "—", Object.keys(slugs).length, "schools from DB,", Object.keys(merged).length, "total slugs");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
