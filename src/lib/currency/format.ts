import { type CurrencyCode, getCurrencySymbol, convertCurrency } from "./rates";

type FormatOpts = {
  compact?: boolean;
};

/**
 * Format a monetary amount in the given display currency.
 * `amount` is in `sourceCurrency`; it will be converted to `displayCurrency` first.
 */
export function formatMoney(
  amount: number,
  sourceCurrency: CurrencyCode,
  displayCurrency: CurrencyCode,
  opts?: FormatOpts,
): string {
  const converted = convertCurrency(amount, sourceCurrency, displayCurrency);
  return formatRaw(converted, displayCurrency, opts);
}

/** Format an amount already in the target currency. */
export function formatRaw(
  amount: number,
  currency: CurrencyCode,
  opts?: FormatOpts,
): string {
  const sym = getCurrencySymbol(currency);

  if (opts?.compact) {
    return formatCompact(amount, currency);
  }

  if (currency === "IDR") {
    if (amount >= 1_000_000) {
      return `Rp ${(amount / 1_000_000).toFixed(0)}M`;
    }
    return `Rp ${amount.toLocaleString("en-US")}`;
  }

  return `${sym}${amount.toLocaleString("en-US")}`;
}

/** Compact format: US$23K, AED 67K, Rp 242M, etc. */
function formatCompact(amount: number, currency: CurrencyCode): string {
  const sym = getCurrencySymbol(currency);

  if (currency === "IDR") {
    if (amount >= 1_000_000) {
      const m = amount / 1_000_000;
      return `Rp ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
    }
    return `Rp ${Math.round(amount / 1000)}K`;
  }

  if (amount >= 1000) {
    const k = amount / 1000;
    return `${sym}${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `${sym}${amount.toLocaleString("en-US")}`;
}

/**
 * Build a fee range string like "US$23K – US$37K" from low/high in source currency.
 */
export function formatFeeRange(
  low: number,
  high: number,
  sourceCurrency: CurrencyCode,
  displayCurrency: CurrencyCode,
): string {
  const lo = convertCurrency(low, sourceCurrency, displayCurrency);
  const hi = convertCurrency(high, sourceCurrency, displayCurrency);
  return `${formatRaw(lo, displayCurrency, { compact: true })} – ${formatRaw(hi, displayCurrency, { compact: true })}`;
}
