"use client";

import type { FeaturedFacilityType } from "@/lib/utils/facilities";

const SIZE = 24;
const STROKE = "currentColor";

export function FacilityIcon({ type, className }: { type: FeaturedFacilityType; className?: string }) {
  const props = { width: SIZE, height: SIZE, className, "aria-hidden": true as const };

  switch (type) {
    case "pool":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16M4 8h16M4 16h16M8 6v12M16 6v12" />
        </svg>
      );
    case "library":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5V5a2 2 0 012-2h12a2 2 0 012 2v14.5M4 19.5h16M4 19.5H2M22 19.5h-2" />
          <path d="M9 8h6M9 12h6M9 16h6" />
        </svg>
      );
    case "science":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 20v-4M10 20v-4M14 16v-6M10 16v-6M8 10V6l4-2 4 2v4" />
          <path d="M6 20h12" />
        </svg>
      );
    case "theatre":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8v8a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2z" />
          <path d="M7 6v4M17 6v4M12 6v4" />
        </svg>
      );
    case "sports":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v12M6 12h12" />
        </svg>
      );
    case "arts":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M5 9l7 6 7-6M5 15l7-6 7 6" />
        </svg>
      );
    case "music":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13M9 18a3 3 0 106 0 3 3 0 00-6 0zm12-3a3 3 0 106 0 3 3 0 00-6 0z" />
        </svg>
      );
    case "ict":
      return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9zM9 9l3 3 3-3" />
        </svg>
      );
    default:
      return null;
  }
}
