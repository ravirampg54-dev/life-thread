import { useEffect, useMemo, useState } from "react";
import { fallbackReceipts } from "../data/fallbackData";
import { loadArchiveReceipts } from "../data/archiveData";
import { buildConnections, indexConnectionsByReceipt } from "../analysis/connections";
import { detectChapters } from "../analysis/chapters";
import { detectThreads } from "../analysis/threads";
import { detectDiscoveries } from "../analysis/patterns";
import { buildStory } from "../analysis/story";
import { daySpan } from "../utils/dateUtils";

// A dedicated, isolated hook that performs the ENTIRE client-side analysis
// pipeline exactly once (memoized) for the given dataset. This is the single
// source of truth consumed by every page, so no page re-runs O(n^2)
// connection scoring on its own.
export function useLifeData() {
  const [archiveReceipts, setArchiveReceipts] = useState(null);

  useEffect(() => {
    let active = true;
    loadArchiveReceipts()
      .then((loaded) => {
        if (active && loaded.length) setArchiveReceipts(loaded);
      })
      .catch(() => {
        // The bundled demo records keep the app usable when archive files are unavailable.
      });
    return () => {
      active = false;
    };
  }, []);

  const receipts = archiveReceipts || fallbackReceipts;

  const receiptsById = useMemo(() => new Map(receipts.map((r) => [r.id, r])), [receipts]);

  const connections = useMemo(() => buildConnections(receipts), [receipts]);
  const connectionsByReceipt = useMemo(() => indexConnectionsByReceipt(connections), [connections]);

  const chapters = useMemo(() => detectChapters(receipts), [receipts]);
  const threads = useMemo(() => detectThreads(receipts), [receipts]);
  const discoveries = useMemo(() => detectDiscoveries(receipts, connections), [receipts, connections]);
  const story = useMemo(() => buildStory(chapters, threads, discoveries), [chapters, threads, discoveries]);
  const span = useMemo(() => daySpan(receipts), [receipts]);

  const categories = useMemo(() => [...new Set(receipts.map((r) => r.category))], [receipts]);
  const locations = useMemo(() => [...new Set(receipts.map((r) => r.location).filter(Boolean))], [receipts]);

  return {
    receipts,
    receiptsById,
    connections,
    connectionsByReceipt,
    chapters,
    threads,
    discoveries,
    story,
    span,
    categories,
    locations,
    usingArchive: Boolean(archiveReceipts),
  };
}
