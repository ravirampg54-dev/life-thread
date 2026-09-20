// Story Mode: turns detected chapters + threads + discoveries into an
// ordered set of scenes. Every scene line is generated from real evidence
// already computed elsewhere — nothing here is randomly generated text.

export function buildStory(chapters, threads, discoveries) {
  const scenes = [];

  scenes.push({
    id: "scene-open",
    heading: "SCENE 01",
    line: "It started quietly.",
    detail: "A collection of ordinary receipts — songs, searches, small purchases — with no obvious shape yet.",
    evidence: [],
  });

  const midnight = chapters.find((c) => c.id === "midnight-phase");
  if (midnight) {
    scenes.push({
      id: "scene-midnight",
      heading: `SCENE ${String(scenes.length + 1).padStart(2, "0")}`,
      line: "Late-night activity began appearing.",
      detail: midnight.summary,
      evidence: midnight.receiptIds,
    });
  }

  const cafeThread = threads.find((t) => t.id === "cafe-thread");
  if (cafeThread) {
    scenes.push({
      id: "scene-cafe",
      heading: `SCENE ${String(scenes.length + 1).padStart(2, "0")}`,
      line: "The same café kept returning.",
      detail: cafeThread.evidence,
      evidence: cafeThread.allReceiptIds,
    });
  }

  const studyThread = threads.find((t) => t.id === "study-thread");
  if (studyThread) {
    scenes.push({
      id: "scene-study",
      heading: `SCENE ${String(scenes.length + 1).padStart(2, "0")}`,
      line: "Music and study sessions repeatedly overlapped.",
      detail: studyThread.evidence,
      evidence: studyThread.allReceiptIds,
    });
  }

  const travel = chapters.find((c) => c.id === "weekend-escape");
  if (travel) {
    scenes.push({
      id: "scene-travel",
      heading: `SCENE ${String(scenes.length + 1).padStart(2, "0")}`,
      line: "A weekend escape emerged, planned days in advance.",
      detail: travel.summary,
      evidence: travel.receiptIds,
    });
  }

  const routine = chapters.find((c) => c.id === "new-routine");
  if (routine) {
    scenes.push({
      id: "scene-routine",
      heading: `SCENE ${String(scenes.length + 1).padStart(2, "0")}`,
      line: "A new pattern emerged.",
      detail: routine.summary,
      evidence: routine.receiptIds,
    });
  }

  if (discoveries.length) {
    const best = discoveries[0];
    scenes.push({
      id: "scene-discovery",
      heading: `SCENE ${String(scenes.length + 1).padStart(2, "0")}`,
      line: best.title,
      detail: best.detail,
      evidence: (best.evidence || []).map((r) => r.id),
    });
  }

  scenes.push({
    id: "scene-close",
    heading: `SCENE ${String(scenes.length + 1).padStart(2, "0")}`,
    line: "Hundreds of moments. One life. All connected.",
    detail: "Every thread above was found in the data — not assumed.",
    evidence: [],
  });

  return scenes;
}
