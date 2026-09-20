import { X } from "lucide-react";
import { categoryMeta } from "../utils/constants";

export default function ConnectionExplainer({ connection, receiptsById, onClose, onOpenReceipt }) {
  if (!connection) return null;
  const source = receiptsById.get(connection.sourceId);
  const target = receiptsById.get(connection.targetId);
  if (!source || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Why are these connected?">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-receipt border-2 border-ink rounded-lg shadow-2xl p-5 animate-fadein">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60">Why are these connected?</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-ink/10 focus:outline-none focus:ring-2 focus:ring-rust" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {[source, target].map((r, idx) => (
            <div key={r.id} className="flex-1 min-w-0">
              <button onClick={() => onOpenReceipt(r)} className="w-full text-left bg-paper border border-ink/15 rounded p-2.5 hover:border-ink focus:outline-none focus:ring-2 focus:ring-rust">
                <span className="block text-[10px] font-mono uppercase text-ink/50">{categoryMeta(r.category).emoji} {categoryMeta(r.category).label}</span>
                <span className="block text-sm font-serif truncate">{r.title}</span>
              </button>
              {idx === 0 && <div className="text-center text-ink/30 my-1">↕</div>}
            </div>
          ))}
        </div>

        <div className="bg-dusk/5 border border-dusk/30 rounded p-3">
          <div className="font-mono text-[11px] text-dusk uppercase tracking-widest mb-1">Connection score: {connection.score}</div>
          <ul className="space-y-1.5 mt-2">
            {connection.reasons.map((reason, i) => (
              <li key={i} className="text-sm text-ink/80 flex items-start gap-2">
                <span className="text-rust mt-0.5">•</span> {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
