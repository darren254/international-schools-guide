"use client";

import { useState } from "react";

export type FilterDropdownOption = { value: string; label: string };

type FilterDropdownMultiProps = {
  label: string;
  options: FilterDropdownOption[];
  selected: string[];
  onChange: (value: string[]) => void;
};

export function FilterDropdownMulti({
  label,
  options,
  selected,
  onChange,
}: FilterDropdownMultiProps) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 text-[0.8125rem] font-body rounded-sm border transition-colors ${
          selected.length > 0
            ? "border-hermes text-hermes bg-hermes-light/30"
            : "border-warm-border text-charcoal-muted hover:border-charcoal-muted hover:text-charcoal"
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-hermes text-white text-[10px] min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center font-semibold">
            {selected.length}
          </span>
        )}
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
            className="absolute top-full left-0 mt-1 bg-warm-white border border-warm-border rounded-sm shadow-lg z-20 min-w-[180px] max-h-[280px] overflow-y-auto py-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected.includes(opt.value)}
                onClick={() => toggle(opt.value)}
                className="flex items-center gap-2 w-full px-3 py-2 text-[0.8125rem] font-body text-left hover:bg-cream-200 transition-colors"
              >
                <span
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                    selected.includes(opt.value)
                      ? "bg-hermes border-hermes"
                      : "border-warm-border"
                  }`}
                >
                  {selected.includes(opt.value) && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
