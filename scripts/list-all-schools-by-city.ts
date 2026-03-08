/**
 * One-off: print every school in every live city to stdout.
 * Run: npx tsx scripts/list-all-schools-by-city.ts
 */

import { LIVE_CITIES } from "../src/data/cities";
import { SINGAPORE_SCHOOLS } from "../src/data/singapore-schools";
import { HONG_KONG_SCHOOLS } from "../src/data/hong-kong-schools";
import { DUBAI_SCHOOLS } from "../src/data/dubai-schools";
import { KUALA_LUMPUR_SCHOOLS } from "../src/data/kuala-lumpur-schools";
import { JAKARTA_SCHOOLS } from "../src/data/jakarta-schools";
import { BANGKOK_SCHOOLS } from "../src/data/bangkok-schools";

const bySlug: Record<string, { name: string }[]> = {
  singapore: SINGAPORE_SCHOOLS,
  "hong-kong": HONG_KONG_SCHOOLS,
  dubai: DUBAI_SCHOOLS,
  "kuala-lumpur": KUALA_LUMPUR_SCHOOLS,
  jakarta: JAKARTA_SCHOOLS,
  bangkok: BANGKOK_SCHOOLS,
};

function main() {
  const lines: string[] = ["# Every school in every city", ""];
  let total = 0;
  for (const c of LIVE_CITIES) {
    const schools = bySlug[c.slug] ?? [];
    total += schools.length;
    lines.push(`## ${c.name} (${schools.length} schools)`);
    lines.push("");
    for (const s of schools) {
      lines.push(`- ${s.name}`);
    }
    lines.push("");
  }
  lines.push(`**Total: ${total} schools across ${LIVE_CITIES.length} cities.**`);
  console.log(lines.join("\n"));
}

main();
