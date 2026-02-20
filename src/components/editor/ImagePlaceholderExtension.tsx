import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InlineImagePlaceholder } from "./InlineImagePlaceholder";

export const ImagePlaceholderExtension = Node.create({
  name: "imagePlaceholder",
  
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
      imageUrl: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-image-url"),
        renderHTML: (attributes) => {
          if (!attributes.imageUrl) return {};
          return {
            "data-image-url": attributes.imageUrl,
          };
        },
      },
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attributes) => {
          if (!attributes.caption) return {};
          return {
            "data-caption": attributes.caption,
          };
        },
      },
      photoCredit: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-photo-credit"),
        renderHTML: (attributes) => {
          if (!attributes.photoCredit) return {};
          return {
            "data-photo-credit": attributes.photoCredit,
          };
        },
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-placeholder"]',
      },
      {
        tag: 'p',
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          const element = node as HTMLElement;
          const text = element.textContent || "";
          if (text.match(/\[IMAGE NEEDED:/i)) {
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
    if (HTMLAttributes.imageUrl) {
      // Render as image with caption
      const children: any[] = [
        [
          "img",
          {
            src: HTMLAttributes.imageUrl,
            alt: HTMLAttributes.placeholderText || "",
          },
        ],
      ];
      
      if (HTMLAttributes.caption || HTMLAttributes.photoCredit) {
        children.push([
          "p",
          { class: "image-caption" },
          `${HTMLAttributes.caption || ""}${HTMLAttributes.caption && HTMLAttributes.photoCredit ? ". " : ""}${HTMLAttributes.photoCredit || ""}`,
        ]);
      }
      
      return [
        "div",
        {
          "data-type": "image-placeholder",
          "data-image-url": HTMLAttributes.imageUrl,
          "data-caption": HTMLAttributes.caption || "",
          "data-photo-credit": HTMLAttributes.photoCredit || "",
        },
        ...children,
      ];
    }
    
    // Render as placeholder
    return [
      "div",
      {
        "data-type": "image-placeholder",
        "data-placeholder-text": HTMLAttributes.placeholderText || "[IMAGE NEEDED: Image]",
      },
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(InlineImagePlaceholder);
  },
});
