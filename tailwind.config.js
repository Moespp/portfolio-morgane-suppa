/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        white: "#f9f5f3",
        white2: "#F4EDE7",
        black: "#202020",
        primary: "#a46552",

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
