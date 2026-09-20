import { categoryMeta } from "../utils/constants";
import { formatDate, formatTime } from "../utils/dateUtils";

export default function ReceiptCard({ receipt, onClick, connectionCount = null, compact = false }) {
  const meta = categoryMeta(receipt.category);
  return (
    <button
      onClick={() => onClick && onClick(receipt)}
      className={`group relative w-full text-left bg-receipt border border-ink/15 shadow-[2px_3px_0_rgba(11,10,8,0.15)] hover:shadow-[3px_5px_0_rgba(11,10,8,0.25)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-rust focus:ring-offset-2 focus:ring-offset-paper ${
        compact ? "p-3" : "p-4"
      }`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, rgba(11,10,8,0.04) 28px)",
      }}
      aria-label={`Open receipt: ${receipt.title}, ${meta.label}, ${formatDate(receipt.date)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/60">
          <span aria-hidden="true">{meta.emoji}</span>
          {meta.label}
        </div>
        {connectionCount !== null && connectionCount > 0 && (
          <span className="font-mono text-[10px] text-rust border border-rust/40 rounded-full px-1.5 py-0.5 shrink-0">
            {connectionCount} links
          </span>
        )}
      </div>
      <div className={`font-serif text-ink mt-1 ${compact ? "text-sm" : "text-base"} leading-snug`}>{receipt.title}</div>
      {receipt.subtitle && <div className="text-xs text-ink/60 font-mono mt-0.5">{receipt.subtitle}</div>}
      <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink/50 border-t border-dashed border-ink/20 pt-2">
        <span>{formatDate(receipt.date)} · {formatTime(receipt.time)}</span>
        {receipt.location && <span className="truncate max-w-[40%]">📍 {receipt.location}</span>}
      </div>
    </button>
  );
}
