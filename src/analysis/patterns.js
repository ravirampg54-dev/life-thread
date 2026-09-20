/**
 * Discovery and distribution analysis for the LIFE//THREADS archive.
 *
 * Every discovery is backed by actual receipts and is framed as evidence-based
 * data points rather than personality inference.
 */

import { getWeekday, WEEKDAY_NAMES, isLateNight, getHour, toTimestamp } from "../utils/dateUtils";
import { MAX_EVIDENCE } from "./config";

function takeEvidence(list) {
  return list.slice(0, MAX_EVIDENCE);
}

export function groupReceiptsByLocation(receipts) {
  const byLocation = new Map();
  receipts.forEach((r) => {
    if (!r.location) return;
    if (!byLocation.has(r.location)) byLocation.set(r.location, []);
    byLocation.get(r.location).push(r);
  });
  return byLocation;
}

/**
 * Finds evidence-backed discoveries such as dominant weekdays, repeated
 * locations, late-night clusters and recurring activity sequences.
 *
 * @param {Receipt[]} receipts
 * @param {Connection[]} connections
 * @returns {Discovery[]}
 */
export function detectTopWeekday(receipts) {
  const byWeekday = Array.from({ length: 7 }, () => []);
  receipts.forEach((r) => byWeekday[getWeekday(r)].push(r));
  const maxDay = byWeekday.reduce((best, arr, idx) => (arr.length > (byWeekday[best]?.length || 0) ? idx : best), 0);
  if (byWeekday[maxDay].length >= 5) {
    return {
      id: "top-weekday",
      title: `${WEEKDAY_NAMES[maxDay]} was the most active day`,
      detail: `${byWeekday[maxDay].length} of ${receipts.length} moments happened on a ${WEEKDAY_NAMES[maxDay]}.`,
      evidence: takeEvidence(byWeekday[maxDay]),
    };
  }
  return null;
}

export function detectRepeatedLocations(receipts) {
  const discoveries = [];
  const byLocation = groupReceiptsByLocation(receipts);
  const topLocations = [...byLocation.entries()].filter(([, list]) => list.length >= 4).sort((a, b) => b[1].length - a[1].length);
  topLocations.slice(0, 3).forEach(([loc, list]) => {
    discoveries.push({
      id: `location-${loc}`,
      title: `You returned to ${loc} ${list.length} times`,
      detail: `${list.length} receipts are tied to ${loc} across the dataset.`,
      evidence: takeEvidence(list),
    });
  });
  return discoveries;
}

export function detectLateNightCluster(receipts) {
  const lateNight = receipts.filter(isLateNight);
  if (lateNight.length >= 4) {
    return {
      id: "late-night",
      title: `${lateNight.length} activities occurred between 11 PM and 2 AM`,
      detail: "Music, searches, notes and events repeatedly appear in this window.",
      evidence: takeEvidence(lateNight),
    };
  }
  return null;
}

export function detectMusicBeforeStudy(receipts) {
  const studySearches = receipts.filter((r) => (r.tags || []).includes("study"));
  const musicNearStudy = [];
  studySearches.forEach((s) => {
    const near = receipts.find(
      (r) => r.category === "music" && r.date === s.date && Math.abs(toTimestamp(r) - toTimestamp(s)) <= 60 * 60000 && toTimestamp(r) <= toTimestamp(s)
    );
    if (near) musicNearStudy.push([near, s]);
  });
  if (musicNearStudy.length >= 3) {
    return {
      id: "music-before-study",
      title: `Music appeared before study-related events ${musicNearStudy.length} times`,
      detail: "A music receipt precedes a study-tagged note, search or event on the same day, within an hour.",
      evidence: takeEvidence(musicNearStudy.flat()),
    };
  }
  return null;
}

export function detectLatePurchases(receipts) {
  const latePurchases = receipts.filter((r) => r.category === "purchase" && isLateNight(r));
  if (latePurchases.length >= 2) {
    return {
      id: "late-purchases",
      title: `${latePurchases.length} purchases happened during late-night sessions`,
      detail: "These purchases occurred between 11 PM and 2 AM, alongside other late-night activity.",
      evidence: takeEvidence(latePurchases),
    };
  }
  return null;
}

