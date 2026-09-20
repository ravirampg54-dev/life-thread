import { ArrowDown } from "lucide-react";
import { categoryMeta } from "../utils/constants";

export default function ThreadCard({ thread, onOpen }) {
  return (
    <div className="bg-receipt border border-ink/15 rounded-lg p-5 shadow-sm flex flex-col gap-3">
      <h3 className="font-serif text-lg text-ink tracking-tight">{thread.title}</h3>
      <div className="flex flex-col items-start gap-1">
        {thread.categorySequence.map((cat, idx) => {
          const meta = categoryMeta(cat);
          return (
            <div key={idx} className="flex flex-col items-start">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono"
                style={{ borderColor: meta.color, color: meta.color, backgroundColor: `${meta.color}14` }}
              >
                <span aria-hidden="true">{meta.emoji}</span> {meta.label}
              </span>
              {idx < thread.categorySequence.length - 1 && (
                <ArrowDown size={14} className="text-ink/30 my-0.5 ml-3" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-sm text-ink/70">{thread.evidence}</p>
      <p className="font-mono text-[11px] text-ink/50">{thread.occurrenceCount} occurrences · {thread.allReceiptIds.length} receipts</p>
      <button
        onClick={() => onOpen(thread)}
        className="mt-1 self-start font-mono text-xs uppercase tracking-wide border border-ink rounded px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-rust"
      >
        Open Thread →
      </button>
    </div>
  );
}
