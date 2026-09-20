// A tiny, dependency-free deterministic force layout so the connection graph
// doesn't need a heavy physics library. Runs a fixed number of iterations of
// simple spring/repulsion forces, seeded deterministically by node index so
// the layout is stable across renders.

export function computeLayout(nodes, edges, width = 800, height = 600, iterations = 220) {
  const positions = new Map();
  const n = nodes.length || 1;
  nodes.forEach((node, i) => {
    // Deterministic seed via golden-angle spiral (no Math.random needed).
    const angle = i * 2.399963;
    const radius = (Math.sqrt(i + 1) / Math.sqrt(n)) * (Math.min(width, height) / 2.4);
    positions.set(node.id, {
      x: width / 2 + radius * Math.cos(angle),
      y: height / 2 + radius * Math.sin(angle),
      vx: 0,
      vy: 0,
    });
  });

  const idToIdx = new Map(nodes.map((n, i) => [n.id, i]));
  const k = Math.sqrt((width * height) / n); // ideal spring length

  for (let iter = 0; iter < iterations; iter++) {
    const disp = nodes.map(() => ({ x: 0, y: 0 }));

    // Repulsion between all pairs (n is small: hundreds max)
    for (let i = 0; i < nodes.length; i++) {
      const pi = positions.get(nodes[i].id);
      for (let j = i + 1; j < nodes.length; j++) {
        const pj = positions.get(nodes[j].id);
        let dx = pi.x - pj.x;
        let dy = pi.y - pj.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const force = (k * k) / dist;
        dx = (dx / dist) * force;
        dy = (dy / dist) * force;
        disp[i].x += dx;
        disp[i].y += dy;
        disp[j].x -= dx;
        disp[j].y -= dy;
      }
    }

    // Attraction along edges
    edges.forEach((e) => {
      const si = idToIdx.get(e.sourceId);
      const ti = idToIdx.get(e.targetId);
      if (si === undefined || ti === undefined) return;
      const ps = positions.get(e.sourceId);
      const pt = positions.get(e.targetId);
      let dx = ps.x - pt.x;
      let dy = ps.y - pt.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const force = (dist * dist) / k;
      dx = (dx / dist) * force;
      dy = (dy / dist) * force;
      disp[si].x -= dx * 0.5;
      disp[si].y -= dy * 0.5;
      disp[ti].x += dx * 0.5;
      disp[ti].y += dy * 0.5;
    });

    // Apply displacement, clamp to canvas, cool down over time
    const temp = Math.max(1, 30 * (1 - iter / iterations));
    nodes.forEach((node, i) => {
      const p = positions.get(node.id);
      const d = disp[i];
      const dist = Math.sqrt(d.x * d.x + d.y * d.y) || 0.01;
      const clamped = Math.min(dist, temp);
      p.x += (d.x / dist) * clamped;
      p.y += (d.y / dist) * clamped;
      p.x = Math.max(30, Math.min(width - 30, p.x));
      p.y = Math.max(30, Math.min(height - 30, p.y));
    });
  }

  return positions;
}
