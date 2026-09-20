import ThreadCard from "../components/ThreadCard";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import PageHeader from "../components/PageHeader";
import { useDisclosure, useReceiptSelection } from "../hooks";
import { formatDate } from "../utils/dateUtils";

export default function Threads({ data }) {
  const { threads, connections } = data;
  const { value: openThread, open: showThread, close: closeThread } = useDisclosure();
  const { openReceipt, drawerProps } = useReceiptSelection(null, connections, data.receiptsById);

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <PageHeader title="Threads" description="Recurring relationships between different receipt types, found across multiple occasions." />

      {threads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60">
          <p className="font-serif text-lg text-ink">No recurring threads detected yet.</p>
          <p className="mt-2">More activity will reveal stronger temporal and thematic patterns.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 transition-all duration-200">
          {threads.map((t) => (
            <ThreadCard key={t.id} thread={t} onOpen={showThread} />
          ))}
        </div>
      )}

      {openThread && (
        <section className="mt-10 animate-fadein">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">{openThread.title}</h2>
            <button onClick={closeThread} className="font-mono text-xs uppercase text-ink/50 hover:text-ink focus:outline-none">
              Close ✕
            </button>
          </div>
          <div className="space-y-6">
            {openThread.occurrences.map((occ) => (
              <div key={occ.date} className="border-l-2 border-rust/40 pl-4">
                <p className="font-mono text-xs text-ink/50 mb-2">{formatDate(occ.date)}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {occ.chain.map((r) => (
                    <ReceiptCard key={r.id} receipt={r} onClick={openReceipt} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ReceiptDrawer {...drawerProps} />
    </div>
  );
}
