/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5157FF",
          dark: "#4147ee",
          light: "#edf2ff",
        },
      },
    },
  },
  plugins: [],
};
