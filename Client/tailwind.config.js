/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      width: {
        98: "26rem",
      },
      screens: {
        "sm-tab": { max: "650px" }, // Hide for screens 638px and above
      },
    },
  },
  plugins: [require("daisyui")],
};
