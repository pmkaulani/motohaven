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
          secondary: "#F8F9FA",
          tertiary: "#F1F3F5",
        },
        text: {
          primary: "#111827",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
        brand: {
          dark: "#0F172A",
          accent: "#2563EB",
          whatsapp: "#0E7A4B",
          whatsappHover: "#0B6A40",
        },
        border: {
          DEFAULT: "#E5E7EB",
          subtle: "#F3F4F6",
          field: "#D1D5DB",
        },
        action: {
          DEFAULT: "#111827",
          hover: "#1F2937",
          text: "#FFFFFF",
        },
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      maxWidth: {
        site: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
