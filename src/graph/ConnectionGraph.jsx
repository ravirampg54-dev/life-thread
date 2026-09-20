import { useMemo, useState } from "react";
import { computeLayout } from "./layout";
import { categoryMeta } from "../utils/constants";

const WIDTH = 900;
const HEIGHT = 620;

export default function ConnectionGraph({ receipts, connections, onSelectConnection, focusReceiptId }) {
  const [hoveredEdge, setHoveredEdge] = useState(null);

  // Cap node count for a legible, performant graph; prioritize the most connected nodes.
  const { nodes, edges } = useMemo(() => {
    const degree = new Map();
    connections.forEach((c) => {
      degree.set(c.sourceId, (degree.get(c.sourceId) || 0) + 1);
      degree.set(c.targetId, (degree.get(c.targetId) || 0) + 1);
    });
    const connectedIds = new Set(degree.keys());
    const nodeList = receipts.filter((r) => connectedIds.has(r.id));
    const nodeIdSet = new Set(nodeList.map((n) => n.id));
    const edgeList = connections.filter((c) => nodeIdSet.has(c.sourceId) && nodeIdSet.has(c.targetId));
    return { nodes: nodeList, edges: edgeList };
  }, [receipts, connections]);

  const positions = useMemo(() => computeLayout(nodes, edges, WIDTH, HEIGHT), [nodes, edges]);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full overflow-x-auto border border-ink/15 rounded-lg bg-receipt">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full min-w-[640px]"
          style={{ height: "auto", maxHeight: "70vh" }}
          role="img"
          aria-label="Connection graph of receipts. Use the list below for a keyboard-accessible alternative."
        >
          <g>
            {edges.map((e, i) => {
              const s = positions.get(e.sourceId);
              const t = positions.get(e.targetId);
              if (!s || !t) return null;
              const isHovered = hoveredEdge === i;
              const involvesFocus = focusReceiptId && (e.sourceId === focusReceiptId || e.targetId === focusReceiptId);
              return (
                <line
                  key={i}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={isHovered || involvesFocus ? "#c1502e" : "rgba(11,10,8,0.15)"}
                  strokeWidth={isHovered || involvesFocus ? 2.5 : Math.max(0.5, e.score * 2)}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredEdge(i)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  onClick={() => onSelectConnection(e)}
                  tabIndex={-1}
                />
              );
            })}
            {nodes.map((node) => {
              const p = positions.get(node.id);
              if (!p) return null;
              const meta = categoryMeta(node.category);
              const isFocus = focusReceiptId === node.id;
              return (
                <g key={node.id} transform={`translate(${p.x},${p.y})`}>
                  <circle
                    r={isFocus ? 10 : 6}
                    fill={meta.color}
                    stroke={isFocus ? "#0b0a08" : "none"}
                    strokeWidth={2}
                    className="cursor-pointer"
                  >
                    <title>{`${node.title} (${meta.label})`}</title>
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <details className="bg-receipt border border-ink/15 rounded-lg p-3">
        <summary className="font-mono text-xs uppercase tracking-wide text-ink/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rust rounded">
          Accessible list view — top connections (keyboard navigable)
        </summary>
        <ul className="mt-3 space-y-1 max-h-72 overflow-y-auto">
          {edges
            .slice()
            .sort((a, b) => b.score - a.score)
            .slice(0, 40)
            .map((e, i) => {
              const s = receipts.find((r) => r.id === e.sourceId);
              const t = receipts.find((r) => r.id === e.targetId);
              if (!s || !t) return null;
              return (
                <li key={i}>
                  <button
                    onClick={() => onSelectConnection(e)}
                    className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-rust flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{s.title} ↔ {t.title}</span>
                    <span className="font-mono text-[11px] text-ink/50 shrink-0">score {e.score}</span>
                  </button>
                </li>
              );
            })}
        </ul>
      </details>
    </div>
  );
}
