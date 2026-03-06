/**
 * Create admin tables if they don't exist. Run once instead of interactive db:push.
 * Usage: npx tsx scripts/create-admin-tables.ts
 * Requires DATABASE_URL in .env.local (drizzle.config loads it for other scripts; this one loads dotenv).
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set. Add it to .env.local");
  process.exit(1);
}

const sql = neon(url);

const statements = [
  `CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" varchar PRIMARY KEY NOT NULL,
    "email" varchar(255) NOT NULL,
    "password_hash" varchar(255) NOT NULL,
    "password_salt" varchar(64) NOT NULL,
    "created_at" timestamp DEFAULT now(),
    CONSTRAINT "admin_users_email_unique" UNIQUE("email")
  )`,
  `CREATE TABLE IF NOT EXISTS "admin_sessions" (
    "id" varchar PRIMARY KEY NOT NULL,
    "user_id" varchar(255) NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "school_media" (
    "id" varchar PRIMARY KEY NOT NULL,
    "school_id" varchar(255) NOT NULL,
    "variant" varchar(30) NOT NULL,
    "url" varchar(500) NOT NULL,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "cities" (
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL,
    "country" varchar(100),
    "description" text,
    "meta_title" varchar(255),
    "meta_description" text,
    "center_latitude" numeric(10, 8),
    "center_longitude" numeric(11, 8),
    "map_zoom" integer DEFAULT 11,
    "created_at" timestamp DEFAULT now(),
    CONSTRAINT "cities_slug_unique" UNIQUE("slug")
  )`,
  `CREATE TABLE IF NOT EXISTS "schools" (
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL,
    "city_slug" varchar(255),
    "address_full" text,
    "latitude" numeric(10, 8),
    "longitude" numeric(11, 8),
    "nearest_mrt" varchar(255),
    "phone" varchar(50),
    "email" varchar(255),
    "website" varchar(255),
    "student_count" varchar(50),
    "age_range" varchar(50),
    "curriculum" text[],
    "accreditation" text[],
    "founded_year" integer,
    "school_type" varchar(100),
    "fee_system_type" varchar(20),
    "fee_currency" varchar(3) DEFAULT 'IDR',
    "application_fee" integer,
    "enrollment_fee" integer,
    "head_name" varchar(255),
    "head_since" integer,
    "head_bio" text,
    "head_photo_url" varchar(500),
    "head_credentials" varchar(500),
    "nationalities_count" integer,
    "nationalities_description" text,
    "gender_split" varchar(50),
    "student_body_description" text,
    "academic_description" text,
    "school_hours" varchar(100),
    "uniform_required" boolean,
    "activities_count" integer,
    "facilities" text[],
    "school_life_description" text,
    "intelligence_summary" text,
    "intelligence_positives" text[],
    "intelligence_considerations" text[],
    "intelligence_updated_at" timestamp,
    "last_inspected" date,
    "inspection_body" varchar(255),
    "inspection_rating" varchar(100),
    "inspection_findings" text,
    "hero_image_url" varchar(500),
    "og_image_url" varchar(500),
    "logo_url" varchar(500),
    "gallery_images" text[],
    "verified_status" boolean DEFAULT false,
    "verified_date" date,
    "verified_content" text,
    "verified_content_updated_at" timestamp,
    "is_premium" boolean DEFAULT false,
    "published" boolean DEFAULT true,
    "last_updated" timestamp DEFAULT now(),
    "created_at" timestamp DEFAULT now(),
    "meta_title" varchar(255),
    "meta_description" text,
    CONSTRAINT "schools_slug_unique" UNIQUE("slug")
  )`,
];

async function main() {
  for (const stmt of statements) {
    await sql([stmt] as unknown as TemplateStringsArray);
    const table = stmt.match(/CREATE TABLE IF NOT EXISTS "(\w+)"/)?.[1] ?? "?";
    console.log("OK:", table);
  }
  // Add FK for admin_sessions -> admin_users if not present (ignore error if exists)
  try {
    await sql([`ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action`] as unknown as TemplateStringsArray);
    console.log("OK: admin_sessions FK");
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "42710") {
      // duplicate constraint
    } else throw e;
  }
  try {
    await sql([`ALTER TABLE "schools" ADD CONSTRAINT "schools_city_slug_cities_slug_fk" FOREIGN KEY ("city_slug") REFERENCES "public"."cities"("slug") ON DELETE no action ON UPDATE no action`] as unknown as TemplateStringsArray);
    console.log("OK: schools FK");
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "42710") {
      // duplicate constraint
    } else throw e;
  }
  console.log("Done. Admin tables ready. Run sync-schools-from-db or a seed script to populate schools.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
