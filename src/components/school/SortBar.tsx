"use client";

import { useState } from "react";

type SortOption = "fees-desc" | "fees-asc" | "ib-desc" | "name-asc" | "name-desc";

interface SortBarProps {
  totalSchools: number;
  onSortChange?: (sort: SortOption) => void;
  onSearchChange?: (query: string) => void;
}

export function SortBar({ totalSchools }: SortBarProps) {
  const [sort, setSort] = useState<SortOption>("fees-desc");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-warm-border mb-5">
      {/* Search input */}
      <div className="relative w-full sm:w-auto sm:min-w-[240px]">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schools…"
          className="w-full pl-9 pr-3 py-2 border border-warm-border rounded-sm text-[0.8125rem] text-charcoal bg-transparent placeholder:text-charcoal-muted/60 focus:outline-none focus:border-hermes transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[0.8125rem] text-charcoal-muted whitespace-nowrap">
          {totalSchools} school{totalSchools !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-2">
          <label className="text-[0.75rem] text-charcoal-muted uppercase tracking-wider whitespace-nowrap">
            Sort
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-transparent border-b border-charcoal-muted/30 text-[0.8125rem] text-charcoal py-1 pr-6 appearance-none cursor-pointer focus:outline-none focus:border-hermes"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237A756E' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 4px center",
            }}
          >
            <option value="fees-desc">Fees: High–Low</option>
            <option value="fees-asc">Fees: Low–High</option>
            <option value="ib-desc">IB Score: High–Low</option>
            <option value="name-asc">A–Z</option>
            <option value="name-desc">Z–A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
