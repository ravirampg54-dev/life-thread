import { useState } from "react";
import ConnectionGraph from "../graph/ConnectionGraph";
import ConnectionExplainer from "../components/ConnectionExplainer";
import ReceiptDrawer from "../components/ReceiptDrawer";

export default function GraphPage({ data }) {
  const { receipts, connections, receiptsById } = data;
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Connection Graph</h1>
        <p className="text-ink/60 text-sm mt-1">
          Each node is a receipt. Each edge is a data-backed relationship — click one to see why.
        </p>
      </header>

      <ConnectionGraph
        receipts={receipts}
        connections={connections}
        onSelectConnection={setActiveConnection}
        focusReceiptId={selectedReceipt?.id}
      />

      <ConnectionExplainer
        connection={activeConnection}
        receiptsById={receiptsById}
        onClose={() => setActiveConnection(null)}
        onOpenReceipt={(r) => {
          setActiveConnection(null);
          setSelectedReceipt(r);
        }}
      />

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
