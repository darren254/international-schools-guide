import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InlinePullQuotePlaceholder } from "./InlinePullQuotePlaceholder";

export const PullQuotePlaceholderExtension = Node.create({
  name: "pullQuotePlaceholder",
  
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
      quote: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-quote"),
        renderHTML: (attributes) => {
          if (!attributes.quote) return {};
          return {
            "data-quote": attributes.quote,
          };
        },
      },
      source: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-source"),
        renderHTML: (attributes) => {
          if (!attributes.source) return {};
          return {
            "data-source": attributes.source,
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="pull-quote-placeholder"]',
      },
      {
        tag: 'p',
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const element = node as HTMLElement;
          const text = element.textContent || "";
          if (text.match(/\[PULL QUOTE NEEDED:/i)) {
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
    if (HTMLAttributes.quote) {
      // Render as actual pull quote
      const children: any[] = [
        [
          "div",
          { class: "pull-quote-rule" },
        ],
        [
          "blockquote",
          { class: "pull-quote-text" },
          HTMLAttributes.quote,
        ],
      ];
      
      if (HTMLAttributes.source) {
        children.push([
          "div",
          { class: "pull-quote-attribution" },
          HTMLAttributes.source,
        ]);
      }
      
      return [
        "div",
        {
          "data-type": "pull-quote",
          class: "pull-quote-block",
        },
        ...children,
      ];
    }
    
    // Render as placeholder
    return [
      "div",
      {
        "data-type": "pull-quote-placeholder",
        "data-placeholder-text": HTMLAttributes.placeholderText || "[PULL QUOTE NEEDED: Quote]",
      },
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(InlinePullQuotePlaceholder);
  },
});
