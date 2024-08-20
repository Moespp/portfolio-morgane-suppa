/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        white: "#F4EDE7",
        white2: "#FDFCFC",
        black: "#202020",
        primary: "#a46552",
        red: "#be1f1f",

        button: {
          fill: {
            default: "#a46552",
            hover: "#a46552",
            text: "#fff",
          },
          outline: {
            default: "#27272a",
            hover: "#F5F5F54D",
            text: "#27272a",
          },
        },
      },
    },
  },
  plugins: [],
};
