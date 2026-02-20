import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InlineResearchPlaceholder } from "./InlineResearchPlaceholder";

export const ResearchPlaceholderExtension = Node.create({
  name: "researchPlaceholder",
  
  group: "block",
  
  atom: true,
  
  addAttributes() {
    return {
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
        tag: 'div[data-type="research-placeholder"]',
      },
      {
        tag: 'p',
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const element = node as HTMLElement;
          const text = element.textContent || "";
          if (text.match(/\[RESEARCH NEEDED:/i)) {
            return {
              placeholderText: text,
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
        "data-type": "research-placeholder",
        "data-placeholder-text": HTMLAttributes.placeholderText || "[RESEARCH NEEDED: Research]",
      },
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(InlineResearchPlaceholder);
  },
});
