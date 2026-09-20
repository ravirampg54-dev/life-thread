/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0a08",
        paper: "#f4ede1",
        receipt: "#faf6ec",
        rust: "#c1502e",
        moss: "#5c6b4d",
        gold: "#c9a04d",
        dusk: "#2f3a56",
        plum: "#5a3653",
      },
      fontFamily: {
        mono: ["'Courier New'", "monospace"],
        serif: ["Georgia", "serif"],
      },
      animation: {
        drift: "drift 18s linear infinite",
        fadein: "fadein 0.6s ease-out both",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateY(110vh) rotate(-3deg)", opacity: 0 },
          "8%": { opacity: 1 },
          "92%": { opacity: 1 },
          "100%": { transform: "translateY(-20vh) rotate(3deg)", opacity: 0 },
        },
        fadein: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
