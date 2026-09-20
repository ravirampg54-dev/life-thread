// The Connection Engine.
// Every connection between two receipts is derived from real fields on the
// records (time, location, tags, keywords) and always carries human-readable
// reasons. No relationship is fabricated or decorative.

import { minutesBetween, isSameDay } from "../utils/dateUtils";

const STOPWORDS = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "at", "this", "that"]);

function keywordsOf(receipt) {
  const text = `${receipt.title} ${receipt.subtitle || ""} ${receipt.description || ""}`.toLowerCase();
  const words = text.match(/[a-z0-9]+/g) || [];
  return new Set(words.filter((w) => w.length > 3 && !STOPWORDS.has(w)));
}

function overlap(setA, setB) {
  let count = 0;
  const shared = [];
  for (const item of setA) {
    if (setB.has(item)) {
      count++;
      shared.push(item);
    }
  }
  return { count, shared };
}

// Weights sum to 1.0 — deterministic, documented scoring formula.
const WEIGHTS = {
  temporal: 0.30,
  location: 0.25,
  keyword: 0.20,
  tag: 0.15,
  sameDay: 0.10,
};

const TEMPORAL_WINDOW_MIN = 90; // within 90 minutes counts as temporally close

/**
 * Compute a deterministic connection between two receipts.
 * Returns null if no meaningful relationship exists (score below threshold).
 */
export function computeConnection(a, b) {
  if (a.id === b.id) return null;
  const reasons = [];
  let score = 0;

  // 1. Temporal proximity
  const mins = minutesBetween(a, b);
  if (mins <= TEMPORAL_WINDOW_MIN) {
    const temporalScore = WEIGHTS.temporal * (1 - mins / TEMPORAL_WINDOW_MIN);
    score += temporalScore;
    const roundedMins = Math.round(mins);
    reasons.push(
      roundedMins <= 1
        ? "Occurred within the same minute"
        : `Occurred within ${roundedMins} minutes of each other`
    );
  }

  // 2. Same location
  if (a.location && b.location && a.location === b.location) {
    score += WEIGHTS.location;
    reasons.push(`Both records share the same location (${a.location})`);
  }

  // 3. Keyword overlap (title/subtitle/description)
  const kwA = keywordsOf(a);
  const kwB = keywordsOf(b);
  const kwOverlap = overlap(kwA, kwB);
  if (kwOverlap.count >= 2) {
    score += WEIGHTS.keyword * Math.min(1, kwOverlap.count / 4);
    reasons.push(`These receipts share ${kwOverlap.count} common keywords (${kwOverlap.shared.slice(0, 3).join(", ")})`);
  }

  // 4. Shared tags
  const tagOverlap = overlap(new Set(a.tags || []), new Set(b.tags || []));
  if (tagOverlap.count >= 1) {
    score += WEIGHTS.tag * Math.min(1, tagOverlap.count / 3);
    reasons.push(
      tagOverlap.count === 1
        ? `Both are tagged "${tagOverlap.shared[0]}"`
        : `Share ${tagOverlap.count} tags (${tagOverlap.shared.join(", ")})`
    );
  }

  // 5. Same calendar day
  if (isSameDay(a, b) && mins > TEMPORAL_WINDOW_MIN) {
    score += WEIGHTS.sameDay;
    reasons.push("Happened on the same day");
  }

  if (score <= 0 || reasons.length === 0) return null;

  return {
    sourceId: a.id,
    targetId: b.id,
    score: Math.round(Math.min(score, 1) * 100) / 100,
    reasons,
  };
}

const SCORE_THRESHOLD = 0.18;
const MAX_CANDIDATES_PER_RECEIPT = 40;

/**
 * Build the connection graph using cheap indexes to avoid comparing unrelated
 * records. The scoring function remains unchanged; only plausible pairs are
 * sent to it (same day, location, or tag).
 */
export function buildConnections(allReceipts) {
  const connections = [];
  const buckets = new Map();
  const addToBucket = (key, index) => {
    if (!key) return;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(index);
  };

  allReceipts.forEach((receipt, index) => {
    addToBucket(`date:${receipt.date}`, index);
    addToBucket(`location:${receipt.location}`, index);
    (receipt.tags || []).forEach((tag) => addToBucket(`tag:${tag}`, index));
  });

  for (let i = 0; i < allReceipts.length; i++) {
    const receipt = allReceipts[i];
    const candidateIndexes = new Set([
      ...(buckets.get(`date:${receipt.date}`) || []),
      ...(buckets.get(`location:${receipt.location}`) || []),
      ...(receipt.tags || []).flatMap((tag) => buckets.get(`tag:${tag}`) || []),
    ]);
    for (const j of [...candidateIndexes].slice(0, MAX_CANDIDATES_PER_RECEIPT)) {
      if (j <= i) continue;
      const conn = computeConnection(allReceipts[i], allReceipts[j]);
      if (conn && conn.score >= SCORE_THRESHOLD) {
        connections.push(conn);
      }
    }
  }
  return connections.sort((a, b) => b.score - a.score);
}

/** Index connections by receipt id for O(1) lookup of a receipt's connections. */
export function indexConnectionsByReceipt(connections) {
  const map = new Map();
  const add = (id, conn) => {
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(conn);
  };
  for (const c of connections) {
    add(c.sourceId, c);
    add(c.targetId, c);
  }
  return map;
}

export function getConnectedReceipts(receiptId, connections, receiptsById) {
  const results = [];
  for (const c of connections) {
    if (c.sourceId === receiptId) results.push({ receipt: receiptsById.get(c.targetId), conn: c });
    else if (c.targetId === receiptId) results.push({ receipt: receiptsById.get(c.sourceId), conn: c });
  }
  return results.sort((a, b) => b.conn.score - a.conn.score);
}
