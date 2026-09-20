// Discoveries: automatic, evidence-based pattern detection.
// Rule: every discovery states an observable fact with supporting receipts.
// No claims about the person's personality or psychology are ever made.

import { getWeekday, WEEKDAY_NAMES, isLateNight, getHour, toTimestamp } from "../utils/dateUtils";

export function detectDiscoveries(receipts, connections) {
  const discoveries = [];

  // 1. Most active weekday
  const byWeekday = Array.from({ length: 7 }, () => []);
  receipts.forEach((r) => byWeekday[getWeekday(r)].push(r));
  const maxDay = byWeekday.reduce((best, arr, idx) => (arr.length > (byWeekday[best]?.length || 0) ? idx : best), 0);
  if (byWeekday[maxDay].length >= 5) {
    discoveries.push({
      id: "top-weekday",
      title: `${WEEKDAY_NAMES[maxDay]} was the most active day`,
      detail: `${byWeekday[maxDay].length} of ${receipts.length} moments happened on a ${WEEKDAY_NAMES[maxDay]}.`,
      evidence: byWeekday[maxDay].slice(0, 8),
    });
  }

  // 2. Repeated location visits
  const byLocation = new Map();
  receipts.forEach((r) => {
    if (!r.location) return;
    if (!byLocation.has(r.location)) byLocation.set(r.location, []);
    byLocation.get(r.location).push(r);
  });
  const topLocations = [...byLocation.entries()].filter(([, list]) => list.length >= 4).sort((a, b) => b[1].length - a[1].length);
  topLocations.slice(0, 3).forEach(([loc, list]) => {
    discoveries.push({
      id: `location-${loc}`,
      title: `You returned to ${loc} ${list.length} times`,
      detail: `${list.length} receipts are tied to ${loc} across the dataset.`,
      evidence: list,
    });
  });

  // 3. Late-night cluster
  const lateNight = receipts.filter(isLateNight);
  if (lateNight.length >= 4) {
    discoveries.push({
      id: "late-night",
      title: `${lateNight.length} activities occurred between 11 PM and 2 AM`,
      detail: "Music, searches, notes and events repeatedly appear in this window.",
      evidence: lateNight.slice(0, 8),
    });
  }

  // 4. Music before study events (ordering pattern via connections + category)
  const studySearches = receipts.filter((r) => (r.tags || []).includes("study"));
  const musicNearStudy = [];
  studySearches.forEach((s) => {
    const near = receipts.find(
      (r) => r.category === "music" && r.date === s.date && Math.abs(toTimestamp(r) - toTimestamp(s)) <= 60 * 60000 && toTimestamp(r) <= toTimestamp(s)
    );
    if (near) musicNearStudy.push([near, s]);
  });
  if (musicNearStudy.length >= 3) {
    discoveries.push({
      id: "music-before-study",
      title: `Music appeared before study-related events ${musicNearStudy.length} times`,
      detail: "A music receipt precedes a study-tagged note, search or event on the same day, within an hour.",
      evidence: musicNearStudy.flat().slice(0, 8),
    });
  }

  // 5. Purchases during late-night sessions
  const latePurchases = receipts.filter((r) => r.category === "purchase" && isLateNight(r));
  if (latePurchases.length >= 2) {
    discoveries.push({
      id: "late-purchases",
      title: `${latePurchases.length} purchases happened during late-night sessions`,
      detail: "These purchases occurred between 11 PM and 2 AM, alongside other late-night activity.",
      evidence: latePurchases,
    });
  }

  // 6. Travel searches increasing before travel events
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
        evidence: [...priorSearches, ev],
      });
    }
  });

  // 7. Repeated same-song listening (recurring behavior)
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
    .forEach(([key, list]) => {
      const [song, loc] = key.split("|");
      discoveries.push({
        id: `repeat-song-${key}`,
        title: `"${song}" played ${list.length} times${loc ? ` at ${loc}` : ""}`,
        detail: `The same track recurs across ${list.length} separate sessions${loc ? ` at ${loc}` : ""}.`,
        evidence: list,
      });
    });

  // 8. Highly connected receipts (hub detection)
  const degree = new Map();
  connections.forEach((c) => {
    degree.set(c.sourceId, (degree.get(c.sourceId) || 0) + 1);
    degree.set(c.targetId, (degree.get(c.targetId) || 0) + 1);
  });
  const topHub = [...degree.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topHub && topHub[1] >= 5) {
    const hubReceipt = receipts.find((r) => r.id === topHub[0]);
    if (hubReceipt) {
      discoveries.push({
        id: "top-hub",
        title: `"${hubReceipt.title}" connects to ${topHub[1]} other moments`,
        detail: "This receipt has the highest number of data-backed connections in the graph.",
        evidence: [hubReceipt],
      });
    }
  }

  return discoveries;
}

// Weekday activity distribution — used by chart components.
export function weekdayDistribution(receipts) {
  const counts = Array.from({ length: 7 }, () => 0);
  receipts.forEach((r) => counts[getWeekday(r)]++);
  return WEEKDAY_NAMES.map((name, idx) => ({ day: name.slice(0, 3), count: counts[idx] }));
}

// Hour-of-day activity distribution.
export function hourDistribution(receipts) {
  const counts = Array.from({ length: 24 }, () => 0);
  receipts.forEach((r) => counts[getHour(r)]++);
  return counts.map((count, hour) => ({ hour, count }));
}

// Category counts.
export function categoryDistribution(receipts) {
  const counts = new Map();
  receipts.forEach((r) => counts.set(r.category, (counts.get(r.category) || 0) + 1));
  return [...counts.entries()].map(([category, count]) => ({ category, count }));
}
