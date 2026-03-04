"use client";

import { useState } from "react";

export type FeeSortValue = "high-low" | "low-high";

const OPTIONS: { value: FeeSortValue; label: string }[] = [
  { value: "high-low", label: "Fees: High → Low" },
  { value: "low-high", label: "Fees: Low → High" },
];

type SortDropdownProps = {
  value: FeeSortValue;
  onChange: (value: FeeSortValue) => void;
};

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentLabel = OPTIONS.find((o) => o.value === value)?.label ?? OPTIONS[0].label;

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-[0.8125rem] font-body rounded-sm border border-warm-border text-charcoal hover:border-charcoal-muted transition-colors bg-cream"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Sort by fees. Current: ${currentLabel}. Click to change.`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 7l4-4 4 4M5 11l4 4 4-4" />
        </svg>
        <span>{currentLabel}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
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
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            className="absolute top-full left-0 mt-1 bg-warm-white border border-warm-border rounded-sm shadow-lg z-20 min-w-[200px] py-1"
          >
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-[0.8125rem] font-body text-left transition-colors ${
                  value === opt.value
                    ? "bg-hermes-light/20 text-hermes"
                    : "hover:bg-cream-200 text-charcoal"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
