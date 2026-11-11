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
          secondary: "#73787A",
        },
        border: {
          DEFAULT: "#E2E4E5",
          subtle: "#EBECEC",
        },
        action: {
          DEFAULT: "#292C2E",
          hover: "#1A1C1D",
          text: "#FFFFFF",
        },
        brand: {
          whatsapp: "#25D366",
          whatsappHover: "#1EBE5D",
        },
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
      },
      maxWidth: {
        site: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
