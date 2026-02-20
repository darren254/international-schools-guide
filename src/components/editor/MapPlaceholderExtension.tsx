import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InlineMapPlaceholder } from "./InlineMapPlaceholder";

export const MapPlaceholderExtension = Node.create({
  name: "mapPlaceholder",
  
  group: "block",
  
  atom: true,
  
  addAttributes() {
    return {
      city: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-city"),
        renderHTML: (attributes) => {
          if (!attributes.city) return {};
          return {
            "data-city": attributes.city,
          };
        },
      },
      placeholderText: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-placeholder-text") || element.textContent,
        renderHTML: (attributes) => {
          return {
            "data-placeholder-text": attributes.placeholderText,
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="mapbox-placeholder"]',
      },
      {
        tag: 'div[data-type="map-placeholder"]',
      },
      {
        tag: 'p',
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const element = node as HTMLElement;
          const text = element.textContent || "";
          if (text.match(/\[MAPBOX MAP NEEDED:/i) || text.match(/\[MAP:/i)) {
            const cityMatch = text.match(/\[MAP(?:BOX MAP)? NEEDED:\s*([^|]+)/i);
            return {
              placeholderText: text,
              city: cityMatch ? cityMatch[1].trim() : null,
            };
          }
          return false;
        },
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": "map-placeholder",
        "data-city": HTMLAttributes.city || "",
        "data-placeholder-text": HTMLAttributes.placeholderText || "[MAPBOX MAP NEEDED: Interactive map]",
      },
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(InlineMapPlaceholder);
  },
});
