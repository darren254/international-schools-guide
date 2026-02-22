"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Campus {
  name: string;
  address: string;
  grades?: string;
  lat: number;
  lng: number;
}

interface CampusMapProps {
  campuses: Campus[];
}

// Hermès orange and design tokens for map markers/popups
const HERMES_ORANGE = "#E8722A";
const CHARCOAL = "#1A1A1A";
const CHARCOAL_MUTED = "#7A756E";
const WARM_WHITE = "#FDFBF8";
const WARM_BORDER = "#E8E2D9";

function escapeHtml(text: string): string {
  if (typeof document === "undefined") return text;
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function CampusMap({ campuses }: CampusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Only show campuses with valid coordinates (no placeholder 0 or null)
  const validCampuses = campuses.filter(
    (c) =>
      typeof c.lat === "number" &&
      typeof c.lng === "number" &&
      !Number.isNaN(c.lat) &&
      !Number.isNaN(c.lng) &&
      c.lat !== 0 &&
      c.lng !== 0
  );

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || map.current || validCampuses.length === 0) return;

    if (!document.querySelector('link[href*="mapbox-gl"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
      document.head.appendChild(link);
    }

    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = token;

      const isSingle = validCampuses.length === 1;
      const first = validCampuses[0];
      const bounds = new mapboxgl.default.LngLatBounds();
      validCampuses.forEach((c) => bounds.extend([c.lng, c.lat]));

      const m = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        ...(isSingle
          ? { center: [first.lng, first.lat] as [number, number], zoom: 14 }
          : { bounds, fitBoundsOptions: { padding: 64, maxZoom: 13 } }),
        attributionControl: true,
      });

      map.current = m;
      m.scrollZoom.disable();

      m.on("load", () => {
        validCampuses.forEach((campus, i) => {
          const el = document.createElement("div");
          el.style.cssText = `
            width: 32px; height: 32px;
            background: ${HERMES_ORANGE};
            border: 2px solid ${WARM_WHITE};
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 12px; font-weight: 600;
            box-shadow: 0 2px 8px rgba(26,26,26,0.12);
            cursor: pointer;
            font-family: Inter, -apple-system, sans-serif;
          `;
          el.textContent = String(i + 1);

          const popup = new mapboxgl.default.Popup({
            offset: 20,
            closeButton: false,
            maxWidth: "280px",
            className: "campus-map-popup",
          }).setHTML(`
            <div style="font-family: Inter, -apple-system, sans-serif; padding: 4px 0;">
              <strong style="font-size: 13px; color: ${CHARCOAL};">${escapeHtml(campus.name)}</strong>
              ${campus.grades ? `<br><span style="font-size: 11px; color: ${CHARCOAL_MUTED};">${escapeHtml(campus.grades)}</span>` : ""}
              <br><span style="font-size: 11px; color: ${CHARCOAL_MUTED};">${escapeHtml(campus.address)}</span>
            </div>
          `);

          new mapboxgl.default.Marker({ element: el })
            .setLngLat([campus.lng, campus.lat])
            .setPopup(popup)
            .addTo(m);
        });
        setMapReady(true);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [validCampuses]);

  return (
    <section id="location" className="pt-10 mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Getting There" title="Location" />

      {validCampuses.length > 0 ? (
        <>
          <div
            ref={mapContainer}
            className="w-full h-[400px] rounded-sm border border-warm-border bg-cream-300 overflow-hidden"
            style={{ borderColor: WARM_BORDER }}
          />
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
          Campus locations will be shown here once coordinates are available. Contact the school for directions.
        </div>
      )}
    </section>
  );
}
