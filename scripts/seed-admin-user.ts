/**
 * Create the first admin user (run once after migration).
 * Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npx tsx scripts/seed-admin-user.ts
 * Uses PBKDF2-SHA256 (same as Worker login) so the hash is compatible.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { randomBytes, pbkdf2Sync } from "crypto";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD");
  process.exit(1);
}

const salt = randomBytes(16).toString("base64");
const hash = pbkdf2Sync(password, Buffer.from(salt, "base64"), 100000, 32, "sha256").toString("base64");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO admin_users (id, email, password_hash, password_salt)
    VALUES (${id}, ${email}, ${hash}, ${salt})
    ON CONFLICT (email) DO UPDATE SET password_hash = ${hash}, password_salt = ${salt}
  `;
  console.log("Admin user upserted:", email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
