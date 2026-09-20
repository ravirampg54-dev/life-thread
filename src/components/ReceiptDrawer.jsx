import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import ReceiptCard from "./ReceiptCard";
import { formatDate, formatTime } from "../utils/dateUtils";
import { getConnectedReceipts } from "../analysis/connections";

export default function ReceiptDrawer({ receipt, onClose, onSelect, connections, receiptsById }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (receipt) closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [receipt, onClose]);

  if (!receipt) return null;

  const related = getConnectedReceipts(receipt.id, connections, receiptsById).slice(0, 6);
  const topReason = related[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Details for ${receipt.title}`}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md h-full bg-paper border-l-2 border-ink overflow-y-auto animate-fadein">
        <div className="sticky top-0 bg-paper border-b border-ink/20 p-4 flex items-center justify-between z-10">
          <CategoryBadge category={receipt.category} />
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-ink/10 focus:outline-none focus:ring-2 focus:ring-rust"
            aria-label="Close details panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <h2 className="font-serif text-2xl text-ink leading-tight">{receipt.title}</h2>
          {receipt.subtitle && <p className="text-ink/60 font-mono text-sm mt-1">{receipt.subtitle}</p>}

          <dl className="mt-4 space-y-2 font-mono text-sm border-t border-dashed border-ink/25 pt-3">
            <div className="flex justify-between"><dt className="text-ink/50">Date</dt><dd>{formatDate(receipt.date)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/50">Time</dt><dd>{formatTime(receipt.time)}</dd></div>
            {receipt.location && <div className="flex justify-between"><dt className="text-ink/50">Location</dt><dd>{receipt.location}</dd></div>}
          </dl>

          {receipt.description && (
            <p className="mt-4 text-ink/80 text-sm leading-relaxed font-serif italic border-l-2 border-gold pl-3">
              "{receipt.description}"
            </p>
          )}

          {receipt.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {receipt.tags.map((t) => (
                <span key={t} className="text-[10px] font-mono uppercase tracking-wide bg-ink/5 border border-ink/15 rounded-full px-2 py-0.5">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {topReason && (
            <div className="mt-6 bg-dusk/5 border border-dusk/30 rounded p-3">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-dusk mb-1.5">Why this matters</h3>
              <p className="text-sm text-ink/80">
                This {receipt.category} is connected to{" "}
                <span className="font-semibold">"{topReason.receipt?.title}"</span> because {topReason.conn.reasons.join("; ").toLowerCase()}.
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/60 mb-2">
              Related moments ({related.length})
            </h3>
            {related.length === 0 && <p className="text-sm text-ink/50 italic">No strong data-based connections found for this receipt.</p>}
            <div className="space-y-2">
              {related.map(({ receipt: r, conn }) => (
                <div key={r.id}>
                  <ReceiptCard receipt={r} onClick={onSelect} compact connectionCount={null} />
                  <p className="text-[11px] text-ink/50 font-mono mt-1 pl-1">score {conn.score} · {conn.reasons[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
