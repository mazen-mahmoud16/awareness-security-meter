/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      height: {
        128: "32rem",
        92: "22rem",
      },
      width: {
        128: "32rem",
      },
      maxHeight: {
        128: "32rem",
      },
      minHeight: {
        24: "6rem",
        10: "2.5rem",
        2: "0.5rem",
        4: "1rem",
      },
      minWidth: {
        40: "10rem",
        8: "2rem",
      },
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
      opacity: {
        "08": ".08",
      },
      transitionDuration: {
        50: "40ms",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
