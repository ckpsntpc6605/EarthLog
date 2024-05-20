/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg_primary: "#C9D6DF",
        text_primary: "#1E2022",
        text_secondary: "#52616B",
      },
    },
  },
  plugins: [require("daisyui")],
};
