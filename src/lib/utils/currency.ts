/**
 * Currency conversion utilities.
 * Exchange rate updated weekly — see exchangeRates table.
 * Display note: "Exchange rate updated [date]"
 */

// Hardcoded fallback rate — overridden by DB value at runtime
const FALLBACK_IDR_USD = 16800;

export type SupportedCurrency = "USD" | "IDR" | "SGD" | "GBP" | "EUR" | "AUD";

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = "USD",
  opts?: { compact?: boolean }
): string {
  if (opts?.compact && currency === "USD") {
    if (amount >= 1000) {
      return `US$${Math.round(amount / 1000)}K`;
    }
    return `US$${amount.toLocaleString("en-US")}`;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(amount);

  // Prefer "US$" over "$" for clarity in international context
  if (currency === "USD") {
    return formatted.replace("$", "US$");
  }

  return formatted;
}

export function convertIDRtoUSD(
  amountIDR: number,
  rate?: number
): number {
  const exchangeRate = rate || FALLBACK_IDR_USD;
  return Math.round(amountIDR / exchangeRate);
}

export function formatFeeRange(
  lowIDR: number,
  highIDR: number,
  currency: SupportedCurrency = "USD",
  rate?: number
): string {
  if (currency === "IDR") {
    return `IDR ${(lowIDR / 1_000_000).toFixed(0)}M – IDR ${(highIDR / 1_000_000).toFixed(0)}M`;
  }

  const lowUSD = convertIDRtoUSD(lowIDR, rate);
  const highUSD = convertIDRtoUSD(highIDR, rate);
  return `${formatCurrency(lowUSD, "USD", { compact: true })} – ${formatCurrency(highUSD, "USD", { compact: true })}`;
}

export function formatExchangeRateDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
