import { useState } from "react";
import ThreadCard from "../components/ThreadCard";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import { formatDate } from "../utils/dateUtils";

export default function Threads({ data }) {
  const { threads, receiptsById, connections } = data;
  const [openThread, setOpenThread] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Threads</h1>
        <p className="text-ink/60 text-sm mt-1">Recurring relationships between different receipt types, found across multiple occasions.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {threads.map((t) => (
          <ThreadCard key={t.id} thread={t} onOpen={setOpenThread} />
        ))}
      </div>

      {openThread && (
        <section className="mt-10 animate-fadein">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">{openThread.title}</h2>
            <button onClick={() => setOpenThread(null)} className="font-mono text-xs uppercase text-ink/50 hover:text-ink focus:outline-none">
              Close ✕
            </button>
          </div>
          <div className="space-y-6">
            {openThread.occurrences.map((occ) => (
              <div key={occ.date} className="border-l-2 border-rust/40 pl-4">
                <p className="font-mono text-xs text-ink/50 mb-2">{formatDate(occ.date)}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {occ.chain.map((r) => (
                    <ReceiptCard key={r.id} receipt={r} onClick={setSelectedReceipt} compact />
                  ))}
                </div>
              </div>
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
