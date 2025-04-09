// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        maincolor: "#023047", // Add your custom color her
        greenbutten: "#00FF00",
      },
    },
  },
  plugins: [],
};
