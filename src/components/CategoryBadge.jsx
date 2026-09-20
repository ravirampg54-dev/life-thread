import { categoryMeta } from "../utils/constants";

export default function CategoryBadge({ category, size = "sm" }) {
  const meta = categoryMeta(category);
  const sizeCls = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-mono uppercase tracking-wide border ${sizeCls}`}
      style={{ borderColor: meta.color, color: meta.color, backgroundColor: `${meta.color}14` }}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
