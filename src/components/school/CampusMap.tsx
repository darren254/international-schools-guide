"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Campus {
  name: string;
  address: string;
  grades?: string;
  lat: number;
  lng: number;
}

export interface OtherSchoolMarker {
  name: string;
  slug: string;
  meta: string;
  feeRange: string;
  lat: number;
  lng: number;
}

interface CampusMapProps {
  campuses: Campus[];
  currentSchoolName?: string;
  citySlug?: string;
  otherSchools?: OtherSchoolMarker[];
}

// Hermès design tokens
const HERMES_ORANGE = "#E8722A";
const CHARCOAL = "#1A1A1A";
const CHARCOAL_MUTED = "#7A756E";
const WARM_WHITE = "#FDFBF8";
const WARM_BORDER = "#E8E2D9";
const SECONDARY_MARKER = "#7A756E"; // charcoal-muted
const SECONDARY_MARKER_BG = "rgba(253, 251, 248, 0.95)";

type SelectedPrimary = { type: "primary"; campus: Campus };
type SelectedSecondary = { type: "secondary"; school: OtherSchoolMarker };
type Selected = SelectedPrimary | SelectedSecondary | null;

export function CampusMap({
  campuses,
  currentSchoolName,
  citySlug = "jakarta",
  otherSchools = [],
}: CampusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onSelectRef = useRef<(s: Selected) => void>(() => {});
  const [selected, setSelected] = useState<Selected>(null);

  onSelectRef.current = setSelected;

  const validCampuses = campuses.filter(
    (c) =>
      typeof c.lat === "number" &&
      typeof c.lng === "number" &&
      !Number.isNaN(c.lat) &&
      !Number.isNaN(c.lng) &&
      c.lat !== 0 &&
      c.lng !== 0
  );

  const validOtherSchools = otherSchools.filter(
    (s) =>
      typeof s.lat === "number" &&
      typeof s.lng === "number" &&
      !Number.isNaN(s.lat) &&
      !Number.isNaN(s.lng) &&
      s.lat !== 0 &&
      s.lng !== 0
  );

  const hasToken =
    typeof process.env.NEXT_PUBLIC_MAPBOX_TOKEN === "string" &&
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN.length > 0;

  const hasAnyPoint = validCampuses.length > 0 || validOtherSchools.length > 0;

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || map.current || !hasAnyPoint) return;

    if (!document.querySelector('link[href*="mapbox-gl"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
      document.head.appendChild(link);
    }

    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = token;

      const allLngLat = [
        ...validCampuses.map((c) => [c.lng, c.lat] as [number, number]),
        ...validOtherSchools.map((s) => [s.lng, s.lat] as [number, number]),
      ];
      const bounds = new mapboxgl.default.LngLatBounds();
      allLngLat.forEach(([lng, lat]) => bounds.extend([lng, lat]));

      const singlePoint = allLngLat.length === 1;
      const m = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        ...(singlePoint
          ? { center: allLngLat[0], zoom: 14 }
          : {
              bounds,
              fitBoundsOptions: {
                padding: { top: 64, bottom: 64, left: 48, right: 48 },
                maxZoom: 13,
              },
            }),
        attributionControl: true,
      });

      map.current = m;
      m.scrollZoom.disable();

      m.on("load", () => {
        const toRemove: any[] = [];

        // Primary markers (current school) – prominent
        validCampuses.forEach((campus, i) => {
          const el = document.createElement("button");
          el.type = "button";
          el.setAttribute("aria-label", `${campus.name}, tap for details`);
          el.style.cssText = `
            width: 36px; height: 36px;
            background: ${HERMES_ORANGE};
            border: 2px solid ${WARM_WHITE};
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 13px; font-weight: 600;
            box-shadow: 0 2px 10px rgba(26,26,26,0.18);
            cursor: pointer;
            font-family: Inter, -apple-system, sans-serif;
          `;
          el.textContent = String(validCampuses.length > 1 ? i + 1 : "");
          el.addEventListener("click", () => {
            onSelectRef.current({ type: "primary", campus });
          });

          const marker = new mapboxgl.default.Marker({ element: el })
            .setLngLat([campus.lng, campus.lat])
            .addTo(m);
          toRemove.push(marker);
        });

        // Secondary markers (other schools) – subtle
        validOtherSchools.forEach((school) => {
          const el = document.createElement("button");
          el.type = "button";
          el.setAttribute("aria-label", `${school.name}, tap for details`);
          el.style.cssText = `
            width: 24px; height: 24px;
            background: ${SECONDARY_MARKER_BG};
            border: 2px solid ${SECONDARY_MARKER};
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(26,26,26,0.1);
          `;
          el.addEventListener("click", () => {
            onSelectRef.current({ type: "secondary", school });
          });

          const marker = new mapboxgl.default.Marker({ element: el })
            .setLngLat([school.lng, school.lat])
            .addTo(m);
          toRemove.push(marker);
        });

        markersRef.current = toRemove;
      });
    });

    return () => {
      markersRef.current.forEach((marker) => marker?.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [validCampuses, validOtherSchools, hasAnyPoint]);

  const closeCard = useCallback(() => setSelected(null), []);

  return (
    <section id="location" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Getting There" title="Location" />

      {hasAnyPoint ? (
        <>
          {!hasToken ? (
            <div className="w-full h-[400px] rounded-sm border border-warm-border bg-warm-white flex items-center justify-center text-center px-6">
              <p className="text-charcoal-muted text-[0.9375rem] max-w-md">
                The map is not available on this deployment. Set{" "}
                <code className="text-charcoal text-xs bg-cream-300 px-1 rounded">
                  NEXT_PUBLIC_MAPBOX_TOKEN
                </code>{" "}
                in your build environment and redeploy to show campus locations.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={mapContainer}
                className="w-full h-[320px] sm:h-[400px] rounded-sm border border-warm-border bg-cream-300 overflow-hidden"
                style={{ borderColor: WARM_BORDER }}
              />

              {/* Marker card: bottom sheet on mobile, same on desktop */}
              {selected && (
                <>
                  <button
                    type="button"
                    onClick={closeCard}
                    className="fixed inset-0 bg-black/20 z-40 sm:z-30"
                    aria-label="Close"
                  />
                  <div
                    className="fixed left-0 right-0 bottom-0 z-50 sm:z-40 bg-warm-white border-t border-warm-border rounded-t-2xl shadow-[0_-4px_24px_rgba(26,26,26,0.08)] max-h-[45vh] overflow-auto sm:max-h-[320px] sm:absolute sm:bottom-4 sm:left-4 sm:right-4 sm:rounded-xl sm:border sm:max-w-sm"
                    role="dialog"
                    aria-label="Location details"
                  >
                    <div className="sticky top-0 flex justify-end p-2 sm:p-3 bg-warm-white border-b border-warm-border-light sm:border-b-0">
                      <button
                        type="button"
                        onClick={closeCard}
                        className="p-2 -m-2 text-charcoal-muted hover:text-charcoal rounded-full touch-manipulation"
                        aria-label="Close"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                          <path
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            d="M5 5l10 10M15 5l-10 10"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 pb-6 safe-area-pb">
                      {selected.type === "primary" ? (
                        <>
                          <p className="font-display text-[1.0625rem] font-semibold text-charcoal">
                            {selected.campus.name}
                          </p>
                          {selected.campus.grades && (
                            <p className="text-[0.8125rem] text-charcoal-muted mt-0.5">
                              {selected.campus.grades}
                            </p>
                          )}
                          <p className="text-[0.8125rem] text-charcoal-muted mt-2">
                            {selected.campus.address}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-display text-[1.0625rem] font-semibold text-charcoal">
                            {selected.school.name}
                          </p>
                          <p className="text-[0.8125rem] text-charcoal-muted mt-0.5">
                            {selected.school.meta}
                          </p>
                          <p className="text-[0.8125rem] font-medium text-charcoal mt-1">
                            {selected.school.feeRange}
                          </p>
                          <Link
                            href={`/international-schools/${citySlug}/${selected.school.slug}/`}
                            className="inline-block mt-4 text-[0.875rem] font-medium text-hermes hover:text-hermes-hover underline underline-offset-2 touch-manipulation"
                          >
                            View profile →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Campus list below map */}
          <div className="space-y-4 mt-6">
            {campuses.map((campus, i) => (
              <div key={`${campus.name}-${i}`} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-hermes text-white text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[0.9375rem] font-medium text-charcoal">{campus.name}</p>
                  {campus.grades && (
                    <p className="text-[0.8125rem] text-charcoal-muted">{campus.grades}</p>
                  )}
                  <p className="text-sm text-charcoal-muted">{campus.address}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-sm border border-warm-border bg-warm-white p-6 text-charcoal-muted text-[0.9375rem]">
          Campus locations will be shown here once coordinates are available. Contact the school for
          directions.
        </div>
      )}
    </section>
  );
}
