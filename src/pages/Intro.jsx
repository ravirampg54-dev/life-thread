import { useNavigate } from "react-router-dom";
import InteractiveParticleBackground from "../components/InteractiveParticleBackground";

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
    <div className="page-shell relative overflow-hidden bg-paper text-ink">
      <InteractiveParticleBackground />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.22),transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(103,232,249,0.15),transparent_24%)]" aria-hidden="true" />

      <div className="absolute inset-0 pointer-events-none opacity-80" aria-hidden="true">
        {FRAGMENTS.map((f, i) => (
          <span
            key={i}
            className="absolute whitespace-nowrap font-mono text-[10px] text-slate-300/70 md:text-xs motion-reduce:hidden animate-drift"
            style={{ left: f.left, animationDelay: f.delay, animationDuration: f.dur }}
          >
            {f.text}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="animate-fadein">
            <div className="eyebrow mb-6">Digital memory archive</div>
            <h1 className="max-w-2xl text-5xl font-medium tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
              YOUR LIFE, <span className="accent-text">IN RECEIPTS</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              Every song, search, place, purchase, and message leaves a trace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate("/overview")} className="primary-button">
                Begin exploration
              </button>
              <button onClick={() => navigate("/graph")} className="ghost-button">
                Discover connections
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="stat-card text-center">
                <div className="font-serif text-3xl text-white">150+</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">moments</div>
              </div>
              <div className="stat-card text-center">
                <div className="font-serif text-3xl text-white">18</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">threads</div>
              </div>
              <div className="stat-card text-center">
                <div className="font-serif text-3xl text-white">7</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">chapters</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="surface relative overflow-hidden rounded-[2rem] p-5 md:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),transparent_32%)]" aria-hidden="true" />
              <div className="relative z-10">
                <div className="eyebrow mb-3">Archive pattern</div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">Active signals</div>
                    <div className="mt-2 font-serif text-2xl text-white">Moonlight Café</div>
                  </div>
                  <div className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">
                    recurring
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    ["Music", "Midnight City", "3 matches"],
                    ["Place", "Moonlight Café", "6 visits"],
                    ["Search", "study places", "late-night"],
                    ["Travel", "Ooty weekend trip", "2 arcs"],
                  ].map(([category, title, meta], index) => (
                    <div key={title} className="data-stack flex items-center justify-between gap-3 p-3" style={{ opacity: 0.92 - index * 0.08 }}>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{category}</div>
                        <div className="mt-1 font-medium text-white">{title}</div>
                      </div>
                      <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                        {meta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400">
        100% client-side · no server · no external AI
      </p>
    </div>
  );
}
