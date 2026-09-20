import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import ReceiptCard from "../components/ReceiptCard";
import ReceiptDrawer from "../components/ReceiptDrawer";
import { useReceiptSelection } from "../hooks/useReceiptSelection";

export default function StoryMode({ data }) {
  const navigate = useNavigate();
  const { story, receiptsById, connections } = data;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { selectedReceipt, openReceipt, closeReceipt } = useReceiptSelection();

  const scene = story[index];

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, story.length - 1)), [story.length]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const isLastScene = index >= story.length - 1;
  const effectivePlaying = playing && !isLastScene;

  useEffect(() => {
    if (!effectivePlaying) return;
    const t = setTimeout(next, 4500);
    return () => clearTimeout(t);
  }, [effectivePlaying, next]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const evidenceReceipts = (scene.evidence || []).map((id) => receiptsById.get(id)).filter(Boolean).slice(0, 6);

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <div className="flex items-center justify-between p-4 md:p-6">
        <span className="font-mono text-xs text-paper/50 uppercase tracking-widest">Story Mode</span>
        <div className="font-mono text-xs text-paper/50">{index + 1} / {story.length}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
        <p key={scene.id} className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-4 animate-fadein">{scene.heading}</p>
        <h2 className="font-serif text-3xl md:text-5xl leading-tight animate-fadein">{scene.line}</h2>
        {typeof scene.detail === "string" && (
          <p className="mt-6 text-paper/70 text-sm md:text-base leading-relaxed animate-fadein">{scene.detail}</p>
        )}

        {evidenceReceipts.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 w-full animate-fadein">
            {evidenceReceipts.map((r) => (
              <div key={r.id} className="text-ink">
                <ReceiptCard receipt={r} onClick={openReceipt} compact />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 p-6">
        <button onClick={prev} disabled={index === 0} className="p-2.5 rounded-full border border-paper/30 disabled:opacity-30 hover:bg-paper/10 focus:outline-none focus:ring-2 focus:ring-rust" aria-label="Previous scene">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setPlaying((p) => !p)} className="p-3 rounded-full bg-paper text-ink hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-rust" aria-label={effectivePlaying ? "Pause" : "Play"}>
          {effectivePlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={next} disabled={index === story.length - 1} className="p-2.5 rounded-full border border-paper/30 disabled:opacity-30 hover:bg-paper/10 focus:outline-none focus:ring-2 focus:ring-rust" aria-label="Next scene">
          <ChevronRight size={18} />
        </button>
        <button onClick={() => navigate("/overview")} className="ml-4 p-2.5 rounded-full border border-paper/30 hover:bg-paper/10 focus:outline-none focus:ring-2 focus:ring-rust" aria-label="Exit story mode">
          <X size={18} />
        </button>
      </div>

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
