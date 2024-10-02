/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primaryDarkGreen: "#223710",
      secondaryDarkBrown: "#381d1a",
      thirdDarkBlue: "#22334F",
      black: "#030202",
      white: "#fdfcfc",
      primaryLightGreen: "#daefc8",
      secondaryLightBrown: "#e5cac7",
      thirdLightBlue: "#b0c2dd",
      error: "#dc2626"
    }
  },
  plugins: [],
}

