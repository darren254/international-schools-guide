/**
 * List schools that are in the Neon DB but not in static SCHOOL_PROFILES (code).
 * These will 404 when linked from admin or any URL using the DB slug.
 *
 * Usage: npx tsx scripts/list-schools-missing-profiles.ts
 * Requires: DATABASE_URL in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { ALL_SCHOOL_SLUGS } from "../src/data/schools";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL required (e.g. in .env.local)");
    process.exit(1);
  }

  const sql = neon(url);
  const rows = (await sql`
    SELECT slug, name, city_slug
    FROM schools
    WHERE slug IS NOT NULL
    ORDER BY city_slug, name
  `) as { slug: string; name: string; city_slug: string | null }[];

  const codeSlugs = new Set(ALL_SCHOOL_SLUGS);
  const dbSlugs = new Set(rows.map((r) => r.slug));

  const inDbNotInCode = rows.filter((r) => !codeSlugs.has(r.slug));
  const inCodeNotInDb = ALL_SCHOOL_SLUGS.filter((s) => !dbSlugs.has(s));

  if (inDbNotInCode.length > 0) {
    console.log("\nIn DB but NOT in code (profile page will 404):");
    inDbNotInCode.forEach((r) =>
      console.log(`  ${r.slug}  ${r.name}  (city: ${r.city_slug ?? "—"})`)
    );
  } else {
    console.log("\nAll DB schools have a profile in code.");
  }

  if (inCodeNotInDb.length > 0) {
    console.log("\nIn code but NOT in DB:");
    inCodeNotInDb.forEach((s) => console.log(`  ${s}`));
  } else {
    console.log("\nAll code profiles exist in DB.");
  }

  console.log(
    "\nSummary:",
    rows.length,
    "in DB,",
    ALL_SCHOOL_SLUGS.length,
    "in code;",
    inDbNotInCode.length,
    "DB-only (404 if linked),",
    inCodeNotInDb.length,
    "code-only."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
