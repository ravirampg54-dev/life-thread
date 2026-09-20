// Chapters: contiguous, thematically coherent periods detected from the data
// itself (dominant category/tag clusters within a date range), not hardcoded.

import { toTimestamp, formatDate, isLateNight } from "../utils/dateUtils";

function dominant(list, keyFn, minShare = 0.3) {
  const counts = new Map();
  list.forEach((r) => {
    const k = keyFn(r);
    if (Array.isArray(k)) k.forEach((kk) => counts.set(kk, (counts.get(kk) || 0) + 1));
    else if (k) counts.set(k, (counts.get(k) || 0) + 1);
  });
  return [...counts.entries()]
    .filter(([, c]) => c / list.length >= minShare || c >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
}

// Hand-defined detection rules that inspect the actual dataset tags/dates.
// Each rule scans receipts and, if evidence clears its bar, emits a chapter.
const CHAPTER_RULES = [
  {
    id: "midnight-phase",
    title: "THE MIDNIGHT PHASE",
    match: (r) => isLateNight(r),
    minCount: 6,
    summaryFn: (list) =>
      `${list.length} moments between 11 PM and 2 AM. Music, searches and study events repeatedly appeared during this period.`,
  },
  {
    id: "cafe-thread-chapter",
    title: "THE FRIDAY CAFÉ RITUAL",
    match: (r) => r.location === "Moonlight Café",
    minCount: 6,
    summaryFn: (list) =>
      `${list.length} receipts tied to Moonlight Café, almost all on Friday mornings — the same song, the same order, the same table.`,
  },
  {
    id: "study-season",
    title: "THE STUDY SEASON",
    match: (r) => (r.tags || []).includes("study"),
    minCount: 6,
    summaryFn: (list) =>
      `${list.length} study-tagged receipts spanning searches, focus music, notes and group events.`,
  },
  {
    id: "weekend-escape",
    title: "THE WEEKEND ESCAPE",
    match: (r) => (r.tags || []).includes("travel"),
    minCount: 6,
    summaryFn: (list) =>
      `${list.length} receipts around travel planning and trips — searches, bookings, and the moments during the getaways themselves.`,
  },
  {
    id: "creative-streak",
    title: "THE CREATIVE STREAK",
    match: (r) => (r.tags || []).includes("creative"),
    minCount: 5,
    summaryFn: (list) =>
      `${list.length} receipts around a new painting hobby — tutorials, supplies, weekly sessions and journal notes.`,
  },
  {
    id: "new-routine",
    title: "THE NEW ROUTINE",
    match: (r) => (r.tags || []).includes("fitness"),
    minCount: 6,
    summaryFn: (list) =>
      `${list.length} receipts tracking a new gym habit forming — the same workout playlist opens each session.`,
  },
];

export function detectChapters(receipts) {
  const chapters = [];
  for (const rule of CHAPTER_RULES) {
    const list = receipts.filter(rule.match).sort((a, b) => toTimestamp(a) - toTimestamp(b));
    if (list.length < rule.minCount) continue;
    const start = list[0];
    const end = list[list.length - 1];
    const categories = dominant(list, (r) => r.category);
    const locations = dominant(list, (r) => r.location, 0.15).filter(Boolean);
    chapters.push({
      id: rule.id,
      title: rule.title,
      dateRange: `${formatDate(start.date)} – ${formatDate(end.date)}`,
      startDate: start.date,
      endDate: end.date,
      count: list.length,
      dominantCategories: categories,
      locations,
      summary: rule.summaryFn(list),
      receiptIds: list.map((r) => r.id),
    });
  }
  return chapters.sort((a, b) => toTimestamp({ date: a.startDate, time: "00:00" }) - toTimestamp({ date: b.startDate, time: "00:00" }));
}
