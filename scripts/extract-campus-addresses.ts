/**
 * Extracts every school campus (slug, name, address) for geocoding.
 * Run: npx tsx scripts/extract-campus-addresses.ts
 * Writes: scripts/campus-addresses.json
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { SCHOOL_PROFILES } from "../src/data/schools";

const outPath = join(__dirname, "campus-addresses.json");

const list: { slug: string; name: string; address: string }[] = [];

for (const [slug, profile] of Object.entries(SCHOOL_PROFILES)) {
  for (const campus of profile.campuses) {
    list.push({
      slug,
      name: campus.name,
      address: campus.address,
    });
  }
}

writeFileSync(outPath, JSON.stringify(list, null, 2), "utf-8");
console.log(`Wrote ${list.length} campuses to ${outPath}`);
