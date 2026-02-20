"use client";

import { useEffect, useRef, useState } from "react";
import { NodeViewWrapper, type NodeViewWrapperProps } from "@tiptap/react";

interface InlineMapPlaceholderProps extends NodeViewWrapperProps {}

export function InlineMapPlaceholder({
  node,
}: InlineMapPlaceholderProps) {
  const city = node.attrs.city;
  const placeholderText = node.attrs.placeholderText || "[MAPBOX MAP NEEDED: Interactive map]";
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || map.current) {
      if (!token) {
        setHasError(true);
      }
      return;
    }

    // Load Mapbox CSS
    if (!document.querySelector('link[href*="mapbox-gl"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
      document.head.appendChild(link);
    }

    import("mapbox-gl")
      .then((mapboxgl) => {
        mapboxgl.default.accessToken = token;

        // Default to Jakarta if no city specified
        const center: [number, number] = city === "Jakarta" 
          ? [106.8451, -6.2088] 
          : [106.8451, -6.2088]; // Default Jakarta

        const m = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/light-v11",
          center,
          zoom: 11,
          attributionControl: true,
        });

        map.current = m;
        m.scrollZoom.disable();

        m.on("load", () => {
          setMapReady(true);
        });

        m.on("error", () => {
          setHasError(true);
        });
      })
      .catch(() => {
        setHasError(true);
      });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [city]);

  if (hasError || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <NodeViewWrapper className="inline-map-placeholder my-8 p-8 border-2 border-dashed border-warm-border bg-cream-50 rounded-sm text-center">
        <div className="text-sm font-medium text-charcoal mb-2">
          Map will appear here
        </div>
        <div className="text-xs text-charcoal-muted">
          {placeholderText || `Map showing schools, neighborhoods, and POIs${city ? ` in ${city}` : ""}`}
        </div>
        <a
          href="#"
          className="text-xs text-hermes hover:text-hermes-hover underline mt-2 inline-block"
          onClick={(e) => {
            e.preventDefault();
            alert("Map configuration: Add MAPBOX_TOKEN to environment variables");
          }}
        >
          Configure map
        </a>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="inline-map-block my-8">
      <div
        ref={mapContainer}
        className="w-full h-[400px] bg-cream-300 rounded-sm"
      />
      {!mapReady && (
        <div className="text-center text-xs text-charcoal-muted py-2">
          Loading map...
        </div>
      )}
    </NodeViewWrapper>
  );
}
