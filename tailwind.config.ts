import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F6F6F5",
          tertiary: "#F0F1F1",
        },
        text: {
          primary: "#292C2E",
          secondary: "#686D6F", // 4.63:1 contrast on dark fill, 4.9:1 on white (WCAG AA compliant)
        },
        border: {
          DEFAULT: "#E2E4E5",
          subtle: "#EBECEC",
          field: "#898E90", // 3.31:1 contrast for input boundaries (WCAG 2.1 AA 1.4.11 compliant)
        },
        action: {
          DEFAULT: "#292C2E",
          hover: "#1A1C1D",
          text: "#FFFFFF",
        },
        brand: {
          whatsapp: "#0E7A4B", // 5.38:1 contrast with white text (WCAG AA 1.4.3 compliant)
          whatsappHover: "#0B6A40",
        },
      },
      borderRadius: {
        card: "4px",
        btn: "4px",
      },
      maxWidth: {
        site: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
