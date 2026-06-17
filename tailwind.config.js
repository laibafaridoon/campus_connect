/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#7C3AED",
        accent: "#06B6D4",
        success: "#10B981",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Sora", "Inter", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        blob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-40px) scale(1.1)" },
          "66%": { transform: "translate(-25px,25px) scale(0.95)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
        marquee: "marquee 35s linear infinite",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg,#2563EB 0%,#7C3AED 50%,#06B6D4 100%)",
        "grad-soft": "linear-gradient(180deg,#ffffff 0%,#f5f7ff 60%,#eef2ff 100%)",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(37,99,235,0.45)",
        soft: "0 10px 40px -10px rgba(31,41,55,0.15)",
      },
    },
  },
  plugins: [],
};
