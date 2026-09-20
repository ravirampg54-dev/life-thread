import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReceiptCard from "./ReceiptCard";

const PAGE_SIZE = 24;

/**
 * Paginated receipt grid for evidence lists that can contain thousands of rows.
 */
export default function EvidenceGrid({ receipts = [], onSelect, emptyLabel = "No supporting receipts." }) {
  const [page, setPage] = useState(0);
  if (!receipts.length) {
    return <p className="text-sm text-ink/60 italic">{emptyLabel}</p>;
  }

  const pageCount = Math.max(1, Math.ceil(receipts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = receipts.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink/50">
        Showing {currentPage * PAGE_SIZE + 1}–{currentPage * PAGE_SIZE + visible.length} of {receipts.length}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((r) => (
          <ReceiptCard key={r.id} receipt={r} onClick={onSelect} compact />
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="mt-4 flex items-center justify-between gap-3" aria-label="Evidence pagination">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink/70 hover:border-ink disabled:opacity-35 focus:outline-none focus:ring-2 focus:ring-rust"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Prev
          </button>
          <span className="font-mono text-xs text-ink/50">
            Page {currentPage + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            disabled={currentPage >= pageCount - 1}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink/70 hover:border-ink disabled:opacity-35 focus:outline-none focus:ring-2 focus:ring-rust"
          >
            Next <ChevronRight size={14} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
