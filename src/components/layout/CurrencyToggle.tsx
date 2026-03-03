"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  type CurrencyCode,
  ALL_CURRENCY_CODES,
  getCurrencySymbol,
  getCurrencyLabel,
} from "@/lib/currency/rates";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-charcoal-muted border border-warm-border px-2 sm:px-3 py-1.5 hover:border-charcoal-muted transition-colors"
        aria-label={`Currency: ${currency}. Click to change.`}
        aria-expanded={open}
      >
        <span className="font-medium">{currency}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-warm-white border border-warm-border shadow-lg z-50 min-w-[200px] py-1">
          {ALL_CURRENCY_CODES.map((code) => (
            <button
              key={code}
              onClick={() => {
                setCurrency(code);
                setOpen(false);
              }}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition-colors ${
                code === currency
                  ? "bg-cream-200 text-charcoal font-medium"
                  : "text-charcoal-light hover:bg-cream-100"
              }`}
            >
              <span>
                <span className="inline-block w-10 text-charcoal-muted">
                  {getCurrencySymbol(code)}
                </span>
                {code}
              </span>
              <span className="text-xs text-charcoal-muted ml-3 hidden sm:inline">
                {getCurrencyLabel(code)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
