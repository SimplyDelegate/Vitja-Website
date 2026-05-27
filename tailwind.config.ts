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
        primary: "#1a2332",
        accent: "#f97316",
        bgLight: "#f8f7f4",
        bgDark: "#0f1621",
        textPrimary: "#1a2332",
        textSecondary: "#6b7280"
      },
      fontFamily: {
        headline: ["var(--font-barlow-condensed)", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 22, 33, 0.12)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        fadeUp: "fadeUp 800ms ease forwards"
      }
    }
  },
  plugins: []
};

export default config;
