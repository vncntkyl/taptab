/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "fade-fr-t": "fade-fr-t 750ms ease-in-out",
        fade: "fade 200ms ease-in-out",
      },
      keyframes: {
        fade: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-fr-t": {
          "0%": {
            opacity: 0,
            transform: "translate(-50%,-100%)",
          },
          "50%": {
            opacity: 0,
            transform: "translate(-50%,-100%)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,0)",
          },
        },
      },
      colors: {
        black: "#343434",
        "matte-black": "#28282B",
        "onyx-black": "#353935",
        main: "#119dd8",
        secondary: "#39b1e5",
        light: "#47b8e9",
        lighter: "#7ecdef",
        dark: "#052f41",
        "secondary-dark": "#1d5973",
        "secondary-light": "#1c4a5d",
        "c-red": "#dc2929",
        "c-orange": "#dc8129",
        "c-green": "#29dc5e",
        "c-yellow": "#efd615",
        default: "#eaecef",
        "default-dark": "#e1e1e1",
        "default-dark-2": "#a4a5a7",
      },
      width: {
        sidebar: "15rem",
        "sidebar-1/2": "7.5rem",
        "sidebar-xl": "18.75rem",
        "sidebar-xl-1/2": "9.375rem",
      },
      height: {
        navbar: "3.75rem",
      },
      spacing: {
        sidebar: "15rem",
        "sidebar-1/2": "7.5rem",
        "sidebar-xl": "18.75rem",
        "sidebar-xl-1/2": "9.375rem",
        navbar: "3.75rem",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("daisyui")],
  daisyui: {
    darkTheme: "light",
  },
};
