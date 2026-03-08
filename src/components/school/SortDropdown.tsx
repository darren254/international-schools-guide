"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export type SortValue = "high-low" | "low-high" | "a-z" | "z-a";

/** @deprecated Use SortValue */
export type FeeSortValue = SortValue;

const OPTIONS: { value: SortValue; label: string }[] = [
  { value: "high-low", label: "Fees: High → Low" },
  { value: "low-high", label: "Fees: Low → High" },
  { value: "a-z", label: "Alphabetical A–Z" },
  { value: "z-a", label: "Alphabetical Z–A" },
];

type SortDropdownProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
  /** When provided, dropdown open state is controlled by parent (only one open at a time). */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SortDropdown({ value, onChange, isOpen: controlledOpen, onOpenChange }: SortDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [panelRect, setPanelRect] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isControlled = onOpenChange !== undefined;
  const open = isControlled ? (controlledOpen ?? false) : internalOpen;
  const setOpen = (v: boolean) => {
    if (!v) setPanelRect(null);
    if (isControlled) onOpenChange(v);
    else setInternalOpen(v);
  };
  const currentLabel = OPTIONS.find((o) => o.value === value)?.label ?? OPTIONS[0].label;

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setPanelRect({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, [open]);

  const panel = open && typeof document !== "undefined" && (
    <>
      <div
        className="fixed inset-0 z-10"
        aria-hidden
        onClick={() => setOpen(false)}
      />
      <div
        role="listbox"
        className="fixed z-20 bg-warm-white border border-warm-border rounded-sm shadow-lg min-w-[200px] py-1"
        style={
          panelRect
            ? { top: panelRect.top, left: panelRect.left }
            : { visibility: "hidden" }
        }
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={value === opt.value}
            onClick={(e) => {
              e.stopPropagation();
              onChange(opt.value);
              setOpen(false);
            }}
            className={`flex items-center gap-2 w-full px-3 py-2 text-body-xs font-body text-left transition-colors ${
              value === opt.value
                ? "bg-primary-light/20 text-primary"
                : "hover:bg-cream-200 text-charcoal"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-body-xs font-body rounded-sm border border-warm-border text-charcoal hover:border-charcoal-muted transition-colors bg-cream"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Sort by fees or name. Current: ${currentLabel}. Click to change.`}
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
      {panel && createPortal(panel, document.body)}
    </div>
  );
}
