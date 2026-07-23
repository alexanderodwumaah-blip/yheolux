import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: "#071F17",
          900: "#0B3D2E",
          800: "#0F4D3A",
          700: "#166248",
        },
        gold: {
          300: "#E8CE7A",
          400: "#D9B44A",
          500: "#C9A227",
          600: "#A6821C",
        },
        ivory: "#F7F2E7",
        charcoal: "#191914",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "emerald-texture":
          "radial-gradient(circle at 20% 20%, rgba(201,162,39,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(201,162,39,0.06), transparent 45%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease forwards",
        shimmer: "shimmer 2.5s linear infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
