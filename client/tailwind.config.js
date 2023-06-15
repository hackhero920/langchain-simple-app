/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // class, 'media' or boolean
  daisyui: {
    themes: ["emerald"],
  },
  plugins: [require("daisyui")],
}

