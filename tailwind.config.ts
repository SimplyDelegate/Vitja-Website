import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#0D0F12",
        warm: "#F3F0E9",
        bronze: "#C5863D",
        gold: "#EBAE58",
        steel: "#687078",
        // Token des Anfrageformulars, auf die Site-Palette gemappt
        surface: { DEFAULT: "#FFFFFF", "2": "#F3F0E9" },
        ink: { DEFAULT: "#0D0F12", "2": "#3F464C" },
        mute: "#687078",
        line: "#D9D5CB",
        accent: { DEFAULT: "#8B551F", dark: "#6E4318" },
        signal: { DEFAULT: "#D4520A", dark: "#A03C05" }
      },
      fontFamily: {
        headline: ["var(--font-barlow-condensed)", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        display: ["var(--font-barlow-condensed)", "Arial", "sans-serif"],
        body: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(13, 15, 18, 0.16)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 800ms ease forwards"
      }
    }
  },
  plugins: []
};

export default config;
