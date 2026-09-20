import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { categoryMeta } from "../utils/constants";
import { formatDate } from "../utils/dateUtils";

export default function SearchCommand({ receipts, onSelectReceipt }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const toggle = useCallback((e) => {
    const isK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
    const isSlash = e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA";
    if (isK || isSlash) {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, [toggle]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return receipts
      .filter((r) =>
        [r.title, r.description, r.location, r.category, ...(r.tags || [])]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query, receipts]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-30 bg-ink text-paper rounded-full p-3 shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-rust"
        aria-label="Open search (Ctrl+K or /)"
        title="Search (Ctrl+K or /)"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="relative w-full max-w-lg bg-receipt border-2 border-ink rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink/20 px-4 py-3">
          <Search size={16} className="text-ink/50" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search moments — coffee, Friday, midnight..."
            className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-ink/40"
            aria-label="Search receipts"
          />
          <kbd className="text-[10px] font-mono text-ink/40 border border-ink/20 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {results.map((r) => {
            const meta = categoryMeta(r.category);
            return (
              <li key={r.id}>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-ink/5 flex items-center gap-3 focus:outline-none focus:bg-ink/10"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    onSelectReceipt(r);
                    navigate("/explorer");
                  }}
                >
                  <span aria-hidden="true">{meta.emoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm truncate">{r.title}</span>
                    <span className="block text-[11px] text-ink/50 font-mono">{meta.label} · {formatDate(r.date)}</span>
                  </span>
                </button>
              </li>
            );
          })}
          {query && results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-ink/50">No receipts match "{query}"</li>
          )}
        </ul>
      </div>
    </div>
  );
}
