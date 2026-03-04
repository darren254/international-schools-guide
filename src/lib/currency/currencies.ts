/**
 * Single source of truth for all supported currencies.
 * To add a new city's currency, add one entry here — everything else
 * (toggle, fetch script, types, formatting) derives from this registry.
 */

export const CURRENCIES = {
  USD: { symbol: "US$", label: "US Dollar", city: null },
  GBP: { symbol: "£", label: "British Pound", city: null },
  EUR: { symbol: "€", label: "Euro", city: null },
  AUD: { symbol: "A$", label: "Australian Dollar", city: null },
  JPY: { symbol: "¥", label: "Japanese Yen", city: null },
  KRW: { symbol: "₩", label: "South Korean Won", city: null },
  IDR: { symbol: "Rp", label: "Indonesian Rupiah", city: "jakarta" },
  AED: { symbol: "AED", label: "UAE Dirham", city: "dubai" },
  SGD: { symbol: "S$", label: "Singapore Dollar", city: "singapore" },
  THB: { symbol: "฿", label: "Thai Baht", city: "bangkok" },
  HKD: { symbol: "HK$", label: "Hong Kong Dollar", city: "hong-kong" },
  MYR: { symbol: "RM", label: "Malaysian Ringgit", city: "kuala-lumpur" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const ALL_CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export const NON_USD_CODES = ALL_CURRENCY_CODES.filter(
  (c): c is Exclude<CurrencyCode, "USD"> => c !== "USD",
);

export function getCurrencySymbol(code: CurrencyCode): string {
  return CURRENCIES[code].symbol;
}

export function getCurrencyLabel(code: CurrencyCode): string {
  return CURRENCIES[code].label;
}

export function isValidCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCIES;
}
