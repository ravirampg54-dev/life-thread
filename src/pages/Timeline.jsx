import { useMemo, useState } from "react";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import PageHeader from "../components/PageHeader";
import { getConnectedReceipts } from "../analysis/connections";
import { toTimestamp } from "../utils/dateUtils";
import { CATEGORY_ORDER, categoryMeta } from "../utils/constants";
import { useReceiptSelection } from "../hooks";

export default function Timeline({ data }) {
  const { receipts, connections, receiptsById, categories } = data;
  const [category, setCategory] = useState("all");
  const [highlightSet, setHighlightSet] = useState(null);
  const { selectedReceipt, openReceipt, closeReceipt } = useReceiptSelection(null, connections, receiptsById);

  const sorted = useMemo(() => [...receipts].sort((a, b) => toTimestamp(a) - toTimestamp(b)), [receipts]);

  const filtered = useMemo(
    () => (category === "all" ? sorted : sorted.filter((r) => r.category === category)),
    [sorted, category]
  );

  const grouped = useMemo(() => {
    const byMonth = new Map();
    filtered.forEach((r) => {
      const key = r.date.slice(0, 7);
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(r);
    });
    return [...byMonth.entries()];
  }, [filtered]);

  function handleSelect(r) {
    openReceipt(r);
    const related = getConnectedReceipts(r.id, connections, receiptsById);
    setHighlightSet(new Set([r.id, ...related.map((x) => x.receipt.id)]));
  }

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <PageHeader title="Timeline" description="Click a receipt to highlight everything it's connected to." />

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by category">
        <button
          onClick={() => setCategory("all")}
          className={`font-mono text-[11px] uppercase tracking-wide rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-rust ${
            category === "all" ? "bg-ink text-paper border-ink" : "border-ink/20 text-ink/60 hover:border-ink"
          }`}
        >
          All
        </button>
        {CATEGORY_ORDER.filter((c) => categories.includes(c)).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`font-mono text-[11px] uppercase tracking-wide rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-rust ${
              category === c ? "" : "border-ink/20 text-ink/60 hover:border-ink"
            }`}
            style={category === c ? { borderColor: categoryMeta(c).color, color: categoryMeta(c).color, backgroundColor: `${categoryMeta(c).color}26` } : {}}
          >
            {categoryMeta(c).emoji} {categoryMeta(c).label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {grouped.map(([month, items]) => (
          <div key={month}>
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-3 sticky top-0 bg-paper py-1">
              {new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((r) => (
                <div key={r.id} className={highlightSet && !highlightSet.has(r.id) ? "opacity-30 transition-opacity" : "transition-opacity"}>
                  <ReceiptCard receipt={r} onClick={handleSelect} compact />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ReceiptDrawer
        receipt={selectedReceipt}
        onClose={() => {
                closeReceipt();
                setHighlightSet(null);
        }}
        onSelect={handleSelect}
        connections={connections}
        receiptsById={receiptsById}
      />
    </div>
  );
}
