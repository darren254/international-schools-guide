/**
 * List school profiles that have no main image (profile or card).
 *
 * Uses the same logic as the UI: getSchoolImageUrl(slug, "profile") so the
 * manifest alias (e.g. sekolah-cita-buana → cita-buana-school) is respected.
 *
 *   npx tsx scripts/list-schools-missing-images.ts
 *   npx tsx scripts/list-schools-missing-images.ts --json
 */

import { SCHOOL_PROFILES, ALL_SCHOOL_SLUGS } from "../src/data/schools";
import { getSchoolImageUrl } from "../src/lib/schools/images";

type MissingEntry = { slug: string; citySlug: string };

function run(): void {
  const missing: MissingEntry[] = [];

  for (const slug of ALL_SCHOOL_SLUGS) {
    const profileUrl = getSchoolImageUrl(slug, "profile");
    if (profileUrl === undefined) {
      const profile = SCHOOL_PROFILES[slug];
      const citySlug = profile?.citySlug ?? "jakarta";
      missing.push({ slug, citySlug });
    }
  }

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ count: missing.length, schools: missing }, null, 2));
    return;
  }

  // Group by city for readable output
  const byCity = new Map<string, string[]>();
  for (const { slug, citySlug } of missing) {
    const list = byCity.get(citySlug) ?? [];
    list.push(slug);
    byCity.set(citySlug, list);
  }

  const cityOrder = ["jakarta", "singapore", "dubai", "bangkok", "hong-kong", "kuala-lumpur"];
  const orderedCities = [
    ...cityOrder.filter((c) => byCity.has(c)),
    ...[...byCity.keys()].filter((c) => !cityOrder.includes(c)),
  ];

  console.log(`Schools without any main image: ${missing.length}\n`);

  for (const city of orderedCities) {
    const slugs = byCity.get(city)!;
    const label = city.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    console.log(`${label} (${slugs.length})`);
    for (const slug of slugs.sort()) {
      console.log(`  - ${slug}`);
    }
    console.log("");
  }
}

run();
