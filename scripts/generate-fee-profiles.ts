/**
 * Generate city *-school-profiles.ts files from data/fees.json (the single source of truth).
 *
 * Preserves non-fee fields (address, lat, lng, website, maxClassSize) from the existing
 * TypeScript files, and replaces feeRows + oneTimeFees with data from fees.json.
 *
 * Usage: npx tsx scripts/generate-fee-profiles.ts
 */

import * as fs from "fs";
import * as path from "path";

type FeeRow = { age: number; grade: string; amount: number };
type FeeEntry = {
  city: string;
  currency: string;
  source: string;
  sourceDate: string;
  feesAvailable: boolean;
  feeRows: FeeRow[];
  oneTimeFees: Record<string, number>;
};

type NonFeeData = {
  address: string;
  lat: number;
  lng: number;
  website: string;
  maxClassSize: string;
};

type CityConfig = {
  city: string;
  tsPath: string;
  interfaceName: string;
  exportName: string;
  rateName: string;
  rateValue: number;
  amountField: string;
  comment: string;
};

const CITIES: CityConfig[] = [
  {
    city: "singapore",
    tsPath: "src/data/singapore-school-profiles.ts",
    interfaceName: "SingaporeFeeData",
    exportName: "SINGAPORE_FEE_DATA",
    rateName: "SINGAPORE_RATE",
    rateValue: 1.34,
    amountField: "amount",
    comment: "Singapore school profile data: annual fees and one-time fees.",
  },
  {
    city: "dubai",
    tsPath: "src/data/dubai-school-profiles.ts",
    interfaceName: "DubaiFeeData",
    exportName: "DUBAI_FEE_DATA",
    rateName: "DUBAI_AED_TO_USD",
    rateValue: 3.67,
    amountField: "amountAed",
    comment: "Dubai school profile data: annual fees and one-time fees.",
  },
  {
    city: "bangkok",
    tsPath: "src/data/bangkok-school-profiles.ts",
    interfaceName: "BangkokFeeData",
    exportName: "BANGKOK_FEE_DATA",
    rateName: "BANGKOK_RATE",
    rateValue: 35.0,
    amountField: "amount",
    comment: "Bangkok school profile data: annual fees and one-time fees.",
  },
  {
    city: "hong-kong",
    tsPath: "src/data/hong-kong-school-profiles.ts",
    interfaceName: "HongKongFeeData",
    exportName: "HONG_KONG_FEE_DATA",
    rateName: "HONG_KONG_RATE",
    rateValue: 7.8,
    amountField: "amount",
    comment: "Hong Kong school profile data: annual fees and one-time fees.",
  },
  {
    city: "kuala-lumpur",
    tsPath: "src/data/kuala-lumpur-school-profiles.ts",
    interfaceName: "KualaLumpurFeeData",
    exportName: "KUALA_LUMPUR_FEE_DATA",
    rateName: "KUALA_LUMPUR_RATE",
    rateValue: 4.5,
    amountField: "amount",
    comment: "Kuala Lumpur school profile data: annual fees and one-time fees.",
  },
  {
    city: "jakarta",
    tsPath: "src/data/jakarta-school-profiles.ts",
    interfaceName: "JakartaFeeData",
    exportName: "JAKARTA_FEE_DATA",
    rateName: "JAKARTA_RATE",
    rateValue: 16000,
    amountField: "amount",
    comment: "Jakarta school profile data: annual fees and one-time fees.",
  },
];

function parseExistingNonFeeData(
  tsPath: string,
  amountField: string
): Record<string, NonFeeData> {
  const text = fs.readFileSync(tsPath, "utf-8");
  const result: Record<string, NonFeeData> = {};

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

    const addr = block.match(/address:\s*"([^"]*)"/)?.[1] ?? "";
    const lat = parseFloat(block.match(/lat:\s*([\d.-]+)/)?.[1] ?? "0");
    const lng = parseFloat(block.match(/lng:\s*([\d.-]+)/)?.[1] ?? "0");
    const web = block.match(/website:\s*"([^"]*)"/)?.[1] ?? "";
    const cls = block.match(/maxClassSize:\s*"([^"]*)"/)?.[1] ?? "";

    result[slug] = { address: addr, lat, lng, website: web, maxClassSize: cls };
  }

  return result;
}

