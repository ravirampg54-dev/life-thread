/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#080b14",
        surface: "#111827",
        "surface-elevated": "#182235",
        border: "#2b3950",
        primary: "#8b5cf6",
        secondary: "#22d3ee",
        success: "#34d399",
        warning: "#fbbf24",
        danger: "#fb7185",
        text: {
          primary: "#f8fafc",
          secondary: "#cbd5e1",
          muted: "#94a3b8",
        },
        ink: "#f8fafc",
        paper: "#080b14",
        receipt: "#111827",
        // Accent tokens are tuned so "text-*" variants pass WCAG AA (>= 4.5:1)
        // on the paper (#080b14) and receipt (#111827) surfaces.
        rust: "#8b5cf6",
        moss: "#22d3ee",
        gold: "#c4b5fd",
        dusk: "#a5b4d9",
        plum: "#c4b5fd",
      },
      fontFamily: {
        mono: ["'Inter'", "'SFMono-Regular'", "'Menlo'", "monospace"],
        serif: ["'Georgia'", "'Times New Roman'", "serif"],
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
