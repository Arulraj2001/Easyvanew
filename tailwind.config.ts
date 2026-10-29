import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        easyva: {
          purple: {
            50: "#f5f3ff",
            100: "#ede9fe",
            200: "#ddd6fe",
            300: "#c4b5fd",
            400: "#a78bfa",
            500: "#8b5cf6",
            600: "#7c3aed",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
          },
          teal: {
            50: "#ecfeff",
            100: "#cffafe",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
          },
          lime: {
            50: "#f7fee7",
            400: "#a3e635",
            500: "#84cc16",
            600: "#65a30d",
            700: "#4d7c0f",
            800: "#166534",
          },
          amber: {
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
          },
          dark: "#0F172A",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounce 2s infinite",
      },
      boxShadow: {
        "brand-soft": "0 10px 30px -10px rgba(124, 58, 237, 0.12)",
        "brand-glow": "0 0 25px -5px rgba(124, 58, 237, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

