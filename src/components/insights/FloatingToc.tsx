"use client";

import { useEffect, useMemo, useState } from "react";

type TocItem = { id: string; label: string };

export function FloatingToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  const list = useMemo(() => items.filter((i) => i.id && i.label), [items]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (list.length === 0) return null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-warm-border bg-warm-white px-4 py-2 font-sans text-xs tracking-wider uppercase text-charcoal shadow-sm hover:border-charcoal-muted transition-colors"
        aria-label="Open table of contents"
      >
        In this article
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Table of contents">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-label="Close table of contents"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-auto rounded-t-xl border-t border-warm-border bg-warm-white px-5 pt-5 pb-8 shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="ft-smallcaps text-label-xs tracking-[0.18em] font-medium text-charcoal-muted">
                In this article
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-charcoal-muted hover:text-charcoal transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className="space-y-3">
              {list.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block font-sans text-base text-charcoal hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

