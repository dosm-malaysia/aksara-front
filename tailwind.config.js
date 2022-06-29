/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        black: "#0F172A", // Slate 900
        primary: "#2563EB",
        success: "#22C55E", // Green 500
        danger: "#DC2626", // Red 600
        warning: "#FBBF24", // Amber 400
        dim: "#64748B", // Slate 500
        washed: "#F1F5F9", // Slate 100
        outline: "#E2E8F0", // Slate 200
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
