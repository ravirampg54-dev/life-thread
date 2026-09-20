/**
 * Connection analysis for the LIFE//THREADS graph.
 *
 * The engine compares real receipt fields (time, location, keywords, tags and
 * weekday) and converts those matches into deterministic, evidential links.
 * Only relationships with a meaningful score are retained.
 */

import { minutesBetween, isSameDay } from "../utils/dateUtils";
import {
  CONNECTION_WEIGHTS,
  MAX_CANDIDATES_PER_RECEIPT,
  SCORE_THRESHOLD,
  TEMPORAL_WINDOW_MIN,
} from "./config";

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
const WEIGHTS = CONNECTION_WEIGHTS;

/**
 * Calculates the deterministic connection score between two receipts.
 *
 * Compares real receipt fields (time, location, keywords, tags and weekday)
 * against the configured weights in `src/analysis/config.js` and returns a
 * traceable edge object with per-factor breakdown and human-readable reasons.
 *
 * @param {Receipt} a
 * @param {Receipt} b
 * @returns {Connection | null} The edge, or null when there is no relationship.
 */
export function computeConnection(a, b) {
  if (a.id === b.id) return null;
  const reasons = [];
  const breakdown = {
    temporal: 0,
    location: 0,
    keyword: 0,
    tag: 0,
    sameDay: 0,
  };

  const mins = minutesBetween(a, b);
  if (mins <= TEMPORAL_WINDOW_MIN) {
    const temporalScore = WEIGHTS.temporal * (1 - mins / TEMPORAL_WINDOW_MIN);
    breakdown.temporal = Number(temporalScore.toFixed(4));
    const roundedMins = Math.round(mins);
    reasons.push(
      roundedMins <= 1
        ? "Occurred within the same minute"
        : `Occurred within ${roundedMins} minutes of each other`
    );
  }

  if (a.location && b.location && a.location === b.location) {
    breakdown.location = WEIGHTS.location;
    reasons.push(`Both records share the same location (${a.location})`);
  }

  const kwA = keywordsOf(a);
  const kwB = keywordsOf(b);
  const kwOverlap = overlap(kwA, kwB);
  if (kwOverlap.count >= 2) {
    breakdown.keyword = Number((WEIGHTS.keyword * Math.min(1, kwOverlap.count / 4)).toFixed(4));
    reasons.push(`These receipts share ${kwOverlap.count} common keywords (${kwOverlap.shared.slice(0, 3).join(", ")})`);
  }

  const tagOverlap = overlap(new Set(a.tags || []), new Set(b.tags || []));
  if (tagOverlap.count >= 1) {
    breakdown.tag = Number((WEIGHTS.tag * Math.min(1, tagOverlap.count / 3)).toFixed(4));
    reasons.push(
      tagOverlap.count === 1
        ? `Both are tagged "${tagOverlap.shared[0]}"`
        : `Share ${tagOverlap.count} tags (${tagOverlap.shared.join(", ")})`
    );
  }

  if (isSameDay(a, b) && mins > TEMPORAL_WINDOW_MIN) {
    breakdown.sameDay = WEIGHTS.sameDay;
    reasons.push("Happened on the same day");
  }

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  // A relationship is only an edge when it clears the configured threshold and
  // carries at least one human-readable reason (score > 0 implies reasons exist).
  if (score < SCORE_THRESHOLD || reasons.length === 0) return null;

  return {
    sourceId: a.id,
    targetId: b.id,
    score: Number(Math.min(score, 1).toFixed(2)),
    reasons,
    breakdown,
  };
}

/**
 * Build the connection graph using cheap indexes to avoid comparing unrelated
 * records. The scoring function remains unchanged; only plausible pairs are
 * sent to it (same day, location, or tag).
 */
/**
 * Builds the complete connection graph for the provided receipt dataset.
 *
 * @param {Receipt[]} allReceipts
 * @returns {Connection[]}
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
      if (conn) {
        connections.push(conn);
      }
    }
  }
  return connections.sort((a, b) => b.score - a.score);
}

/**
 * Indexes connections by receipt id for O(1) lookup.
 *
 * @param {Connection[]} connections
 * @returns {Map<string, Connection[]>}
 */
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

/**
 * Returns the connected receipts for a given receipt, ordered by strongest score.
 *
 * @param {string} receiptId
 * @param {Connection[]} connections
 * @param {Map<string, Receipt>} receiptsById
 * @returns {{ receipt: Receipt, conn: Connection }[]}
 */
export function getConnectedReceipts(receiptId, connections, receiptsById) {
  const results = [];
  for (const c of connections) {
    if (c.sourceId === receiptId) results.push({ receipt: receiptsById.get(c.targetId), conn: c });
    else if (c.targetId === receiptId) results.push({ receipt: receiptsById.get(c.sourceId), conn: c });
  }
  return results.sort((a, b) => b.conn.score - a.conn.score);
}
