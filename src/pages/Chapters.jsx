import { useState } from "react";
import ChapterCard from "../components/ChapterCard";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";

export default function Chapters({ data }) {
  const { chapters, receiptsById, connections } = data;
  const [openChapter, setOpenChapter] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const chapterReceipts = openChapter ? openChapter.receiptIds.map((id) => receiptsById.get(id)).filter(Boolean) : [];

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Chapters</h1>
        <p className="text-ink/60 text-sm mt-1">Meaningful periods detected automatically from the dataset.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {chapters.map((c) => (
          <ChapterCard key={c.id} chapter={c} onExplore={setOpenChapter} />
        ))}
      </div>

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
