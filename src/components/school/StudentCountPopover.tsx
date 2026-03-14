"use client";

import { useState, useRef, useEffect } from "react";

type SourceLine = {
  value: string;
  date: string | null;
  source: string;
};

type StudentCountPopoverProps = {
  sourceCount: number;
  topSources: SourceLine[];
};

export function StudentCountPopover({ sourceCount, topSources }: StudentCountPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (topSources.length === 0) return null;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Based on ${sourceCount} source${sourceCount === 1 ? "" : "s"}`}
        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full border border-charcoal-muted/30 text-charcoal-muted hover:border-primary hover:text-primary transition-colors cursor-pointer align-middle"
        style={{ fontSize: "10px", lineHeight: 1 }}
      >
        i
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-72 bg-white rounded-lg shadow-lg border border-warm-border p-4 text-left">
          <p className="text-label-xs uppercase tracking-wider text-charcoal-muted mb-2 font-body">
            Based on {sourceCount} source{sourceCount === 1 ? "" : "s"}
          </p>

          <ul className="space-y-2">
            {topSources.map((s, i) => (
              <li key={i} className="text-body-xs text-charcoal leading-snug">
                <span className="font-medium">{s.value}</span>
                {s.date && <span className="text-charcoal-muted"> ({s.date})</span>}
                <br />
                <span className="text-charcoal-muted text-label-xs">{s.source}</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-label-xs text-charcoal-muted/70 leading-snug font-body">
            Enrolment figures are estimates and may vary by academic year.
          </p>
        </div>
      )}
    </div>
  );
}
