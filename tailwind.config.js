/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#a855f7",
        accent: "#3b82f6",
        dark: "#0a0a0a",
        "dark-light": "#1a1a1a",
        "dark-border": "#2a2a2a",
        "text-primary": "#ffffff",
        "text-secondary": "#a1a1aa",
        success: "#22c55e",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
