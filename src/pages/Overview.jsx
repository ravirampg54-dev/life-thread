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
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Your Digital Journey</h1>
        <p className="text-ink/60 text-sm mt-1 font-mono">
          {formatDate(span.start)} — {formatDate(span.end)}
        </p>
      </header>

      <StatsPanel stats={stats} />

      <section className="mt-8 bg-receipt border border-ink/15 rounded-lg p-5">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60 mb-3">Activity by weekday</h2>
        <ActivityChart data={weekday} dataKeyX="day" dataKeyY="count" color="#c1502e" />
      </section>

      <section className="mt-6 bg-receipt border border-ink/15 rounded-lg p-5">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60 mb-3">Moments by category</h2>
        <CategoryChart data={category} />
      </section>

      <section className="mt-8 grid md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/discoveries")}
          className="text-left bg-dusk/10 border border-dusk/30 rounded-lg p-5 hover:bg-dusk/15 transition-colors focus:outline-none focus:ring-2 focus:ring-rust"
        >
          <h3 className="font-serif text-lg">See what stands out →</h3>
          <p className="text-sm text-ink/60 mt-1">Automatically detected, evidence-based discoveries.</p>
        </button>
        <button
          onClick={() => navigate("/threads")}
          className="text-left bg-rust/10 border border-rust/30 rounded-lg p-5 hover:bg-rust/15 transition-colors focus:outline-none focus:ring-2 focus:ring-rust"
        >
          <h3 className="font-serif text-lg">Follow a thread →</h3>
          <p className="text-sm text-ink/60 mt-1">Recurring chains across music, places, and more.</p>
        </button>
        <button
          onClick={() => navigate("/story")}
          className="text-left bg-gold/10 border border-gold/30 rounded-lg p-5 hover:bg-gold/15 transition-colors focus:outline-none focus:ring-2 focus:ring-rust"
        >
          <h3 className="font-serif text-lg">Play your story →</h3>
          <p className="text-sm text-ink/60 mt-1">A narrative built entirely from your data.</p>
        </button>
      </section>
    </div>
  );
}
