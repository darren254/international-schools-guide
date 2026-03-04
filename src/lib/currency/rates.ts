/**
 * Exchange rates: reads from rates.json (auto-updated by GitHub Action)
 * with hardcoded fallbacks so the site never breaks.
 */

import { type CurrencyCode, NON_USD_CODES } from "./currencies";
import ratesData from "./rates.json";

export type { CurrencyCode } from "./currencies";
export {
  CURRENCIES,
  ALL_CURRENCY_CODES,
  NON_USD_CODES,
  getCurrencySymbol,
  getCurrencyLabel,
  isValidCurrencyCode,
} from "./currencies";

const FALLBACK_RATES: Record<string, number> = {
  IDR: 16_800,
  AED: 3.67,
  SGD: 1.34,
  THB: 35.0,
  HKD: 7.8,
  MYR: 4.5,
  GBP: 0.79,
  EUR: 0.92,
  AUD: 1.55,
  JPY: 150,
  KRW: 1_380,
};

function loadRate(code: Exclude<CurrencyCode, "USD">): number {
  const live = (ratesData as { rates?: Record<string, number> }).rates?.[code];
  if (typeof live === "number" && live > 0) return live;
  return FALLBACK_RATES[code] ?? 1;
}

export const EXCHANGE_RATES: Record<Exclude<CurrencyCode, "USD">, number> =
  Object.fromEntries(NON_USD_CODES.map((c) => [c, loadRate(c)])) as Record<
    Exclude<CurrencyCode, "USD">,
    number
  >;

export const EXCHANGE_RATE_DATE: string =
  (ratesData as { date?: string }).date ?? "19 Feb 2026";

/** Convert an amount from one currency to another via USD as the pivot. */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (from === to) return amount;
  const amountUsd = from === "USD" ? amount : amount / EXCHANGE_RATES[from];
  if (to === "USD") return Math.round(amountUsd);
  return Math.round(amountUsd * EXCHANGE_RATES[to]);
}
