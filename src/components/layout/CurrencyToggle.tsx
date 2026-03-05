"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  type CurrencyCode,
  ALL_CURRENCY_CODES,
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
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded border border-warm-border bg-cream/80 px-2 py-1.5 text-[0.75rem] font-medium text-charcoal hover:border-charcoal-muted hover:bg-cream transition-colors"
        aria-label={`Currency: ${currency}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="tabular-nums">{currency}</span>
        <svg
          width="8"
          height="8"
          viewBox="0 0 10 10"
          className={`shrink-0 text-charcoal-muted/70 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
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
        <div
          role="listbox"
          aria-label="Select currency"
          className="absolute right-0 top-full mt-1 rounded border border-warm-border bg-warm-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] z-50 min-w-[160px] py-0.5 max-h-[min(70vh,280px)] overflow-y-auto"
        >
          {ALL_CURRENCY_CODES.map((code) => {
            const isSelected = code === currency;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isSelected}
                title={getCurrencyLabel(code)}
                onClick={() => {
                  setCurrency(code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[0.75rem] transition-colors min-h-[44px] sm:min-h-0 ${
                  isSelected
                    ? "bg-cream-200/80 text-charcoal font-medium"
                    : "text-charcoal-muted hover:bg-cream-100 hover:text-charcoal"
                }`}
              >
                <span className="min-w-0 flex-1">{code}</span>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 text-charcoal-muted" aria-hidden>
                    <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
