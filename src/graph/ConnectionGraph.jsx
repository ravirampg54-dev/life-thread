// Accessible, bounded SVG graph for exploring evidence-backed receipt links.

import { memo, useMemo, useState } from "react";
import { computeLayout } from "./layout";
import { categoryMeta } from "../utils/constants";
import { MAX_GRAPH_EDGES, MAX_GRAPH_NODES } from "../analysis/config";

const WIDTH = 900;
const HEIGHT = 620;

function ConnectionGraph({ receipts, connections, onSelectConnection, onSelectNode, focusReceiptId }) {
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(-1);

  const { nodes, edges } = useMemo(() => {
    const degree = new Map();
    connections.forEach((c) => {
      degree.set(c.sourceId, (degree.get(c.sourceId) || 0) + 1);
      degree.set(c.targetId, (degree.get(c.targetId) || 0) + 1);
    });
    const connectedIds = [...degree.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_GRAPH_NODES)
      .map(([id]) => id);
    const nodeIdSet = new Set(connectedIds);
    const nodeList = receipts.filter((r) => nodeIdSet.has(r.id));
    const edgeList = connections
      .filter((c) => nodeIdSet.has(c.sourceId) && nodeIdSet.has(c.targetId))
      .slice(0, MAX_GRAPH_EDGES);
    return { nodes: nodeList, edges: edgeList };
  }, [receipts, connections]);

  const positions = useMemo(() => computeLayout(nodes, edges, WIDTH, HEIGHT), [nodes, edges]);
  const focusedNode = focusedNodeIndex >= 0 ? nodes[focusedNodeIndex] : null;

  const handleKeyDown = (e) => {
    if (nodes.length === 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedNodeIndex((prev) => (prev < 0 ? 0 : (prev + 1) % nodes.length));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedNodeIndex((prev) => (prev < 0 ? 0 : (prev - 1 + nodes.length) % nodes.length));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedNodeIndex >= 0 && onSelectNode) onSelectNode(nodes[focusedNodeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setFocusedNodeIndex(-1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[11px] text-ink/50">
        Showing the {nodes.length} most-connected moments and {edges.length} edges (capped for readability).
      </p>
      <div className="w-full overflow-x-auto border border-ink/15 rounded-lg bg-receipt">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full min-w-[640px] focus:outline-none focus-visible:ring-2 focus-visible:ring-rust"
          style={{ height: "auto", maxHeight: "70vh" }}
          role="application"
          aria-describedby="connection-graph-summary"
          aria-label="Connection graph of receipts. Use arrow keys to move between nodes, Enter or Space to open a node, Escape to clear focus."
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (focusedNodeIndex === -1 && nodes.length > 0) setFocusedNodeIndex(0);
          }}
        >
          <title>Receipt connection graph</title>
          <g>
            {edges.map((e, i) => {
              const s = positions.get(e.sourceId);
              const t = positions.get(e.targetId);
              if (!s || !t) return null;
              const isHovered = hoveredEdge === i;
              const involvesFocus = focusReceiptId && (e.sourceId === focusReceiptId || e.targetId === focusReceiptId);
              const involvesKeyboard = focusedNode && (e.sourceId === focusedNode.id || e.targetId === focusedNode.id);
              return (
                <line
                  key={`${e.sourceId}-${e.targetId}-${i}`}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={isHovered || involvesFocus || involvesKeyboard ? "#8b5cf6" : "rgba(203,213,225,0.45)"}
                  strokeWidth={isHovered || involvesFocus || involvesKeyboard ? 2.5 : Math.max(0.5, e.score * 2)}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredEdge(i)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  onClick={() => onSelectConnection(e)}
                />
              );
            })}
            {nodes.map((node, index) => {
              const p = positions.get(node.id);
              if (!p) return null;
              const meta = categoryMeta(node.category);
              const isFocus = focusReceiptId === node.id || focusedNodeIndex === index;
              return (
                <g key={node.id} transform={`translate(${p.x},${p.y})`}>
                  <circle
                    r={isFocus ? 10 : 6}
                    fill={meta.color}
                    stroke={isFocus ? "#c4b5fd" : "none"}
                    strokeWidth={2}
                    className="cursor-pointer"
                    onClick={() => {
                      setFocusedNodeIndex(index);
                      if (onSelectNode) onSelectNode(node);
                    }}
                  >
                    <title>{`${node.title} (${meta.label})`}</title>
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <p id="connection-graph-summary" className="sr-only">
        This graph shows {nodes.length} receipt nodes and {edges.length} evidence-backed connections.
        Each connection combines time, location, keyword, tag, and same-day signals.
      </p>
      <p className="font-mono text-xs text-ink/60" aria-live="polite">
        {focusedNode ? `Focused node: ${focusedNode.title}` : "Focus the graph, then use arrow keys to move between nodes."}
      </p>

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
                <li key={`${e.sourceId}-${e.targetId}-${i}`}>
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

export default memo(ConnectionGraph);
