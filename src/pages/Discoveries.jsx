import { useState } from "react";
import DiscoveryCard from "../components/DiscoveryCard";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";

export default function Discoveries({ data }) {
  const { discoveries, connections, receiptsById } = data;
  const [activeDiscovery, setActiveDiscovery] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Discoveries</h1>
        <p className="text-ink/60 text-sm mt-1">Patterns detected directly from the data — never a claim about who you are.</p>
      </header>

      <div className="space-y-4">
        {discoveries.map((d) => (
          <DiscoveryCard key={d.id} discovery={d} onShowEvidence={setActiveDiscovery} />
        ))}
      </div>

      {activeDiscovery && (
        <section className="mt-8 animate-fadein">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Evidence: {activeDiscovery.title}</h2>
            <button onClick={() => setActiveDiscovery(null)} className="font-mono text-xs uppercase text-ink/50 hover:text-ink focus:outline-none">
              Close ✕
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeDiscovery.evidence.map((r) => (
              <ReceiptCard key={r.id} receipt={r} onClick={setSelectedReceipt} />
            ))}
          </div>
        </section>
      )}

      <ReceiptDrawer
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onSelect={setSelectedReceipt}
        connections={connections}
        receiptsById={receiptsById}
      />
    </div>
  );
}
