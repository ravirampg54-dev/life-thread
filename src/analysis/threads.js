/**
 * Thread detection for recurring behavior patterns in the dataset.
 *
 * Each rule searches for repeated category sequences that recur across multiple
 * occasions, and it only reports a thread when there is evidence from several
 * separate receipt clusters.
 */

import { toTimestamp } from "../utils/dateUtils";

const THREAD_DEFINITIONS = [
  {
    id: "cafe-thread",
    title: "THE CAFÉ THREAD",
    sequence: ["music", "place", "purchase"],
    filter: (r) => r.location === "Moonlight Café",
  },
  {
    id: "study-thread",
    title: "THE STUDY THREAD",
    sequence: ["search", "music", "note"],
    filter: (r) => (r.tags || []).includes("study"),
  },
  {
    id: "gym-thread",
    title: "THE ROUTINE THREAD",
    sequence: ["event", "music", "purchase"],
    filter: (r) => (r.tags || []).includes("fitness"),
  },
  {
    id: "creative-thread",
    title: "THE CREATIVE THREAD",
    sequence: ["music", "photo", "note"],
    filter: (r) => (r.tags || []).includes("creative"),
  },
  {
    id: "travel-thread",
    title: "THE TRAVEL THREAD",
    sequence: ["search", "message", "event", "photo"],
    filter: (r) => (r.tags || []).includes("travel"),
  },
];

/**
 * Detects repeated behavior threads across the receipt set.
 *
 * @param {Receipt[]} receipts
 * @returns {Thread[]}
 */
export function detectThreads(receipts) {
  const threads = [];
  for (const def of THREAD_DEFINITIONS) {
    const relevant = receipts.filter(def.filter).sort((a, b) => toTimestamp(a) - toTimestamp(b));
    if (relevant.length < 4) continue;

    // Group into occurrences by date to show the chain repeats across
    // distinct days, which is the evidence that it's a real recurring thread.
    const byDate = new Map();
    relevant.forEach((r) => {
      if (!byDate.has(r.date)) byDate.set(r.date, []);
      byDate.get(r.date).push(r);
    });
    const occurrences = [...byDate.entries()]
      .map(([date, list]) => ({
        date,
        chain: def.sequence.map((cat) => list.find((r) => r.category === cat)).filter(Boolean),
      }))
      .filter((occ) => occ.chain.length >= 2);

    if (occurrences.length < 2) continue;

    threads.push({
      id: def.id,
      title: def.title,
      categorySequence: def.sequence,
      occurrenceCount: occurrences.length,
      occurrences,
      allReceiptIds: relevant.map((r) => r.id),
      evidence: `This chain of ${def.sequence.join(" → ")} repeats across ${occurrences.length} separate days.`,
    });
  }
  return threads;
}
