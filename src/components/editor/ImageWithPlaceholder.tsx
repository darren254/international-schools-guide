import Image from "@tiptap/extension-image";

export const ImageWithPlaceholder = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }
          // If src is a placeholder, render as div
          if (attributes.src.startsWith("[IMAGE")) {
            return {};
          }
          return {
            src: attributes.src,
          };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src || "";
    if (src.startsWith("[IMAGE")) {
      return [
        "div",
        {
          class: "image-placeholder-block",
          "data-placeholder": src,
        },
        src,
      ];
    }
    return ["img", HTMLAttributes];
  },
}).configure({
  inline: false,
  allowBase64: true,
  HTMLAttributes: {
    class: "max-w-full h-auto my-6 rounded-sm",
  },
});
