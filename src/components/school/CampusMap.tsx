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

export function CampusMap({ campuses }: CampusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || map.current) return;

    // Load Mapbox CSS via link tag (Next.js can't parse it as a module)
    if (!document.querySelector('link[href*="mapbox-gl"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
      document.head.appendChild(link);
    }

    import("mapbox-gl").then((mapboxgl) => {

      mapboxgl.default.accessToken = token;

      const bounds = new mapboxgl.default.LngLatBounds();
      campuses.forEach((c) => bounds.extend([c.lng, c.lat]));

      const m = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        bounds,
        fitBoundsOptions: { padding: 60, maxZoom: 14 },
        attributionControl: true,
      });

      map.current = m;

      // Disable scroll zoom for cleaner UX
      m.scrollZoom.disable();

      m.on("load", () => {
        campuses.forEach((campus, i) => {
          const el = document.createElement("div");
          el.style.cssText = `
            width: 28px; height: 28px;
            background: #E8722A;
            border: 2px solid white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 13px; font-weight: 600;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            cursor: pointer;
          `;
          el.textContent = String(i + 1);

          const popup = new mapboxgl.default.Popup({
            offset: 18,
            closeButton: false,
            maxWidth: "260px",
          }).setHTML(`
            <div style="font-family: Inter, sans-serif; padding: 2px 0;">
              <strong style="font-size: 13px; color: #1A1A1A;">${campus.name}</strong>
              ${campus.grades ? `<br><span style="font-size: 11px; color: #7A756E;">${campus.grades}</span>` : ""}
              <br><span style="font-size: 11px; color: #7A756E;">${campus.address}</span>
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
  }, [campuses]);

  return (
    <section className="mb-10 pb-10 border-b border-warm-border-light">
      <SectionHeader label="Getting There" title="Location" id="location" />

      <div
        ref={mapContainer}
        className="w-full h-[380px] bg-cream-300 mb-6"
      />

      {/* Campus list below map */}
      <div className="space-y-4">
        {campuses.map((campus, i) => (
          <div key={campus.name} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-hermes text-white text-xs font-semibold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="text-[0.9375rem] font-medium">{campus.name}</p>
              {campus.grades && (
                <p className="text-[0.8125rem] text-charcoal-muted">
                  {campus.grades}
                </p>
              )}
              <p className="text-sm text-charcoal-muted">{campus.address}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
