/**
 * Fetch latest exchange rates from Open Exchange Rates and write to rates.json.
 * Run manually: OXR_APP_ID=xxx npx tsx scripts/fetch-exchange-rates.ts
 * Run via GitHub Action: .github/workflows/update-exchange-rates.yml
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

const CURRENCIES_TO_FETCH = [
  "IDR", "AED", "SGD", "THB", "HKD", "MYR", "GBP", "EUR", "AUD", "JPY", "KRW",
];

const OXR_APP_ID = process.env.OXR_APP_ID;
if (!OXR_APP_ID) {
  console.error("Missing OXR_APP_ID environment variable.");
  console.error("Get a free key at https://openexchangerates.org/signup/free");
  process.exit(1);
}

const SYMBOLS = CURRENCIES_TO_FETCH.join(",");
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${OXR_APP_ID}&symbols=${SYMBOLS}`;
const OUTPUT_PATH = resolve(__dirname, "../src/lib/currency/rates.json");

async function main() {
  console.log(`Fetching rates for: ${SYMBOLS}`);
  const res = await fetch(API_URL);

  if (!res.ok) {
    console.error(`API error: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.error(body);
    process.exit(1);
  }

  const data = await res.json() as {
    timestamp: number;
    base: string;
    rates: Record<string, number>;
  };

  const date = new Date(data.timestamp * 1000).toISOString().slice(0, 10);

  const output = {
    date,
    base: "USD",
    rates: Object.fromEntries(
      CURRENCIES_TO_FETCH.map((code) => {
        const rate = data.rates[code];
        if (typeof rate !== "number" || rate <= 0) {
          console.warn(`Warning: missing or invalid rate for ${code}, skipping`);
          return [code, null];
        }
        return [code, Math.round(rate * 10000) / 10000];
      }).filter(([, v]) => v !== null),
    ),
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`Date: ${date}`);
  console.log(`Rates:`, output.rates);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
