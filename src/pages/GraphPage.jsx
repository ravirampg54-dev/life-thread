import { useState } from "react";
import ConnectionGraph from "../graph/ConnectionGraph";
import ConnectionExplainer from "../components/ConnectionExplainer";
import ReceiptDrawer from "../components/ReceiptDrawer";
import PageHeader from "../components/PageHeader";
import { useReceiptSelection } from "../hooks";

export default function GraphPage({ data }) {
  const { receipts, connections, receiptsById, analysisReady } = data;
  const [activeConnection, setActiveConnection] = useState(null);
  const { selectedReceipt, openReceipt, drawerProps } = useReceiptSelection(null, connections, receiptsById);

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Connection Graph"
        description="Each node is a receipt. Each edge is a data-backed relationship — click one to see why."
      />

      {!analysisReady ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60"
        >
          <p className="font-serif text-lg text-ink">Analyzing connections…</p>
          <p className="mt-2">Scoring relationships across the full archive in the background.</p>
        </div>
      ) : connections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60">
          <p className="font-serif text-lg text-ink">No strong connections yet.</p>
          <p className="mt-2">As more moments overlap in time, place, or topic, the graph will fill in.</p>
        </div>
      ) : (
        <ConnectionGraph
          receipts={receipts}
          connections={connections}
          onSelectConnection={setActiveConnection}
          onSelectNode={openReceipt}
          focusReceiptId={selectedReceipt?.id}
        />
      )}

      <ConnectionExplainer
        connection={activeConnection}
        receiptsById={receiptsById}
        onClose={() => setActiveConnection(null)}
        onOpenReceipt={(r) => {
          setActiveConnection(null);
          openReceipt(r);
        }}
      />

      <ReceiptDrawer {...drawerProps} />
    </div>
  );
}
