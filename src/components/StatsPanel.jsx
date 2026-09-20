export default function StatsPanel({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="stat-card text-center">
          <div className="font-serif text-2xl text-white md:text-3xl">{s.value}</div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
