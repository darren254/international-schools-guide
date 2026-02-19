"use client";

import { useState } from "react";

type SortOption = "fees-desc" | "fees-asc" | "name-asc" | "name-desc";

interface SortBarProps {
  totalSchools: number;
  onSortChange?: (sort: SortOption) => void;
}

export function SortBar({ totalSchools }: SortBarProps) {
  const [sort, setSort] = useState<SortOption>("fees-desc");

  return (
    <div className="flex items-center justify-between py-4 border-b border-warm-border mb-5">
      <span className="text-[0.8125rem] text-charcoal-muted">
        {totalSchools} school{totalSchools !== 1 ? "s" : ""}
      </span>

      <div className="flex items-center gap-4">
        <label className="text-[0.75rem] text-charcoal-muted uppercase tracking-wider">
          Sort by
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
          <option value="name-asc">A–Z</option>
          <option value="name-desc">Z–A</option>
        </select>
      </div>
    </div>
  );
}
