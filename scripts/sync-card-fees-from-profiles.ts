/**
 * Sync card fee display (feeRange, feeLowUsd, feeHighUsd) from profile fee data.
 * Compares each city's listing to the built profile fees and reports/updates mismatches.
 *
 * Run: npx tsx scripts/sync-card-fees-from-profiles.ts [--apply]
 * Without --apply: prints mismatches only.
 * With --apply: overwrites listing files with corrected fee fields.
 */

import * as fs from "fs";
import * as path from "path";
import { SINGAPORE_SCHOOLS } from "@/data/singapore-schools";
import { SINGAPORE_SCHOOL_PROFILES } from "@/data/singapore-schools-profiles";
import { DUBAI_SCHOOLS } from "@/data/dubai-schools";
import { DUBAI_SCHOOL_PROFILES } from "@/data/dubai-schools-profiles";
import { BANGKOK_SCHOOLS } from "@/data/bangkok-schools";
import { BANGKOK_SCHOOL_PROFILES } from "@/data/bangkok-schools-profiles";
import { HONG_KONG_SCHOOLS } from "@/data/hong-kong-schools";
import { HONG_KONG_SCHOOL_PROFILES } from "@/data/hong-kong-schools-profiles";
import { KUALA_LUMPUR_SCHOOLS } from "@/data/kuala-lumpur-schools";
import { KUALA_LUMPUR_SCHOOL_PROFILES } from "@/data/kuala-lumpur-schools-profiles";
import type { SchoolProfile } from "@/data/schools";

const RATES: Record<string, number> = {
  SGD: 1.34,
  AED: 3.67,
  THB: 35,
  HKD: 7.8,
  MYR: 4.5,
};

function expectedFromProfile(profile: SchoolProfile): { feeRange: string; feeLowUsd: number; feeHighUsd: number } {
  const rows = profile.fees?.rows ?? [];
  const currency = profile.fees?.feeCurrency ?? "USD";
  const rate = RATES[currency] ?? 1;

  if (rows.length === 0) {
    const note = (profile.fees?.note ?? "").toLowerCase();
    if (note.includes("per-term") || note.includes("per term") || note.includes("insworld")) {
      return { feeRange: "Per-term fees (see profile)", feeLowUsd: 0, feeHighUsd: 0 };
    }
    return { feeRange: "Contact school", feeLowUsd: 0, feeHighUsd: 0 };
  }

  const fallbackRow = rows[0]?.gradeLevel === "All grades" && rows.length === 1;
  if (fallbackRow && rows[0]) {
    const total = rows[0].totalStandard ?? 0;
    if (total <= 0) return { feeRange: "Contact school", feeLowUsd: 0, feeHighUsd: 0 };
    const usd = Math.round(total / rate);
    const k = Math.round(usd / 1000);
    return { feeRange: `US$${k}K – US$${k}K`, feeLowUsd: k * 1000, feeHighUsd: k * 1000 };
  }

  let minUsd = Infinity;
  let maxUsd = -Infinity;
  for (const r of rows) {
    const total = r.totalStandard ?? 0;
    if (total <= 0) continue;
    const usd = total / rate;
    minUsd = Math.min(minUsd, usd);
    maxUsd = Math.max(maxUsd, usd);
  }
  if (minUsd === Infinity || maxUsd === -Infinity) {
    return { feeRange: "Contact school", feeLowUsd: 0, feeHighUsd: 0 };
  }
  const lowK = Math.round(minUsd / 1000);
  const highK = Math.round(maxUsd / 1000);
  const feeRange = lowK === highK ? `US$${lowK}K` : `US$${lowK}K – US$${highK}K`;
  return {
    feeRange,
    feeLowUsd: lowK * 1000,
    feeHighUsd: highK * 1000,
  };
}

interface ListingRow {
  slug: string;
  name: string;
  feeRange: string;
  feeLowUsd: number;
  feeHighUsd: number;
}

function syncCity(
  city: string,
  listings: ListingRow[],
  profiles: Record<string, SchoolProfile>
): { slug: string; name: string; current: ListingRow; expected: { feeRange: string; feeLowUsd: number; feeHighUsd: number } }[] {
  const mismatches: { slug: string; name: string; current: ListingRow; expected: ReturnType<typeof expectedFromProfile> }[] = [];
  for (const list of listings) {
    const profile = profiles[list.slug];
    if (!profile) continue;
    const expected = expectedFromProfile(profile);
    const same =
      list.feeRange === expected.feeRange &&
      list.feeLowUsd === expected.feeLowUsd &&
      list.feeHighUsd === expected.feeHighUsd;
    if (!same) {
      // Skip applying 0/0 when listing has numbers (profile data may be incomplete)
      const wouldWipeToZero =
        expected.feeHighUsd === 0 &&
        expected.feeLowUsd === 0 &&
        expected.feeRange !== "Contact school" &&
        expected.feeRange !== "Per-term fees (see profile)" &&
        (list.feeLowUsd > 0 || list.feeHighUsd > 0);
      if (!wouldWipeToZero) {
        mismatches.push({ slug: list.slug, name: list.name, current: list, expected });
      }
    }
  }
  return mismatches;
}