function formatFeeRow(row: FeeRow, amountField: string): string {
  const amt = Math.round(row.amount);
  return `      { age: ${row.age}, grade: "${row.grade}", ${amountField}: ${amt} }`;
}

function formatOneTimeFees(fees: Record<string, number>): string {
  const entries = Object.entries(fees).filter(([, v]) => v > 0);
  if (entries.length === 0) return "{}";
  const parts = entries.map(([k, v]) => `"${k}": ${Math.round(v)}`);
  if (parts.join(", ").length < 80) {
    return `{${parts.join(", ")}}`;
  }
  return `{\n      ${parts.join(",\n      ")},\n    }`;
}

function generateCityFile(config: CityConfig, fees: Record<string, FeeEntry>): void {
  const fullPath = path.join(process.cwd(), config.tsPath);

  const existingNonFee = fs.existsSync(fullPath)
    ? parseExistingNonFeeData(fullPath, config.amountField)
    : {};

  const cityFees = Object.entries(fees)
    .filter(([, entry]) => entry.city === config.city)
    .sort(([a], [b]) => a.localeCompare(b));

  const lines: string[] = [];

  lines.push(`/**`);
  lines.push(` * ${config.comment}`);
  lines.push(` * AUTO-GENERATED from data/fees.json — do not edit manually.`);
  lines.push(` * Run: npx tsx scripts/generate-fee-profiles.ts`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`export const ${config.rateName} = ${config.rateValue};`);
  lines.push(``);
  lines.push(`export interface ${config.interfaceName} {`);
  lines.push(`  address: string;`);
  lines.push(`  lat: number;`);
  lines.push(`  lng: number;`);
  lines.push(`  website: string;`);
  lines.push(`  maxClassSize: string;`);
  lines.push(
    `  feeRows: { age: number; grade: string; ${config.amountField}: number }[];`
  );
  lines.push(`  oneTimeFees: Record<string, number>;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(
    `export const ${config.exportName}: Record<string, ${config.interfaceName}> = {`
  );

  for (const [slug, entry] of cityFees) {
    const nonFee = existingNonFee[slug] ?? {
      address: "",
      lat: 0,
      lng: 0,
      website: entry.source || "",
      maxClassSize: "",
    };

    lines.push(`  "${slug}": {`);
    lines.push(`    address: "${nonFee.address.replace(/"/g, '\\"')}",`);
    lines.push(`    lat: ${nonFee.lat},`);
    lines.push(`    lng: ${nonFee.lng},`);
    lines.push(`    website: "${nonFee.website}",`);
    lines.push(`    maxClassSize: "${nonFee.maxClassSize}",`);

    if (entry.feeRows.length > 0) {
      lines.push(`    feeRows: [`);
      for (const row of entry.feeRows) {
        lines.push(`${formatFeeRow(row, config.amountField)},`);
      }
      lines.push(`    ],`);
    } else {
      lines.push(`    feeRows: [],`);
    }

    lines.push(
      `    oneTimeFees: ${formatOneTimeFees(entry.oneTimeFees)},`
    );
    lines.push(`  },`);
  }

  lines.push(`};`);
  lines.push(``);

  fs.writeFileSync(fullPath, lines.join("\n"));
  console.log(
    `  ${config.city}: ${cityFees.length} schools → ${config.tsPath}`
  );
}

function main() {
  const feesPath = path.join(process.cwd(), "data", "fees.json");
  const fees: Record<string, FeeEntry> = JSON.parse(
    fs.readFileSync(feesPath, "utf-8")
  );

  console.log(`Loaded ${Object.keys(fees).length} entries from fees.json`);
  console.log(`Generating city fee profile files...`);

  for (const config of CITIES) {
    generateCityFile(config, fees);
  }

  console.log(`\nDone.`);
}

main();
