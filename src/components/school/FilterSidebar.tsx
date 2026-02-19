"use client";

import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterSidebarProps {
  curricula: FilterOption[];
  areas: FilterOption[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 border-b border-warm-border-light">
      <h3 className="text-label-xs uppercase text-charcoal-muted mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="sr-only peer"
          />
          <span className="w-4 h-4 border border-warm-border flex items-center justify-center peer-checked:bg-hermes peer-checked:border-hermes transition-colors">
            <svg
              className="w-2.5 h-2.5 text-white hidden peer-checked:block"
              viewBox="0 0 10 8"
              fill="none"
            >
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-[0.8125rem] text-charcoal-light group-hover:text-charcoal transition-colors">
            {opt.label}
          </span>
          {opt.count !== undefined && (
            <span className="text-[0.75rem] text-charcoal-muted ml-auto">
              {opt.count}
            </span>
          )}
        </label>
      ))}
    </div>
  );
}

export function FilterSidebar({ curricula, areas }: FilterSidebarProps) {
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [feeRange, setFeeRange] = useState<[number, number]>([0, 50000]);
  const [ageRange, setAgeRange] = useState<[number, number]>([2, 18]);
  const [hasSixthForm, setHasSixthForm] = useState(false);

  const hasFilters =
    selectedCurricula.length > 0 ||
    selectedAreas.length > 0 ||
    hasSixthForm ||
    feeRange[0] > 0 ||
    feeRange[1] < 50000;

  const clearAll = () => {
    setSelectedCurricula([]);
    setSelectedAreas([]);
    setFeeRange([0, 50000]);
    setAgeRange([2, 18]);
    setHasSixthForm(false);
  };

  return (
    <div className="space-y-0">
      {/* Curriculum */}
      <FilterSection title="Curriculum">
        <CheckboxGroup
          options={curricula}
          selected={selectedCurricula}
          onChange={setSelectedCurricula}
        />
      </FilterSection>

      {/* Fee range */}
      <FilterSection title="Annual Fee (USD)">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-[0.6875rem] text-charcoal-muted block mb-1">Min</label>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={feeRange[0]}
              onChange={(e) => setFeeRange([Number(e.target.value), feeRange[1]])}
              className="w-full accent-hermes"
            />
            <span className="text-[0.75rem] text-charcoal-light">
              US${(feeRange[0] / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex-1">
            <label className="text-[0.6875rem] text-charcoal-muted block mb-1">Max</label>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={feeRange[1]}
              onChange={(e) => setFeeRange([feeRange[0], Number(e.target.value)])}
              className="w-full accent-hermes"
            />
            <span className="text-[0.75rem] text-charcoal-light">
              US${(feeRange[1] / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Age range */}
      <FilterSection title="Age Range">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-[0.6875rem] text-charcoal-muted block mb-1">From</label>
            <input
              type="range"
              min={2}
              max={18}
              value={ageRange[0]}
              onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
              className="w-full accent-hermes"
            />
            <span className="text-[0.75rem] text-charcoal-light">{ageRange[0]} yrs</span>
          </div>
          <div className="flex-1">
            <label className="text-[0.6875rem] text-charcoal-muted block mb-1">To</label>
            <input
              type="range"
              min={2}
              max={18}
              value={ageRange[1]}
              onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
              className="w-full accent-hermes"
            />
            <span className="text-[0.75rem] text-charcoal-light">{ageRange[1]} yrs</span>
          </div>
        </div>
      </FilterSection>

      {/* Area */}
      <FilterSection title="Area of City">
        <CheckboxGroup
          options={areas}
          selected={selectedAreas}
          onChange={setSelectedAreas}
        />
      </FilterSection>

      {/* Toggles */}
      <FilterSection title="Options">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hasSixthForm}
            onChange={(e) => setHasSixthForm(e.target.checked)}
            className="sr-only peer"
          />
          <span className="w-4 h-4 border border-warm-border flex items-center justify-center peer-checked:bg-hermes peer-checked:border-hermes transition-colors" />
          <span className="text-[0.8125rem] text-charcoal-light">
            Has sixth form
          </span>
        </label>
      </FilterSection>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-[0.8125rem] text-hermes hover:text-hermes-hover transition-colors mt-4 underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
