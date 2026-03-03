"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type CurrencyCode,
  EXCHANGE_RATE_DATE,
  convertCurrency,
  isValidCurrencyCode,
} from "@/lib/currency/rates";
import { formatMoney, formatRaw, formatFeeRange } from "@/lib/currency/format";

const STORAGE_KEY = "isg-currency";
const DEFAULT_CURRENCY: CurrencyCode = "USD";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  /** Format an amount stored in `sourceCurrency` into the user's display currency. */
  fmt: (amount: number, sourceCurrency: CurrencyCode, opts?: { compact?: boolean }) => string;
  /** Format a fee range (low/high in sourceCurrency) into the user's display currency. */
  fmtRange: (low: number, high: number, sourceCurrency: CurrencyCode) => string;
  /** Convert an amount from sourceCurrency to the user's display currency (numeric). */
  convert: (amount: number, sourceCurrency: CurrencyCode) => number;
  exchangeRateDate: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function loadCurrency(): CurrencyCode {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isValidCurrencyCode(raw)) return raw;
  } catch {
    // ignore
  }
  return DEFAULT_CURRENCY;
}

function saveCurrency(c: CurrencyCode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, c);
  } catch {
    // ignore
  }
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCurrencyState(loadCurrency());
    setHydrated(true);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    saveCurrency(c);
  }, []);

  const fmt = useCallback(
    (amount: number, sourceCurrency: CurrencyCode, opts?: { compact?: boolean }) =>
      formatMoney(amount, sourceCurrency, currency, opts),
    [currency],
  );

  const fmtRange = useCallback(
    (low: number, high: number, sourceCurrency: CurrencyCode) =>
      formatFeeRange(low, high, sourceCurrency, currency),
    [currency],
  );

  const convert = useCallback(
    (amount: number, sourceCurrency: CurrencyCode) =>
      convertCurrency(amount, sourceCurrency, currency),
    [currency],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      fmt,
      fmtRange,
      convert,
      exchangeRateDate: EXCHANGE_RATE_DATE,
    }),
    [currency, setCurrency, fmt, fmtRange, convert],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export function useCurrencyOptional(): CurrencyContextValue | null {
  return useContext(CurrencyContext);
}
