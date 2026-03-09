/**
 * Write a CSV of all schools (city, name, slug) to docs/all-schools.csv.
 * Run: npx tsx scripts/export-all-schools-csv.ts
 */

import * as fs from "fs";
import * as path from "path";
import { LIVE_CITIES } from "../src/data/cities";
import { SINGAPORE_SCHOOLS } from "../src/data/singapore-schools";
import { HONG_KONG_SCHOOLS } from "../src/data/hong-kong-schools";
import { DUBAI_SCHOOLS } from "../src/data/dubai-schools";
import { KUALA_LUMPUR_SCHOOLS } from "../src/data/kuala-lumpur-schools";
import { JAKARTA_SCHOOLS } from "../src/data/jakarta-schools";
import { BANGKOK_SCHOOLS } from "../src/data/bangkok-schools";

const bySlug: Record<string, { name: string; slug: string }[]> = {
  singapore: SINGAPORE_SCHOOLS.map((s) => ({ name: s.name, slug: s.slug })),
  "hong-kong": HONG_KONG_SCHOOLS.map((s) => ({ name: s.name, slug: s.slug })),
  dubai: DUBAI_SCHOOLS.map((s) => ({ name: s.name, slug: s.slug })),
  "kuala-lumpur": KUALA_LUMPUR_SCHOOLS.map((s) => ({ name: s.name, slug: s.slug })),
  jakarta: JAKARTA_SCHOOLS.map((s) => ({ name: s.name, slug: s.slug })),
  bangkok: BANGKOK_SCHOOLS.map((s) => ({ name: s.name, slug: s.slug })),
};

function escapeCsv(s: string): string {
  if (!/[\n",]/.test(s)) return s;
  return `"${s.replace(/"/g, '""')}"`;
}

function main() {
  const outPath = path.join(process.cwd(), "docs/all-schools.csv");
  const rows: string[] = ["City,School Name,Slug"];
  for (const c of LIVE_CITIES) {
    const schools = bySlug[c.slug] ?? [];
    for (const s of schools) {
      rows.push([c.name, s.name, s.slug].map(escapeCsv).join(","));
    }
  }
  fs.writeFileSync(outPath, rows.join("\n") + "\n", "utf-8");
  console.log("Wrote", outPath, "—", rows.length - 1, "schools");
}

main();
