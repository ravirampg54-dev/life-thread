import { useNavigate } from "react-router-dom";
import StatsPanel from "../components/StatsPanel";
import ActivityChart from "../charts/ActivityChart";
import CategoryChart from "../charts/CategoryChart";
import { weekdayDistribution, categoryDistribution } from "../analysis/patterns";
import { formatDate } from "../utils/dateUtils";

export default function Overview({ data }) {
  const navigate = useNavigate();
  const { receipts, connections, chapters, span, categories } = data;

  const stats = [
    { label: "Total Moments", value: receipts.length },
    { label: "Time Span", value: `${span.days}d` },
    { label: "Categories", value: categories.length },
    { label: "Connections", value: connections.length },
    { label: "Chapters", value: chapters.length },
  ];

  const weekday = weekdayDistribution(receipts);
  const category = categoryDistribution(receipts);

  return (
    <div className="page-shell px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Your digital journey</div>
            <h1 className="section-title mt-3 text-3xl md:text-5xl">Overview</h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
              {formatDate(span.start)} — {formatDate(span.end)}
            </p>
          </div>

          <button onClick={() => navigate("/explorer")} className="ghost-button md:w-auto">
            Open archive
          </button>
        </header>

        <StatsPanel stats={stats} />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <section className="surface rounded-[1.5rem] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="eyebrow">Activity by weekday</h2>
              <span className="glass-chip">rhythm</span>
            </div>
            <ActivityChart data={weekday} dataKeyX="day" dataKeyY="count" color="#8b5cf6" />
          </section>

          <section className="surface rounded-[1.5rem] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="eyebrow">Moments by category</h2>
              <span className="glass-chip">signals</span>
            </div>
            <CategoryChart data={category} />
          </section>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <button onClick={() => navigate("/discoveries")} className="story-card">
            <div className="eyebrow mb-3">Discoveries</div>
            <h3 className="font-serif text-2xl text-white">See what stands out</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Automatically detected, evidence-based patterns hidden in the archive.</p>
          </button>

          <button onClick={() => navigate("/threads")} className="story-card">
            <div className="eyebrow mb-3">Threads</div>
            <h3 className="font-serif text-2xl text-white">Follow a thread</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Recurring motifs across music, places, routines, and travel.</p>
          </button>

          <button onClick={() => navigate("/story")} className="story-card">
            <div className="eyebrow mb-3">Story mode</div>
            <h3 className="font-serif text-2xl text-white">Play your story</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">A narrative built entirely from your data, not from guesswork.</p>
          </button>
        </section>
      </div>
    </div>
  );
}
