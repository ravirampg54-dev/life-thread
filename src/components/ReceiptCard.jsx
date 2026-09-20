import { categoryMeta } from "../utils/constants";
import { formatDate, formatTime } from "../utils/dateUtils";

export default function ReceiptCard({ receipt, onClick, connectionCount = null, compact = false }) {
  const meta = categoryMeta(receipt.category);
  return (
    <button
      onClick={() => onClick && onClick(receipt)}
      className={`group relative w-full text-left rounded-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(10,15,25,0.96))] shadow-[0_12px_28px_rgba(2,6,23,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/40 hover:shadow-[0_18px_35px_rgba(139,92,246,0.14)] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
        compact ? "p-3" : "p-4"
      }`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, rgba(148,163,184,0.04) 28px)",
      }}
      aria-label={`Open receipt: ${receipt.title}, ${meta.label}, ${formatDate(receipt.date)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">
          <span aria-hidden="true">{meta.emoji}</span>
          {meta.label}
        </div>
        {connectionCount !== null && connectionCount > 0 && (
          <span className="shrink-0 rounded-full border border-violet-400/40 bg-violet-500/10 px-1.5 py-0.5 font-mono text-[10px] text-violet-200">
            {connectionCount} links
          </span>
        )}
      </div>
      <div className={`mt-2 font-serif leading-snug text-white ${compact ? "text-sm" : "text-base"}`}>{receipt.title}</div>
      {receipt.subtitle && <div className="mt-0.5 font-mono text-[11px] text-slate-400">{receipt.subtitle}</div>}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-white/10 pt-2 font-mono text-[11px] text-slate-400">
        <span>{formatDate(receipt.date)} · {formatTime(receipt.time)}</span>
        {receipt.location && <span className="max-w-[40%] truncate">📍 {receipt.location}</span>}
      </div>
    </button>
  );
}
