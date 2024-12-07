/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
  important: true,
  theme: {
    extend: {
      translate: {
        full: "100%", // Default is available, but you can customize
      },
      boxShadow: {
        custom:
          "inset 0 0 15px rgba(135, 135, 135, 0.1), 0 0 18px 3px rgba(0, 0, 0, 0.3)",
      },
    },
  },
};
