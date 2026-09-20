import { useState } from "react";
import ChapterCard from "../components/ChapterCard";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import { useReceiptSelection } from "../hooks/useReceiptSelection";

export default function Chapters({ data }) {
  const { chapters, receiptsById, connections } = data;
  const [openChapter, setOpenChapter] = useState(null);
  const { selectedReceipt, openReceipt, closeReceipt } = useReceiptSelection();

  const chapterReceipts = openChapter ? openChapter.receiptIds.map((id) => receiptsById.get(id)).filter(Boolean) : [];

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Chapters</h1>
        <p className="text-ink/60 text-sm mt-1">Meaningful periods detected automatically from the dataset.</p>
      </header>

      {chapters.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60">
          <p className="font-serif text-lg text-ink">No chapters detected.</p>
          <p className="mt-2">Add more patterned records to reveal distinct life phases.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 transition-all duration-200">
          {chapters.map((c) => (
            <ChapterCard key={c.id} chapter={c} onExplore={setOpenChapter} />
          ))}
        </div>
      )}

      {openChapter && (
        <section className="mt-10 animate-fadein">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">{openChapter.title}</h2>
            <button onClick={() => setOpenChapter(null)} className="font-mono text-xs uppercase text-ink/50 hover:text-ink focus:outline-none">
              Close ✕
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {chapterReceipts.map((r) => (
              <ReceiptCard key={r.id} receipt={r} onClick={openReceipt} />
            ))}
          </div>
        </section>
      )}

      <ReceiptDrawer
        receipt={selectedReceipt}
        onClose={closeReceipt}
        onSelect={openReceipt}
        connections={connections}
        receiptsById={receiptsById}
      />
    </div>
  );
}
