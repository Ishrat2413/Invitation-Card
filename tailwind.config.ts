// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Exact fonts from original
        "great-vibes": ['"Great Vibes"', "cursive"],
        cinzel: ["Cinzel", "serif"],
        playfair: ['"Playfair Display"', "serif"],
        cormorant: ['"Cormorant Garamond"', "serif"],
        "eb-garamond": ['"EB Garamond"', "serif"],
        // Default body font (Cormorant Garamond as original)
        serif: ['"Cormorant Garamond"', "serif"],
      },
      animation: {
        floatenv: "floatenv 3.5s ease-in-out infinite",
        flapopen: "flapopen 2.8s ease-in-out infinite",
        fadeup: "fadeup 0.9s ease both",
        bob: "bob 2s 1.8s ease-in-out infinite",
        fallpetal: "fallpetal linear infinite",
      },
      keyframes: {
        floatenv: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        flapopen: {
          "0%,30%": { transform: "rotateX(0)" },
          "48%,80%": { transform: "rotateX(-175deg)" },
          "100%": { transform: "rotateX(0)" },
        },
        fadeup: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        fallpetal: {
          "0%": {
            transform: "translateY(0) rotate(0deg) translateX(0)",
            opacity: "0.8",
          },
          "50%": {
            transform: "translateY(50vh) rotate(180deg) translateX(20px)",
          },
          "100%": {
            transform: "translateY(105vh) rotate(360deg) translateX(-10px)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
