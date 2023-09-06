/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#25B9F8",
        secondary: "#7FCEF0",
        dark: "#0C3242",
        "secondary-dark": "#2A8FBC",
      },
      width: {
        sidebar: "17rem",
        "sidebar-1/2": "8.5rem",
      },
      height: {
        navbar: "3.75rem",
      },
      spacing: {
        sidebar: "17rem",
        "sidebar-1/2": "8.5rem",
        navbar: "3.75rem",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
