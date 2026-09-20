import { useMemo, useState } from "react";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import PageHeader from "../components/PageHeader";
import { useReceiptSelection } from "../hooks";

// The fallback dataset uses place names, not geo-coordinates, so the "map"
// is a stylized, deterministic visualization (bubble layout sized by visit
// count) rather than a literal map — per the spec's fallback instruction.

/**
 * Life Map page: locations as a stylized bubble cloud sized by visit count.
 *
 * @param {{ data: object }} props
 * @returns {JSX.Element}
 */
export default function LifeMap({ data }) {
  const { receipts, connections, receiptsById, chapters } = data;
  const [activeLocation, setActiveLocation] = useState(null);
  const { openReceipt, drawerProps } = useReceiptSelection(null, connections, receiptsById);

  const places = useMemo(() => {
    const map = new Map();
    receipts.forEach((r) => {
      if (!r.location) return;
      if (!map.has(r.location)) map.set(r.location, []);
      map.get(r.location).push(r);
    });
    return [...map.entries()]
      .map(([name, list]) => ({
        name,
        list,
        relatedChapters: chapters.filter((c) => c.locations.includes(name)).map((c) => c.title),
      }))
      .sort((a, b) => b.list.length - a.list.length);
  }, [receipts, chapters]);

  const maxCount = places[0]?.list.length || 1;

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Life Map"
        description="This dataset records place names rather than coordinates, so locations are shown as a stylized visit map — sized by how often you returned."
      />

      <div className="flex flex-wrap justify-center gap-4 items-end bg-receipt border border-ink/15 rounded-lg p-6 mb-6">
        {places.map((p) => {
          const size = 60 + (p.list.length / maxCount) * 90;
          return (
            <button
              key={p.name}
              onClick={() => setActiveLocation(p)}
              className="flex flex-col items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-rust rounded-full"
              style={{ width: size }}
              aria-label={`${p.name}, visited ${p.list.length} times`}
            >
              <span
                className="rounded-full flex items-center justify-center font-serif text-ink border-2 border-ink/20 bg-gradient-to-br from-rust/20 to-gold/20 hover:border-ink transition-colors"
                style={{ width: size, height: size, fontSize: Math.max(11, size / 6) }}
              >
                {p.list.length}
              </span>
              <span className="text-[11px] font-mono text-center text-ink/70 leading-tight">{p.name}</span>
            </button>
          );
        })}
      </div>

      {activeLocation && (
        <section className="animate-fadein">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-2xl">{activeLocation.name}</h2>
              <p className="font-mono text-xs text-ink/50">
                {activeLocation.list.length} visits
                {activeLocation.relatedChapters.length > 0 && ` · part of ${activeLocation.relatedChapters.join(", ")}`}
              </p>
            </div>
            <button onClick={() => setActiveLocation(null)} className="font-mono text-xs uppercase text-ink/50 hover:text-ink focus:outline-none">
              Close ✕
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeLocation.list.map((r) => (
              <ReceiptCard key={r.id} receipt={r} onClick={openReceipt} compact />
            ))}
          </div>
        </section>
      )}

      <ReceiptDrawer {...drawerProps} />
    </div>
  );
}
