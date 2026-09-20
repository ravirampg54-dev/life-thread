import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import ReceiptCard from "./ReceiptCard";
import { formatDate, formatTime } from "../utils/dateUtils";
import { getConnectedReceipts } from "../analysis/connections";

/**
 * Slide-over detail panel for a single receipt, with focus trapping and
 * focus restoration. Shows metadata, tags, top reason, and related moments.
 *
 * @param {Receipt|null} receipt The receipt to display, or null to render nothing.
 * @param {Function} onClose Closes the drawer.
 * @param {Function} onSelect Opens another receipt from the related list.
 * @param {Connection[]} connections All graph edges used to find related receipts.
 * @param {Map<string, Receipt>} receiptsById For looking up connected receipts.
 * @returns {JSX.Element|null}
 */
export default function ReceiptDrawer({ receipt, onClose, onSelect, connections, receiptsById }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!receipt) return undefined;
    const restoreTarget = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = [...document.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
        .filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (restoreTarget instanceof HTMLElement && document.contains(restoreTarget)) restoreTarget.focus();
    };
  }, [receipt, onClose]);

  if (!receipt) return null;

  const related = getConnectedReceipts(receipt.id, connections, receiptsById).slice(0, 6);
  const topReason = related[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Details for ${receipt.title}`}>
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-slate-950 animate-fadein">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/90 p-4 backdrop-blur-xl">
          <CategoryBadge category={receipt.category} />
          <button
            ref={closeRef}
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-400"
            aria-label="Close details panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <h2 className="font-serif text-2xl leading-tight text-white">{receipt.title}</h2>
          {receipt.subtitle && <p className="mt-1 font-mono text-sm text-slate-400">{receipt.subtitle}</p>}

          <dl className="mt-4 space-y-3 border-t border-dashed border-white/10 pt-3 font-mono text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Date</dt><dd className="text-slate-200">{formatDate(receipt.date)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Time</dt><dd className="text-slate-200">{formatTime(receipt.time)}</dd></div>
            {receipt.location && <div className="flex justify-between"><dt className="text-slate-400">Location</dt><dd className="text-slate-200">{receipt.location}</dd></div>}
          </dl>

          {receipt.description && (
            <p className="mt-4 border-l-2 border-violet-400/60 pl-3 font-serif text-sm italic leading-relaxed text-slate-200">
              “{receipt.description}”
            </p>
          )}

          {receipt.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {receipt.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {topReason && (
            <div className="mt-6 rounded-xl border border-violet-400/30 bg-violet-500/10 p-3">
              <h3 className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.24em] text-violet-200">Why this matters</h3>
              <p className="text-sm leading-6 text-slate-200">
                This {receipt.category} is connected to <span className="font-semibold text-white">“{topReason.receipt?.title}”</span> because {topReason.conn.reasons.join("; ").toLowerCase()}.
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
              Related moments ({related.length})
            </h3>
            {related.length === 0 && <p className="text-sm text-slate-400 italic">No strong data-based connections found for this receipt.</p>}
            <div className="space-y-2">
              {related.map(({ receipt: r, conn }) => (
                <div key={r.id}>
                  <ReceiptCard receipt={r} onClick={onSelect} compact connectionCount={null} />
                  <p className="mt-1 pl-1 font-mono text-[11px] text-slate-400">score {conn.score} · {conn.reasons[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
