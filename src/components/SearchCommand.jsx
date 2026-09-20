import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { categoryMeta } from "../utils/constants";
import { formatDate } from "../utils/dateUtils";
import { bindFocusTrap, restoreFocus } from "../utils/focusTrap";

export default function SearchCommand({ receipts, onSelectReceipt }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const restoreTargetRef = useRef(null);
  const triggerRef = useRef(null);

  const toggle = useCallback((e) => {
    const isK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
    const isSlash = e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA";
    if (isK || isSlash) {
      e.preventDefault();
      setOpen((o) => !o);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, [toggle]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) {
      restoreFocus(restoreTargetRef.current);
      restoreTargetRef.current = null;
      return undefined;
    }

    restoreTargetRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : triggerRef.current;

    const id = requestAnimationFrame(() => {
      containerRef.current?.querySelector("input")?.focus();
    });
    const unbind = bindFocusTrap(containerRef.current, () => setOpen(false));
    return () => {
      cancelAnimationFrame(id);
      unbind();
    };
  }, [open]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return receipts
      .filter((r) =>
        [r.title, r.description, r.location, r.category, ...(r.tags || [])]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [debouncedQuery, receipts]);

  if (!open) {
    return (
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 p-3 text-white shadow-[0_12px_28px_rgba(139,92,246,0.35)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400 md:bottom-6 md:right-6 motion-reduce:hover:scale-100"
        aria-label="Open search (Ctrl+K or /)"
        title="Search (Ctrl+K or /)"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" role="dialog" aria-modal="true" aria-label="Search" ref={containerRef}>
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950 shadow-[0_30px_60px_rgba(2,6,23,0.7)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search size={16} className="text-slate-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search moments — coffee, Friday, midnight..."
            className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-slate-400"
            aria-label="Search receipts"
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">ESC</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {results.map((r) => {
            const meta = categoryMeta(r.category);
            return (
              <li key={r.id}>
                <button
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    onSelectReceipt(r);
                    navigate("/explorer");
                  }}
                >
                  <span aria-hidden="true">{meta.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white">{r.title}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-slate-400">{meta.label} · {formatDate(r.date)}</span>
                  </span>
                </button>
              </li>
            );
          })}
          {debouncedQuery && results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-slate-400">No receipts match "{debouncedQuery}"</li>
          )}
          {!debouncedQuery && (
            <li className="px-4 py-6 text-center text-sm text-slate-400">Type to search {receipts.length.toLocaleString()} moments.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
