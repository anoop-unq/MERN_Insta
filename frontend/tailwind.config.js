/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
theme: {
  extend: {
    animation: {
      fadeIn: "fadeIn 0.2s ease-out forwards",
    },
    keyframes: {
      fadeIn: {
        from: { opacity: "0", transform: "translateY(-5%)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
    },
  },
}
,
  plugins: [],
}
