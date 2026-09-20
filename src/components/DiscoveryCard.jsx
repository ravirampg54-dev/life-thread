import { Sparkles } from "lucide-react";

export default function DiscoveryCard({ discovery, onShowEvidence }) {
  return (
    <div className="bg-receipt border border-ink/15 rounded-lg p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <Sparkles size={16} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
        <h3 className="font-serif text-base text-ink leading-snug">{discovery.title}</h3>
      </div>
      <p className="text-sm text-ink/70 pl-6">{discovery.detail}</p>
      {discovery.evidence?.length > 0 && (
        <button
          onClick={() => onShowEvidence(discovery)}
          className="self-start ml-6 mt-1 font-mono text-[11px] uppercase tracking-wide text-dusk border-b border-dusk/40 hover:border-dusk focus:outline-none"
        >
          Show {discovery.evidence.length} supporting receipt{discovery.evidence.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
