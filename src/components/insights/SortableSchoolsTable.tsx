"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type SortDir = "asc" | "desc" | null;

// Section 1: 5 columns
export interface Section1Row {
  school: string;
  curriculum: string;
  ages: string;
  fees: string;
  location: string;
  slug: string | null;
}

// Section 2: 4 columns
export interface Section2Row {
  school: string;
  area: string;
  curriculum: string;
  fees: string;
  slug: string | null;
}

function parseFeeLow(fees: string): number {
  const range = fees.match(/US\$([\d.]+)K?\s*[–-]\s*US\$[\d.]+K?/);
  if (range) {
    const v = parseFloat(range[1]);
    return range[1].includes("K") ? v : v / 1000;
  }
  const single = fees.match(/US\$([\d.]+)K?/);
  if (single) {
    const v = parseFloat(single[1]);
    return single[1].includes("K") ? v : v / 1000;
  }
  return 0;
}

export function SortableSchoolsTableSection1({ rows }: { rows: Section1Row[] }) {
  const [sortKey, setSortKey] = useState<keyof Section1Row | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: keyof Section1Row) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      let va: string | number = a[sortKey] ?? "";
      let vb: string | number = b[sortKey] ?? "";
      if (sortKey === "fees") {
        va = parseFeeLow(a.fees);
        vb = parseFeeLow(b.fees);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const sa = String(va);
      const sb = String(vb);
      const cmp = sa.localeCompare(sb, undefined, { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 my-8">
      <table className="w-full border-collapse text-left min-w-[600px]">
        <thead>
          <tr className="border-b-2 border-warm-border">
            {(["school", "curriculum", "ages", "fees", "location"] as const).map((key) => (
              <th
                key={key}
                className="font-sans text-xs font-semibold uppercase tracking-wider text-charcoal-muted py-3 pr-4 cursor-pointer hover:text-charcoal select-none"
                onClick={() => handleSort(key)}
              >
                <span className="inline-flex items-center gap-1">
                  {key === "school" && "School"}
                  {key === "curriculum" && "Curriculum"}
                  {key === "ages" && "Ages"}
                  {key === "fees" && "Annual Fees (USD)"}
                  {key === "location" && "Location"}
                  {sortKey === key && (sortDir === "asc" ? " ↑" : " ↓")}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="border-b border-warm-border hover:bg-cream-50/50">
              <td className="py-3 pr-4">
                {row.slug ? (
                  <Link
                    href={`/international-schools/jakarta/${row.slug}/`}
                    className="text-hermes hover:underline font-medium"
                  >
                    {row.school}
                  </Link>
                ) : (
                  <span className="font-medium">{row.school}</span>
                )}
              </td>
              <td className="py-3 pr-4">{row.curriculum}</td>
              <td className="py-3 pr-4">{row.ages}</td>
              <td className="py-3 pr-4">{row.fees}</td>
              <td className="py-3 pr-4">{row.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SortableSchoolsTableSection2({ rows }: { rows: Section2Row[] }) {
  const [sortKey, setSortKey] = useState<keyof Section2Row | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: keyof Section2Row) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      let va: string | number = a[sortKey] ?? "";
      let vb: string | number = b[sortKey] ?? "";
      if (sortKey === "fees") {
        va = parseFeeLow(a.fees);
        vb = parseFeeLow(b.fees);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const sa = String(va);
      const sb = String(vb);
      const cmp = sa.localeCompare(sb, undefined, { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 my-8">
      <table className="w-full border-collapse text-left min-w-[500px]">
        <thead>
          <tr className="border-b-2 border-warm-border">
            {(["school", "area", "curriculum", "fees"] as const).map((key) => (
              <th
                key={key}
                className="font-sans text-xs font-semibold uppercase tracking-wider text-charcoal-muted py-3 pr-4 cursor-pointer hover:text-charcoal select-none"
                onClick={() => handleSort(key)}
              >
                <span className="inline-flex items-center gap-1">
                  {key === "school" && "School"}
                  {key === "area" && "Area"}
                  {key === "curriculum" && "Curriculum"}
                  {key === "fees" && "Annual Fees (USD)"}
                  {sortKey === key && (sortDir === "asc" ? " ↑" : " ↓")}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="border-b border-warm-border hover:bg-cream-50/50">
              <td className="py-3 pr-4">
                {row.slug ? (
                  <Link
                    href={`/international-schools/jakarta/${row.slug}/`}
                    className="text-hermes hover:underline font-medium"
                  >
                    {row.school}
                  </Link>
                ) : (
                  <span className="font-medium">{row.school}</span>
                )}
              </td>
              <td className="py-3 pr-4">{row.area}</td>
              <td className="py-3 pr-4">{row.curriculum}</td>
              <td className="py-3 pr-4">{row.fees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
