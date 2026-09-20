import { categoryMeta } from "../utils/constants";

export default function ChapterCard({ chapter, onExplore }) {
  return (
    <div className="bg-receipt border border-ink/15 rounded-lg p-5 shadow-sm flex flex-col gap-3">
      <div>
        <h3 className="font-serif text-xl text-ink tracking-tight">{chapter.title}</h3>
        <p className="font-mono text-[11px] text-ink/50 mt-0.5">{chapter.dateRange} · {chapter.count} receipts</p>
      </div>
      <p className="text-sm text-ink/80 leading-relaxed">{chapter.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {chapter.dominantCategories.map((c) => (
          <span key={c} className="text-[10px] font-mono uppercase tracking-wide bg-ink/5 border border-ink/15 rounded-full px-2 py-0.5">
            {categoryMeta(c).emoji} {categoryMeta(c).label}
          </span>
        ))}
      </div>
      {chapter.locations.length > 0 && (
        <p className="text-xs text-ink/50 font-mono">📍 {chapter.locations.join(", ")}</p>
      )}
      <button
        onClick={() => onExplore(chapter)}
        className="mt-1 self-start font-mono text-xs uppercase tracking-wide border border-ink rounded px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-rust"
      >
        Explore Chapter →
      </button>
    </div>
  );
}
