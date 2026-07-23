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
          300: "#F0DC8A",
          400: "#E8CE7A",
          500: "#D9B44A",
          600: "#C9A227",
          700: "#A6821C",
        },
        ivory: "#F7F2E7",
        charcoal: "#191914",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body:    ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "emerald-texture":
          "radial-gradient(ellipse at 15% 15%, rgba(201,162,39,0.10), transparent 45%), " +
          "radial-gradient(ellipse at 85% 70%, rgba(201,162,39,0.07), transparent 45%), " +
          "radial-gradient(ellipse at 50% 100%, rgba(11,61,46,0.8), transparent 60%)",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmerSlide: {
          "0%":   { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0) scale(1)" },
          "50%":     { transform: "translateY(-14px) scale(1.02)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(201,162,39,0.45)" },
          "50%":     { boxShadow: "0 0 0 14px rgba(201,162,39,0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        fadeUp:      "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        shimmer:     "shimmerSlide 3s linear infinite",
        floatSlow:   "floatSlow 7s ease-in-out infinite",
        pulseGlow:   "pulseGlow 2.5s ease-in-out infinite",
        scaleIn:     "scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        slideLeft:   "slideInLeft 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
