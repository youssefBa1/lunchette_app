/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      translate: {
        full: "100%", // Default is available, but you can customize
      },
      boxShadow: {
        custom:
          "inset 0 0 15px rgba(135, 135, 135, 0.1), 0 0 18px 3px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        "modal-slide-down": {
          "0%": {
            transform: "translateY(-50px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "modal-slide-down": "modal-slide-down 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  important: true,
};
