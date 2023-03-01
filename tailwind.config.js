const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./page_components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        a: "0 0 2px 0 rgb(0 0 0 / 0.5)",
        b: "0 0 24px 0 rgb(0 0 0 / 0.5)",
      },
    },
    colors: {
      blue: { ...colors.blue, 700: "#174F91" },
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      sky: colors.sky,
      slate: colors.slate,
      stone: colors.stone,
      neutral: colors.neutral,
      cyan: colors.cyan,
    },
  },
  plugins: [],
};
