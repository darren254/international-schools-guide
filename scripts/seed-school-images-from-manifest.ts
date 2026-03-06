/**
 * Seed school_media (and schools.hero_image_url etc.) from src/data/school-images.json
 * so existing static images show up in the admin. Safe to re-run (replaces manifest-sourced rows).
 *
 * Usage: npx tsx scripts/seed-school-images-from-manifest.ts
 * Requires: DATABASE_URL in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set. Add it to .env.local");
  process.exit(1);
}

const manifestPath = path.join(process.cwd(), "src/data/school-images.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as {
  slugs?: Record<string, Record<string, string>>;
};
const slugs = manifest.slugs ?? {};

const sql = neon(url);

const VARIANT_ORDER: Record<string, number> = {
  card: 0,
  profile: 1,
  hero: 2,
  og: 3,
  logo: 4,
  photo1: 5,
  photo2: 6,
  photo3: 7,
};

async function main() {
  let schoolsUpdated = 0;
  let mediaInserted = 0;

  for (const [slug, entry] of Object.entries(slugs)) {
    if (!entry || typeof entry !== "object") continue;
    const schoolRows = (await sql`
      SELECT id FROM schools WHERE slug = ${slug} LIMIT 1
    `) as { id: string }[];
    if (!schoolRows?.[0]) continue;
    const schoolId = schoolRows[0].id;

    const variants = Object.keys(entry).filter(
      (k) =>
        ["card", "profile", "hero", "og", "logo", "photo1", "photo2", "photo3"].includes(k) &&
        typeof entry[k] === "string"
    );
    if (variants.length === 0) continue;

    await sql`
      DELETE FROM school_media
      WHERE school_id = ${schoolId} AND url LIKE '/images/%'
    `;

    let heroUrl: string | null = null;
    let ogUrl: string | null = null;
    let logoUrl: string | null = null;

    for (const variant of variants) {
      const urlVal = entry[variant] as string;
      const id = crypto.randomUUID();
      const displayOrder = VARIANT_ORDER[variant] ?? 99;
      await sql`
        INSERT INTO school_media (id, school_id, variant, url, display_order)
        VALUES (${id}, ${schoolId}, ${variant}, ${urlVal}, ${displayOrder})
      `;
      mediaInserted++;
      if (variant === "hero") heroUrl = urlVal;
      if (variant === "og") ogUrl = urlVal;
      if (variant === "logo") logoUrl = urlVal;
    }

    await sql`
      UPDATE schools
      SET hero_image_url = COALESCE(${heroUrl}, hero_image_url),
          og_image_url = COALESCE(${ogUrl}, og_image_url),
          logo_url = COALESCE(${logoUrl}, logo_url),
          last_updated = NOW()
      WHERE id = ${schoolId}
    `;
    schoolsUpdated++;
  }

  console.log("Done. Updated", schoolsUpdated, "schools, inserted", mediaInserted, "image rows.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
