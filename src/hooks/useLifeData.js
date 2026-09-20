// Single client-side analysis pipeline shared by every page.

import { useEffect, useMemo, useState } from "react";
import { fallbackReceipts } from "../data/fallbackData";
import { loadArchiveReceipts } from "../data/archiveData";
import { buildConnections, indexConnectionsByReceipt } from "../analysis/connections";
import { detectChapters } from "../analysis/chapters";
import { detectThreads } from "../analysis/threads";
import { detectDiscoveries } from "../analysis/patterns";
import { buildStory } from "../analysis/story";
import { daySpan } from "../utils/dateUtils";

/**
 * Loads local archive data and derives all evidence-backed view models.
 *
 * @returns {object} Receipts, indexes, graph edges, detected patterns and story scenes.
 */
// A dedicated, isolated hook that performs the ENTIRE client-side analysis
// pipeline exactly once (memoized) for the given dataset. This is the single
// source of truth consumed by every page, so no page re-runs O(n^2)
// connection scoring on its own.
export function useLifeData() {
  const [archiveReceipts, setArchiveReceipts] = useState(null);
  const [connections, setConnections] = useState(null);
  const [prevReceipts, setPrevReceipts] = useState(null);

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

  if (receipts !== prevReceipts) {
    setPrevReceipts(receipts);
    setConnections(null);
  }

  const receiptsById = useMemo(() => new Map(receipts.map((r) => [r.id, r])), [receipts]);

  // Connection scoring is O(receipts * candidates) and can take well over a
  // second once the full archive (tens of thousands of receipts, including
  // Spotify history) is loaded. Running it in a Worker keeps the main thread
  // free so the UI stays responsive instead of freezing while the graph is
  // built; `analysisReady` lets pages show a loading state in the meantime.
  useEffect(() => {
    let cancelled = false;
    const worker = new Worker(new URL("../workers/connectionsWorker.js", import.meta.url), { type: "module" });
    worker.onmessage = (event) => {
      if (!cancelled) setConnections(event.data);
    };
    worker.onerror = () => {
      // Fall back to computing synchronously (e.g. if module workers are
      // unsupported) rather than leaving the app stuck loading forever.
      if (!cancelled) setConnections(buildConnections(receipts));
    };
    worker.postMessage(receipts);
    return () => {
      cancelled = true;
      worker.terminate();
    };
  }, [receipts]);

  const resolvedConnections = useMemo(() => connections || [], [connections]);
  const analysisReady = connections !== null;
  const connectionsByReceipt = useMemo(() => indexConnectionsByReceipt(resolvedConnections), [resolvedConnections]);

  const chapters = useMemo(() => detectChapters(receipts), [receipts]);
  const threads = useMemo(() => detectThreads(receipts), [receipts]);
  const discoveries = useMemo(
    () => (analysisReady ? detectDiscoveries(receipts, resolvedConnections) : []),
    [receipts, resolvedConnections, analysisReady]
  );
  const story = useMemo(() => buildStory(chapters, threads, discoveries), [chapters, threads, discoveries]);
  const span = useMemo(() => daySpan(receipts), [receipts]);

  const categories = useMemo(() => [...new Set(receipts.map((r) => r.category))], [receipts]);
  const locations = useMemo(() => [...new Set(receipts.map((r) => r.location).filter(Boolean))], [receipts]);

  return {
    receipts,
    receiptsById,
    connections: resolvedConnections,
    connectionsByReceipt,
    chapters,
    threads,
    discoveries,
    story,
    span,
    categories,
    locations,
    usingArchive: Boolean(archiveReceipts),
    analysisReady,
  };
}
