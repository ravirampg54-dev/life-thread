import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search as SearchIcon } from "lucide-react";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import PageHeader from "../components/PageHeader";
import { useReceiptSelection } from "../hooks";
import { CATEGORY_ORDER, categoryMeta } from "../utils/constants";
import { toTimestamp } from "../utils/dateUtils";

const SORTS = [
  { id: "chrono", label: "Chronological" },
  { id: "connected", label: "Most Connected" },
  { id: "recent", label: "Most Recent" },
  { id: "category", label: "Category" },
];

// Keep the rendered grid small so the Explorer stays fast even when the local
// archive grows to thousands of receipts.
const PAGE_SIZE = 24;

export default function Explorer({ data, initialReceipt, onConsumeInitial }) {
  const { receipts, connections, connectionsByReceipt, receiptsById, categories, locations, chapters } = data;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [connectedOnly, setConnectedOnly] = useState(false);
  const [chapterFilter, setChapterFilter] = useState("all");
  const [sort, setSort] = useState("chrono");
  const [page, setPage] = useState(0);
  const { openReceipt, drawerProps } = useReceiptSelection(initialReceipt, connections, receiptsById);

  useEffect(() => {
    if (initialReceipt && onConsumeInitial) {
      onConsumeInitial();
    }
  }, [initialReceipt, onConsumeInitial]);

  const results = useMemo(() => {
    let list = receipts.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (location !== "all" && r.location !== location) return false;
      if (connectedOnly && !(connectionsByReceipt.get(r.id)?.length > 0)) return false;
      if (chapterFilter !== "all") {
        const chap = chapters.find((c) => c.id === chapterFilter);
        if (!chap || !chap.receiptIds.includes(r.id)) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = [r.title, r.description, r.location, r.category, ...(r.tags || [])].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "connected":
        list = list.slice().sort((a, b) => (connectionsByReceipt.get(b.id)?.length || 0) - (connectionsByReceipt.get(a.id)?.length || 0));
        break;
      case "recent":
        list = list.slice().sort((a, b) => toTimestamp(b) - toTimestamp(a));
        break;
      case "category":
        list = list.slice().sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        list = list.slice().sort((a, b) => toTimestamp(a) - toTimestamp(b));
    }
    return list;
  }, [receipts, category, location, connectedOnly, chapterFilter, query, sort, connectionsByReceipt, chapters]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = results.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <PageHeader title="Explorer" description="Search and filter every receipt. Everything runs locally in your browser." />

      <div className="bg-receipt border border-ink/15 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex items-center gap-2 border border-ink/20 rounded px-3 py-2">
          <SearchIcon size={16} className="text-ink/40" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="coffee, Friday, movie, study, midnight..."
            className="flex-1 bg-transparent outline-none text-sm font-mono placeholder:text-ink/40"
            aria-label="Search receipts"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
            Category
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(0); }} className="border border-ink/25 rounded px-2 py-1.5 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-rust">
              <option value="all">All</option>
              {CATEGORY_ORDER.filter((c) => categories.includes(c)).map((c) => (
                <option key={c} value={c}>{categoryMeta(c).label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
            Location
            <select value={location} onChange={(e) => { setLocation(e.target.value); setPage(0); }} className="border border-ink/25 rounded px-2 py-1.5 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-rust">
              <option value="all">All</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
            Chapter
            <select value={chapterFilter} onChange={(e) => { setChapterFilter(e.target.value); setPage(0); }} className="border border-ink/25 rounded px-2 py-1.5 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-rust">
              <option value="all">All</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-mono text-ink/60">
            Sort
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }} className="border border-ink/25 rounded px-2 py-1.5 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-rust">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>

          <label className="flex items-end gap-2 text-xs font-mono text-ink/60 pb-1.5">
            <input type="checkbox" checked={connectedOnly} onChange={(e) => { setConnectedOnly(e.target.checked); setPage(0); }} className="focus:outline-none focus:ring-2 focus:ring-rust" />
            Connected only
          </label>
        </div>
      </div>

      <p className="font-mono text-xs text-ink/50 mb-3">{results.length} result{results.length !== 1 ? "s" : ""}</p>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60">
          <p className="font-serif text-lg text-ink">No moments found.</p>
          <p className="mt-2">Try another date, location, or keyword.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-all duration-200">
            {visible.map((r) => (
              <ReceiptCard key={r.id} receipt={r} onClick={openReceipt} connectionCount={connectionsByReceipt.get(r.id)?.length || 0} />
            ))}
          </div>

          <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Results pagination">
            <button
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
              onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
              disabled={currentPage >= pageCount - 1}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink/70 hover:border-ink disabled:opacity-35 focus:outline-none focus:ring-2 focus:ring-rust"
            >
              Next <ChevronRight size={14} aria-hidden="true" />
            </button>
          </nav>
        </>
      )}

      <ReceiptDrawer {...drawerProps} />
    </div>
  );
}
