import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F8F4EE",
          50: "#FDFBF8",
          100: "#F8F4EE",
          200: "#F0EBE3",
          300: "#E8E2D9",
          400: "#D4CEC5",
        },
        charcoal: {
          DEFAULT: "#1A1A1A",
          light: "#4A4540",
          muted: "#7A756E",
        },
        hermes: {
          DEFAULT: "#E8722A",
          hover: "#D4641F",
          light: "#F5DCC8",
        },
        verified: {
          DEFAULT: "#2D8A4E",
          bg: "#E8F5ED",
        },
        amber: {
          highlight: "#C4870A",
          bg: "#FEF7E8",
        },
        warm: {
          border: "#E8E2D9",
          "border-light": "#F0EBE3",
          white: "#FDFBF8",
        },
      },
      fontFamily: {
        display: [
          "Cormorant Garamond",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-xl": [
          "2.75rem",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
        "display-lg": [
          "1.875rem",
          { lineHeight: "1.2", letterSpacing: "-0.005em" },
        ],
        "display-md": ["1.625rem", { lineHeight: "1.2" }],
        "display-sm": ["1.25rem", { lineHeight: "1.25" }],
        "label-xs": [
          "0.6875rem",
          { lineHeight: "1.4", letterSpacing: "0.1em" },
        ],
        "label-sm": [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.06em" },
        ],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        content: "1240px",
      },
      borderColor: {
        DEFAULT: "#E8E2D9",
      },
    },
  },
  plugins: [],
};

export default config;
