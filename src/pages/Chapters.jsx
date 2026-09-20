import { useDisclosure, useReceiptSelection } from "../hooks";
import PageHeader from "../components/PageHeader";
import ChapterCard from "../components/ChapterCard";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";

export default function Chapters({ data }) {
  const { chapters, receiptsById, connections } = data;
  const { value: openChapter, open: showChapter, close: closeChapter } = useDisclosure();
  const { openReceipt, drawerProps } = useReceiptSelection(null, connections, receiptsById);

  const chapterReceipts = openChapter ? openChapter.receiptIds.map((id) => receiptsById.get(id)).filter(Boolean) : [];

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <PageHeader title="Chapters" description="Meaningful periods detected automatically from the dataset." />

      {chapters.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-receipt p-8 text-center text-sm text-ink/60">
          <p className="font-serif text-lg text-ink">No chapters detected.</p>
          <p className="mt-2">Add more patterned records to reveal distinct life phases.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 transition-all duration-200">
          {chapters.map((c) => (
            <ChapterCard key={c.id} chapter={c} onExplore={showChapter} />
          ))}
        </div>
      )}

      {openChapter && (
        <section className="mt-10 animate-fadein">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">{openChapter.title}</h2>
            <button onClick={closeChapter} className="font-mono text-xs uppercase text-ink/50 hover:text-ink focus:outline-none">
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

      <ReceiptDrawer {...drawerProps} />
    </div>
  );
}
