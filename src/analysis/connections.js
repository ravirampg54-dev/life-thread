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

// keywordsOf() is called for every candidate pair a receipt is compared
// against, but its result only depends on the receipt itself — caching it
// turns an O(pairs) amount of regex/Set work into O(receipts).
const keywordCache = new WeakMap();

function keywordsOf(receipt) {
  const cached = keywordCache.get(receipt);
  if (cached) return cached;
  const text = `${receipt.title} ${receipt.subtitle || ""} ${receipt.description || ""}`.toLowerCase();
  const words = text.match(/[a-z0-9]+/g) || [];
  const keywords = new Set(words.filter((w) => w.length > 3 && !STOPWORDS.has(w)));
  keywordCache.set(receipt, keywords);
  return keywords;
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

export function computeTemporalScore(a, b) {
  const mins = minutesBetween(a, b);
  if (mins > TEMPORAL_WINDOW_MIN) return null;
  const score = WEIGHTS.temporal * (1 - mins / TEMPORAL_WINDOW_MIN);
  const roundedMins = Math.round(mins);
  const reason = roundedMins <= 1
    ? "Occurred within the same minute"
    : `Occurred within ${roundedMins} minutes of each other`;
  return { score: Number(score.toFixed(4)), reason, mins };
}

export function computeLocationScore(a, b) {
  if (a.location && b.location && a.location === b.location) {
    return { score: WEIGHTS.location, reason: `Both records share the same location (${a.location})` };
  }
  return null;
}

export function computeKeywordScore(a, b) {
  const kwOverlap = overlap(keywordsOf(a), keywordsOf(b));
  if (kwOverlap.count >= 2) {
    return {
      score: Number((WEIGHTS.keyword * Math.min(1, kwOverlap.count / 4)).toFixed(4)),
      reason: `These receipts share ${kwOverlap.count} common keywords (${kwOverlap.shared.slice(0, 3).join(", ")})`
    };
  }
  return null;
}

export function computeTagScore(a, b) {
  const tagOverlap = overlap(new Set(a.tags || []), new Set(b.tags || []));
  if (tagOverlap.count >= 1) {
    return {
      score: Number((WEIGHTS.tag * Math.min(1, tagOverlap.count / 3)).toFixed(4)),
      reason: tagOverlap.count === 1
        ? `Both are tagged "${tagOverlap.shared[0]}"`
        : `Share ${tagOverlap.count} tags (${tagOverlap.shared.join(", ")})`
    };
  }
  return null;
}

export function computeSameDayScore(a, b, temporalMins) {
  if (!isSameDay(a, b)) return null;
  if (temporalMins != null && temporalMins <= TEMPORAL_WINDOW_MIN) return null;
  return { score: WEIGHTS.sameDay, reason: "Happened on the same day" };
}

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

  const temp = computeTemporalScore(a, b);
  if (temp) {
    breakdown.temporal = temp.score;
    reasons.push(temp.reason);
  }

  const loc = computeLocationScore(a, b);
  if (loc) {
    breakdown.location = loc.score;
    reasons.push(loc.reason);
  }

  const kw = computeKeywordScore(a, b);
  if (kw) {
    breakdown.keyword = kw.score;
    reasons.push(kw.reason);
  }

  const tag = computeTagScore(a, b);
  if (tag) {
    breakdown.tag = tag.score;
    reasons.push(tag.reason);
  }

  const same = computeSameDayScore(a, b, temp?.mins);
  if (same) {
    breakdown.sameDay = same.score;
    reasons.push(same.reason);
  }

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
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
// A bucket only helps performance if it stays small — a key shared by a huge
// fraction of the archive (e.g. every receipt with no location) is as good as
// no signal at all, so it is dropped once it grows past this size instead of
// being unioned in full for every one of its members.
const MAX_BUCKET_SIZE = 200;

export function buildConnections(allReceipts) {
  const connections = [];
  const buckets = new Map();
  const addToBucket = (key, index) => {
    if (!key) return;
    if (!buckets.has(key)) buckets.set(key, []);
    const bucket = buckets.get(key);
    if (bucket.length <= MAX_BUCKET_SIZE) bucket.push(index);
  };

  allReceipts.forEach((receipt, index) => {
    addToBucket(`date:${receipt.date}`, index);
    // A missing location is not a meaningful match signal, so only real
    // locations get bucketed — otherwise every location-less receipt (most
    // purchases and every music play) would collapse into one giant bucket.
    if (receipt.location) addToBucket(`location:${receipt.location}`, index);
    (receipt.tags || []).forEach((tag) => addToBucket(`tag:${tag}`, index));
  });

  const smallBucket = (key) => {
    const bucket = buckets.get(key);
    return bucket && bucket.length <= MAX_BUCKET_SIZE ? bucket : [];
  };

  for (let i = 0; i < allReceipts.length; i++) {
    const receipt = allReceipts[i];
    const candidateIndexes = new Set([
      ...smallBucket(`date:${receipt.date}`),
      ...(receipt.location ? smallBucket(`location:${receipt.location}`) : []),
      ...(receipt.tags || []).flatMap((tag) => smallBucket(`tag:${tag}`)),
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
