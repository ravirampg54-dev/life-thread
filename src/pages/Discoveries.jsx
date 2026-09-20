import DiscoveryCard from "../components/DiscoveryCard";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import PageHeader from "../components/PageHeader";
import { useDisclosure, useReceiptSelection } from "../hooks";

export default function Discoveries({ data }) {
  const { discoveries, connections, receiptsById, analysisReady } = data;
  const { value: activeDiscovery, open: showDiscovery, close: closeDiscovery } = useDisclosure();
  const { openReceipt, drawerProps } = useReceiptSelection(null, connections, receiptsById);

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <PageHeader title="Discoveries" description="Patterns detected directly from the data — never a claim about who you are." />

      {!analysisReady ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60"
        >
          <p className="font-serif text-lg text-ink">Looking for patterns…</p>
          <p className="mt-2">Cross-referencing every receipt in the background.</p>
        </div>
      ) : discoveries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60">
          <p className="font-serif text-lg text-ink">No discoveries yet.</p>
          <p className="mt-2">Patterns become visible as more life moments accumulate.</p>
        </div>
      ) : (
        <div className="space-y-4 transition-all duration-200">
          {discoveries.map((d) => (
            <DiscoveryCard key={d.id} discovery={d} onShowEvidence={showDiscovery} />
          ))}
        </div>
      )}

      {activeDiscovery && (
        <section className="mt-8 animate-fadein">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Evidence: {activeDiscovery.title}</h2>
            <button onClick={closeDiscovery} className="font-mono text-xs uppercase text-ink/50 hover:text-ink focus:outline-none">
              Close ✕
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeDiscovery.evidence.map((r) => (
              <ReceiptCard key={r.id} receipt={r} onClick={openReceipt} />
            ))}
          </div>
        </section>
      )}

      <ReceiptDrawer {...drawerProps} />
    </div>
  );
}
