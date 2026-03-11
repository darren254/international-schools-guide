/**
 * Generate per-city batch files for Perplexity fee research.
 *
 * Each batch contains 10 schools with slug, name, and website,
 * plus a ready-to-paste prompt for Perplexity.
 *
 * Usage: npx tsx scripts/generate-fee-research-sheets.ts
 * Output: data/fee-research/<city>-batch-<n>.txt
 */

import * as fs from "fs";
import * as path from "path";

import { SINGAPORE_SCHOOLS } from "@/data/singapore-schools";
import { DUBAI_SCHOOLS } from "@/data/dubai-schools";
import { BANGKOK_SCHOOLS } from "@/data/bangkok-schools";
import { HONG_KONG_SCHOOLS } from "@/data/hong-kong-schools";
import { KUALA_LUMPUR_SCHOOLS } from "@/data/kuala-lumpur-schools";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";

type FeeEntry = {
  city: string;
  currency: string;
  source: string;
  sourceDate: string;
  feesAvailable: boolean;
  feeRows: { age: number; grade: string; amount: number }[];
  oneTimeFees: Record<string, number>;
};

type SchoolInfo = { slug: string; name: string; website: string };

const CITY_CONFIG: {
  slug: string;
  label: string;
  currency: string;
  schools: { slug: string; name: string; website?: string }[];
}[] = [
  { slug: "singapore", label: "Singapore", currency: "SGD", schools: SINGAPORE_SCHOOLS },
  { slug: "dubai", label: "Dubai", currency: "AED", schools: DUBAI_SCHOOLS },
  { slug: "bangkok", label: "Bangkok", currency: "THB", schools: BANGKOK_SCHOOLS },
  { slug: "hong-kong", label: "Hong Kong", currency: "HKD", schools: HONG_KONG_SCHOOLS },
  { slug: "kuala-lumpur", label: "Kuala Lumpur", currency: "MYR", schools: KUALA_LUMPUR_SCHOOLS },
  { slug: "jakarta", label: "Jakarta", currency: "IDR", schools: JAKARTA_SCHOOLS },
];

const BATCH_SIZE = 10;

function getWebsite(
  slug: string,
  listingWebsite: string | undefined,
  fees: Record<string, FeeEntry>,
  profileData: Record<string, { website: string }>
): string {
  return listingWebsite || profileData[slug]?.website || fees[slug]?.source || "";
}

function loadProfileWebsites(): Record<string, { website: string }> {
  const result: Record<string, { website: string }> = {};
  const profileFiles = [
    "src/data/singapore-school-profiles.ts",
    "src/data/dubai-school-profiles.ts",
    "src/data/bangkok-school-profiles.ts",
    "src/data/hong-kong-school-profiles.ts",
    "src/data/kuala-lumpur-school-profiles.ts",
  ];

  for (const file of profileFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) continue;
    const text = fs.readFileSync(fullPath, "utf-8");
    const slugRegex = /"([\w-]+)":\s*\{/g;
    let match: RegExpExecArray | null;
    const positions: { pos: number; slug: string }[] = [];
    while ((match = slugRegex.exec(text)) !== null) {
      positions.push({ pos: match.index, slug: match[1] });
    }
    for (let i = 0; i < positions.length; i++) {
      const { slug } = positions[i];
      const start = positions[i].pos;
      const end = i + 1 < positions.length ? positions[i + 1].pos : text.length;
      const block = text.slice(start, end);
      const web = block.match(/website:\s*"([^"]*)"/)?.[1] ?? "";
      result[slug] = { website: web };
    }
  }
  return result;
}

function generatePrompt(city: string, currency: string): string {
  return [
    `For each school listed below, find the current annual tuition fees per grade level, and any one-time/upfront fees (registration, enrolment, deposit, etc.).`,
    ``,
    `Return the data in this EXACT format — use the slug in square brackets exactly as shown:`,
    ``,
    `[slug] ANNUAL FEES:`,
    `- Grade Name: AMOUNT`,
    `- Grade Name: AMOUNT`,
    `[slug] ONE-TIME FEES:`,
    `- Fee Name: AMOUNT`,
    `[slug] SOURCE: url`,
    `[slug] YEAR: 2025-2026`,
    ``,
    `Rules:`,
    `- All amounts in ${currency} (no currency symbol needed, just the number)`,
    `- Use the school's own grade names (e.g. "Year 1", "Grade 7", "KG1")`,
    `- If fees are per term or per semester, convert to annual (multiply accordingly)`,
    `- If fees are not publicly available, write: [slug] FEES NOT AVAILABLE`,
    `- If one-time fees are not publicly available, omit the ONE-TIME FEES section entirely for that school`,
    `- Do NOT use international-schools-guide.com as a source — use the school's own website, official fee schedules, or government/regulatory sources (e.g. KHDA, MOE)`,
    `- Include the source URL and academic year`,
    ``,
    `---`,
    ``,
  ].join("\n");
}

function main() {
  const feesPath = path.join(process.cwd(), "data", "fees.json");
  const fees: Record<string, FeeEntry> = JSON.parse(fs.readFileSync(feesPath, "utf-8"));
  const profileData = loadProfileWebsites();

  const outDir = path.join(process.cwd(), "data", "fee-research");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let totalBatches = 0;

  for (const city of CITY_CONFIG) {
    const schools: SchoolInfo[] = city.schools
      .map((s) => ({
        slug: s.slug,
        name: s.name,
        website: getWebsite(s.slug, s.website, fees, profileData),
      }))
      .sort((a, b) => a.slug.localeCompare(b.slug));

    const batches: SchoolInfo[][] = [];
    for (let i = 0; i < schools.length; i += BATCH_SIZE) {
      batches.push(schools.slice(i, i + BATCH_SIZE));
    }

    for (let b = 0; b < batches.length; b++) {
      const batch = batches[b];
      const batchNum = b + 1;
      const filename = `${city.slug}-batch-${batchNum}.txt`;

      const lines: string[] = [];
      lines.push(generatePrompt(city.label, city.currency));
      lines.push(`CITY: ${city.label} — Batch ${batchNum} of ${batches.length} (${batch.length} schools)`);
      lines.push(`CURRENCY: ${city.currency}`);
      lines.push(``);

      for (let i = 0; i < batch.length; i++) {
        const s = batch[i];
        const webPart = s.website ? ` — ${s.website}` : "";
        lines.push(`${i + 1}. [${s.slug}] ${s.name}${webPart}`);
      }
      lines.push(``);

      fs.writeFileSync(path.join(outDir, filename), lines.join("\n"));
      totalBatches++;
    }

    console.log(`  ${city.label}: ${schools.length} schools → ${batches.length} batches`);
  }

  console.log(`\nTotal: ${totalBatches} batch files written to data/fee-research/`);
}

main();