export function detectTravelSearches(receipts) {
  const discoveries = [];
  const travelEvents = receipts.filter((r) => r.category === "event" && (r.tags || []).includes("travel"));
  travelEvents.forEach((ev) => {
    const evTime = toTimestamp(ev);
    const priorSearches = receipts.filter(
      (r) => r.category === "search" && (r.tags || []).includes("travel") && toTimestamp(r) < evTime && (evTime - toTimestamp(r)) / 86400000 <= 14
    );
    if (priorSearches.length >= 2) {
      discoveries.push({
        id: `travel-searches-${ev.id}`,
        title: `Travel searches increased before "${ev.title}"`,
        detail: `${priorSearches.length} travel-related searches occurred in the two weeks before this event.`,
        evidence: takeEvidence([...priorSearches, ev]),
      });
    }
  });
  return discoveries;
}

export function detectRepeatedSongs(receipts) {
  const discoveries = [];
  const bySongLocation = new Map();
  receipts
    .filter((r) => r.category === "music")
    .forEach((r) => {
      const key = `${r.title}|${r.location || ""}`;
      if (!bySongLocation.has(key)) bySongLocation.set(key, []);
      bySongLocation.get(key).push(r);
    });
  [...bySongLocation.entries()]
    .filter(([, list]) => list.length >= 3)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 12)
    .forEach(([key, list]) => {
      const [song, loc] = key.split("|");
      discoveries.push({
        id: `repeat-song-${key}`,
        title: `"${song}" played ${list.length} times${loc ? ` at ${loc}` : ""}`,
        detail: `The same track recurs across ${list.length} separate sessions${loc ? ` at ${loc}` : ""}.`,
        evidence: takeEvidence(list),
      });
    });
  return discoveries;
}

export function detectHubs(receipts, connections) {
  const degree = new Map();
  connections.forEach((c) => {
    degree.set(c.sourceId, (degree.get(c.sourceId) || 0) + 1);
    degree.set(c.targetId, (degree.get(c.targetId) || 0) + 1);
  });
  const topHub = [...degree.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topHub && topHub[1] >= 5) {
    const hubReceipt = receipts.find((r) => r.id === topHub[0]);
    if (hubReceipt) {
      return {
        id: "top-hub",
        title: `"${hubReceipt.title}" connects to ${topHub[1]} other moments`,
        detail: "This receipt has the highest number of data-backed connections in the graph.",
        evidence: [hubReceipt],
      };
    }
  }
  return null;
}

export function detectDiscoveries(receipts, connections) {
  return [
    detectTopWeekday(receipts),
    ...detectRepeatedLocations(receipts),
    detectLateNightCluster(receipts),
    detectMusicBeforeStudy(receipts),
    detectLatePurchases(receipts),
    ...detectTravelSearches(receipts),
    ...detectRepeatedSongs(receipts),
    detectHubs(receipts, connections),
  ].filter(Boolean);
}

// Weekday activity distribution — used by chart components.
/**
 * Produces a weekday distribution for charting and overview screens.
 *
 * @param {Receipt[]} receipts
 * @returns {{ day: string, count: number }[]}
 */
export function weekdayDistribution(receipts) {
  const counts = Array.from({ length: 7 }, () => 0);
  receipts.forEach((r) => counts[getWeekday(r)]++);
  return WEEKDAY_NAMES.map((name, idx) => ({ day: name.slice(0, 3), count: counts[idx] }));
}

// Hour-of-day activity distribution.
/**
 * Produces an hourly activity distribution for time-based analysis views.
 *
 * @param {Receipt[]} receipts
 * @returns {{ hour: number, count: number }[]}
 */
export function hourDistribution(receipts) {
  const counts = Array.from({ length: 24 }, () => 0);
  receipts.forEach((r) => counts[getHour(r)]++);
  return counts.map((count, hour) => ({ hour, count }));
}

// Category counts.
/**
 * Produces category totals for summary and chart views.
 *
 * @param {Receipt[]} receipts
 * @returns {{ category: string, count: number }[]}
 */
export function categoryDistribution(receipts) {
  const counts = new Map();
  receipts.forEach((r) => counts.set(r.category, (counts.get(r.category) || 0) + 1));
  return [...counts.entries()].map(([category, count]) => ({ category, count }));
}
