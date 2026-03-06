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
  console.log("Done. Admin tables ready. Run: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=xxx npx tsx scripts/seed-admin-user.ts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
