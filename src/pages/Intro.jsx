import { useNavigate } from "react-router-dom";

const FRAGMENTS = [
  { text: "♫ Midnight City", left: "8%", delay: "0s", dur: "16s" },
  { text: "📍 Moonlight Café", left: "22%", delay: "2.4s", dur: "19s" },
  { text: "☕ Coffee", left: "38%", delay: "5s", dur: "15s" },
  { text: "📷 Rainy Street", left: "52%", delay: "1.2s", dur: "20s" },
  { text: "✉ Don't forget tomorrow", left: "66%", delay: "3.6s", dur: "18s" },
  { text: "🎬 Interstellar", left: "78%", delay: "6.2s", dur: "17s" },
  { text: "🔎 study places", left: "12%", delay: "8.5s", dur: "21s" },
  { text: "🛍 Wireless earbuds", left: "45%", delay: "10s", dur: "16s" },
  { text: "📅 Ooty weekend trip", left: "88%", delay: "4.4s", dur: "22s" },
];

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-ink text-paper overflow-hidden flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {FRAGMENTS.map((f, i) => (
          <span
            key={i}
            className="absolute font-mono text-xs md:text-sm text-paper/30 whitespace-nowrap motion-reduce:hidden animate-drift"
            style={{ left: f.left, animationDelay: f.delay, animationDuration: f.dur }}
          >
            {f.text}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-xl animate-fadein">
        <h1 className="font-serif text-5xl md:text-7xl tracking-tight">
          LIFE<span className="text-rust">//</span>THREADS
        </h1>
        <p className="mt-6 font-mono text-sm md:text-base text-paper/70 leading-relaxed">
          Hundreds of moments.
          <br />
          One life.
          <br />
          Find the connections.
        </p>
        <button
          onClick={() => navigate("/overview")}
          className="mt-10 font-mono text-sm uppercase tracking-[0.2em] border border-paper/60 rounded-full px-8 py-3 hover:bg-paper hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-rust focus:ring-offset-2 focus:ring-offset-ink"
        >
          Enter Your Story
        </button>
      </div>

      <p className="absolute bottom-6 text-[10px] font-mono text-paper/30 z-10">
        100% client-side · no server · no external AI
      </p>
    </div>
  );
}