function run() {
  const singapore = syncCity(
    "singapore",
    SINGAPORE_SCHOOLS.map((s) => ({ slug: s.slug, name: s.name, feeRange: s.feeRange, feeLowUsd: s.feeLowUsd, feeHighUsd: s.feeHighUsd })),
    SINGAPORE_SCHOOL_PROFILES
  );
  const dubai = syncCity(
    "dubai",
    DUBAI_SCHOOLS.map((s) => ({ slug: s.slug, name: s.name, feeRange: s.feeRange, feeLowUsd: s.feeLowUsd, feeHighUsd: s.feeHighUsd })),
    DUBAI_SCHOOL_PROFILES
  );
  const bangkok = syncCity(
    "bangkok",
    BANGKOK_SCHOOLS.map((s) => ({ slug: s.slug, name: s.name, feeRange: s.feeRange, feeLowUsd: s.feeLowUsd, feeHighUsd: s.feeHighUsd })),
    BANGKOK_SCHOOL_PROFILES
  );
  const hongKong = syncCity(
    "hong-kong",
    HONG_KONG_SCHOOLS.map((s) => ({ slug: s.slug, name: s.name, feeRange: s.feeRange, feeLowUsd: s.feeLowUsd, feeHighUsd: s.feeHighUsd })),
    HONG_KONG_SCHOOL_PROFILES
  );
  const kl = syncCity(
    "kuala-lumpur",
    KUALA_LUMPUR_SCHOOLS.map((s) => ({ slug: s.slug, name: s.name, feeRange: s.feeRange, feeLowUsd: s.feeLowUsd, feeHighUsd: s.feeHighUsd })),
    KUALA_LUMPUR_SCHOOL_PROFILES
  );

  const all = { singapore, dubai, bangkok, "hong-kong": hongKong, "kuala-lumpur": kl };
  let total = 0;
  for (const [city, arr] of Object.entries(all)) {
    if (arr.length > 0) {
      console.log(`\n${city.toUpperCase()} (${arr.length} mismatches):`);
      for (const m of arr) {
        console.log(
          `  ${m.slug}: "${m.current.feeRange}" ${m.current.feeLowUsd}/${m.current.feeHighUsd} → "${m.expected.feeRange}" ${m.expected.feeLowUsd}/${m.expected.feeHighUsd}`
        );
        total++;
      }
    }
  }
  console.log(`\nTotal mismatches: ${total}`);

  const apply = process.argv.includes("--apply");
  if (apply && total > 0) {
    const root = path.join(process.cwd(), "src", "data");
    const files: { path: string; mismatches: typeof singapore }[] = [
      { path: path.join(root, "singapore-schools.ts"), mismatches: singapore },
      { path: path.join(root, "dubai-schools.ts"), mismatches: dubai },
      { path: path.join(root, "bangkok-schools.ts"), mismatches: bangkok },
      { path: path.join(root, "hong-kong-schools.ts"), mismatches: hongKong },
      { path: path.join(root, "kuala-lumpur-schools.ts"), mismatches: kl },
    ];
    for (const { path: filePath, mismatches } of files) {
      if (mismatches.length === 0) continue;
      const lines = fs.readFileSync(filePath, "utf-8").split("\n");
      for (const m of mismatches) {
        const oldTriple = `feeRange: "${m.current.feeRange}", feeLowUsd: ${m.current.feeLowUsd}, feeHighUsd: ${m.current.feeHighUsd}`;
        const newTriple = `feeRange: "${m.expected.feeRange}", feeLowUsd: ${m.expected.feeLowUsd}, feeHighUsd: ${m.expected.feeHighUsd}`;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(`slug: "${m.slug}"`) && lines[i].includes(oldTriple)) {
            lines[i] = lines[i].replace(oldTriple, newTriple);
            break;
          }
        }
      }
      fs.writeFileSync(filePath, lines.join("\n"));
      console.log(`Wrote ${filePath} (${mismatches.length} updates)`);
    }
  }

  return all;
}

run();
