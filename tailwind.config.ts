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
        steel: "#687078"
      },
      fontFamily: {
        headline: ["var(--font-barlow-condensed)", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
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
