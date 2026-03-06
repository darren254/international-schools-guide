/**
 * Seed the `schools` (and `cities`) table from static data so the admin list is populated.
 * Run once after creating tables. Safe to re-run (upserts by slug).
 *
 * Usage: npx tsx scripts/seed-schools-from-static.ts
 * Requires: DATABASE_URL in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { SCHOOL_PROFILES } from "../src/data/schools";
import type { SchoolProfile } from "../src/data/schools";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set. Add it to .env.local");
  process.exit(1);
}

const sql = neon(url);

const CITY_SLUGS = [
  "jakarta",
  "dubai",
  "singapore",
  "bangkok",
  "hong-kong",
  "kuala-lumpur",
] as const;

function citySlugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function profileToRow(p: SchoolProfile) {
  const intelligenceSummary =
    p.intelligence?.paragraphs?.length > 0
      ? p.intelligence.paragraphs.join("\n\n").slice(0, 5000)
      : null;
  const headBio = p.head?.bio ?? null;
  const headName = p.head?.name ?? null;
  const headSince = p.head?.since ?? null;
  const inspection = p.studentBody?.inspection;
  const lastInspected =
    inspection?.date && /^\d{4}-\d{2}-\d{2}$/.test(inspection.date)
      ? inspection.date
      : null;
  return {
    id: crypto.randomUUID(),
    name: p.name,
    slug: p.slug,
    city_slug: p.citySlug || null,
    meta_title: p.metaTitle || null,
    meta_description: p.metaDescription || null,
    phone: p.contact?.phone || null,
    email: p.contact?.email || null,
    website: p.contact?.website || null,
    head_name: headName,
    head_since: headSince,
    head_bio: headBio,
    head_credentials: null,
    intelligence_summary: intelligenceSummary,
    verified_status: p.verified ?? false,
    published: true,
    student_count: p.stats?.find((s) => s.label === "Students")?.value ?? null,
    age_range: p.stats?.find((s) => s.label === "Ages")?.value ?? null,
    curriculum: p.curricula?.length ? p.curricula : null,
    uniform_required: p.schoolLife?.uniformRequired ?? null,
    activities_count: p.schoolLife?.activitiesCount ?? null,
    facilities: p.schoolLife?.facilities?.length ? p.schoolLife.facilities : null,
    school_life_description:
      p.schoolLife?.paragraphs?.length > 0
        ? p.schoolLife.paragraphs.join("\n\n").slice(0, 5000)
        : null,
    academic_description:
      p.academics?.paragraphs?.length > 0
        ? p.academics.paragraphs.join("\n\n").slice(0, 5000)
        : null,
    student_body_description:
      p.studentBody?.paragraphs?.length > 0
        ? p.studentBody.paragraphs.join("\n\n").slice(0, 5000)
        : null,
    last_inspected: lastInspected,
    inspection_body: inspection?.body ?? null,
    inspection_rating: inspection?.rating ?? null,
    inspection_findings: inspection?.findings ?? null,
    address_full:
      p.campuses?.length > 0 ? p.campuses[0].address : null,
    latitude: p.campuses?.length > 0 ? String(p.campuses[0].lat) : null,
    longitude: p.campuses?.length > 0 ? String(p.campuses[0].lng) : null,
  };
}

async function main() {
  // 1. Ensure cities exist
  for (const slug of CITY_SLUGS) {
    const name = citySlugToName(slug);
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO cities (id, name, slug)
      VALUES (${id}, ${name}, ${slug})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("Cities OK:", CITY_SLUGS.length);

  // 2. Upsert schools (batch in chunks to avoid timeouts)
  const profiles = Object.values(SCHOOL_PROFILES);
  const chunkSize = 50;
  let inserted = 0;
  for (let i = 0; i < profiles.length; i += chunkSize) {
    const chunk = profiles.slice(i, i + chunkSize);
    for (const p of chunk) {
      const r = profileToRow(p);
      await sql`
        INSERT INTO schools (
          id, name, slug, city_slug,
          meta_title, meta_description, phone, email, website,
          head_name, head_since, head_bio, head_credentials,
          intelligence_summary, verified_status, published,
          student_count, age_range, curriculum, uniform_required, activities_count,
          facilities, school_life_description, academic_description, student_body_description,
          last_inspected, inspection_body, inspection_rating, inspection_findings,
          address_full, latitude, longitude
        )
        VALUES (
          ${r.id}, ${r.name}, ${r.slug}, ${r.city_slug},
          ${r.meta_title}, ${r.meta_description}, ${r.phone}, ${r.email}, ${r.website},
          ${r.head_name}, ${r.head_since}, ${r.head_bio}, ${r.head_credentials},
          ${r.intelligence_summary}, ${r.verified_status}, ${r.published},
          ${r.student_count}, ${r.age_range}, ${r.curriculum}, ${r.uniform_required}, ${r.activities_count},
          ${r.facilities}, ${r.school_life_description}, ${r.academic_description}, ${r.student_body_description},
          ${r.last_inspected}, ${r.inspection_body}, ${r.inspection_rating}, ${r.inspection_findings},
          ${r.address_full}, ${r.latitude}, ${r.longitude}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          city_slug = EXCLUDED.city_slug,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          website = EXCLUDED.website,
          head_name = EXCLUDED.head_name,
          head_since = EXCLUDED.head_since,
          head_bio = EXCLUDED.head_bio,
          head_credentials = EXCLUDED.head_credentials,
          intelligence_summary = EXCLUDED.intelligence_summary,
          verified_status = EXCLUDED.verified_status,
          published = EXCLUDED.published,
          student_count = EXCLUDED.student_count,
          age_range = EXCLUDED.age_range,
          curriculum = EXCLUDED.curriculum,
          uniform_required = EXCLUDED.uniform_required,
          activities_count = EXCLUDED.activities_count,
          facilities = EXCLUDED.facilities,
          school_life_description = EXCLUDED.school_life_description,
          academic_description = EXCLUDED.academic_description,
          student_body_description = EXCLUDED.student_body_description,
          last_inspected = EXCLUDED.last_inspected,
          inspection_body = EXCLUDED.inspection_body,
          inspection_rating = EXCLUDED.inspection_rating,
          inspection_findings = EXCLUDED.inspection_findings,
          address_full = EXCLUDED.address_full,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          last_updated = NOW()
      `;
      inserted++;
    }
    console.log("Schools:", inserted, "/", profiles.length);
  }

  console.log("Done. Seeded", inserted, "schools. Open /admin/schools to see the list.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
