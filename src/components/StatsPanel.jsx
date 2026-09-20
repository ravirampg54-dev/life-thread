export default function StatsPanel({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-receipt border border-ink/15 rounded-lg p-4 text-center shadow-sm">
          <div className="font-serif text-2xl md:text-3xl text-ink">{s.value}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
