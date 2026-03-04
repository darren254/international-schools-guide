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
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-sm border border-warm-border bg-cream px-3 py-2 text-[0.8125rem] font-body text-charcoal hover:border-charcoal-muted hover:bg-cream-100 transition-colors min-h-[36px]"
        aria-label={`Currency: ${currency}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="font-semibold tabular-nums">{currency}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`shrink-0 text-charcoal-muted transition-transform ${open ? "rotate-180" : ""}`}
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
          className="absolute right-0 top-full mt-1.5 rounded-sm border border-warm-border bg-warm-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-50 min-w-[240px] py-1 max-h-[min(70vh,320px)] overflow-y-auto"
        >
          {ALL_CURRENCY_CODES.map((code) => {
            const isSelected = code === currency;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setCurrency(code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "bg-hermes-light/15 text-hermes border-l-2 border-hermes"
                    : "text-charcoal hover:bg-cream-100 border-l-2 border-transparent"
                }`}
              >
                <span className="w-8 shrink-0 text-[0.8125rem] text-charcoal-muted tabular-nums">
                  {getCurrencySymbol(code)}
                </span>
                <span
                  className={`min-w-0 flex-1 font-body text-[0.8125rem] ${
                    isSelected ? "font-semibold" : "font-medium"
                  }`}
                >
                  {code}
                </span>
                <span className="hidden shrink-0 text-[0.75rem] text-charcoal-muted sm:block">
                  {getCurrencyLabel(code)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
