import { Node } from "@tiptap/core";

export const MapboxPlaceholder = Node.create({
  name: "mapboxPlaceholder",
  
  group: "block",
  
  atom: true,
  
  addAttributes() {
    return {
      city: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-city"),
        renderHTML: (attributes) => {
          if (!attributes.city) {
            return {};
          }
          return {
            "data-city": attributes.city,
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
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": "mapbox-placeholder",
        class: "mapbox-placeholder-block",
        ...HTMLAttributes,
      },
      HTMLAttributes.city 
        ? `[MAPBOX MAP NEEDED: ${HTMLAttributes.city} - showing schools, neighborhoods, and POIs]`
        : "[MAPBOX MAP NEEDED: Interactive map showing schools, neighborhoods, and POIs]",
    ];
  },
  
});
