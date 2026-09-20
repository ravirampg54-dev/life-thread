// One-time data-prep script (Node, build-time only — never runs in the browser).
// Reads the raw Spotify streaming-history export and produces two small,
// frontend-friendly artifacts:
//   1. public/data/spotify-moments.json  — a browsable subset of REAL rows
//      (ms_played >= 30s, i.e. genuine listens rather than instant skips)
//   2. public/data/spotify-insights.json — deterministic aggregates computed
//      from the FULL, unfiltered dataset (149,860 rows), so every stat shown
//      in the UI reflects the entire archive even though only a curated
//      subset is rendered as individual browsable "moments".
//
// No values are invented. Every number here is derived directly from the
// supplied CSV.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "..", "archive", "spotify_history.csv");
const OUT_DIR = path.join(__dirname, "..", "public", "data");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const n = text[i + 1];
    if (c === '"' && quoted && n === '"') {
      field += '"';
      i += 1;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && n === "\n") i += 1;
      row.push(field);
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((v) => v.trim())) rows.push(row);
  const headers = rows.shift().map((h) => h.replace(/^\uFEFF/, "").trim());
  return rows.map((values) => Object.fromEntries(headers.map((h, idx) => [h, (values[idx] || "").trim()])));
}

function isLateNightHour(hour) {
  return hour >= 23 || hour < 2;
}

function main() {
  const raw = fs.readFileSync(SRC, "utf8");
  const rows = parseCsv(raw);

  const hourly = Array.from({ length: 24 }, () => 0);
  const weekday = Array.from({ length: 7 }, () => 0);
  const artistCount = new Map();
  const trackCount = new Map();
  const platformCount = new Map();
  const monthly = new Map();
  let lateNight = 0;
  let skipped = 0;
  let shuffled = 0;
  let totalMsPlayed = 0;
  let earliest = null;
  let latest = null;

  const qualifying = [];

  rows.forEach((row, index) => {
    const ts = row.ts;
    if (!ts) return;
    const d = new Date(ts.replace(" ", "T") + "Z");
    if (Number.isNaN(d.getTime())) return;

    const hour = d.getUTCHours();
    const day = d.getUTCDay();
    const monthKey = ts.slice(0, 7);
    const ms = Number(row.ms_played) || 0;
    const isSkipped = String(row.skipped).toUpperCase() === "TRUE";
    const isShuffled = String(row.shuffle).toUpperCase() === "TRUE";

    hourly[hour] += 1;
    weekday[day] += 1;
    monthly.set(monthKey, (monthly.get(monthKey) || 0) + 1);
    platformCount.set(row.platform || "unknown", (platformCount.get(row.platform || "unknown") || 0) + 1);
    if (isLateNightHour(hour)) lateNight += 1;
    if (isSkipped) skipped += 1;
    if (isShuffled) shuffled += 1;
    totalMsPlayed += ms;

    const artist = row.artist_name || "Unknown Artist";
    artistCount.set(artist, (artistCount.get(artist) || 0) + 1);
    const trackKey = `${row.track_name || "Unknown Track"} — ${artist}`;
    trackCount.set(trackKey, (trackCount.get(trackKey) || 0) + 1);

    if (!earliest || ts < earliest) earliest = ts;
    if (!latest || ts > latest) latest = ts;

    // Only genuine listens (>=30s) become individually browsable receipts.
    // This keeps the dataset frontend-friendly without ever inventing rows —
    // every kept row is a verbatim record from the source CSV.
    if (ms >= 30000) {
      qualifying.push({
        id: `spotify-${index + 1}`,
        ts,
        track: row.track_name || "Unknown Track",
        artist,
        album: row.album_name || "",
        ms,
        platform: row.platform || "unknown",
        reasonStart: row.reason_start || "",
        reasonEnd: row.reason_end || "",
        shuffle: isShuffled,
        skipped: isSkipped,
      });
    }
  });

  // Bound the browsable set for frontend performance. This is a deterministic,
  // evenly spaced sample of REAL rows (never invented) — every Nth genuine
  // listen (>=30s) across the full timeline, so the sample still spans the
  // entire archive rather than clustering at the start or end.
  const TARGET_BROWSABLE = 8000;
  const stride = Math.max(1, Math.floor(qualifying.length / TARGET_BROWSABLE));
  const moments = qualifying.filter((_, i) => i % stride === 0);

  const topArtists = [...artistCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([name, count]) => ({ name, count }));
  const topTracks = [...trackCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([name, count]) => ({ name, count }));
  const monthlyActivity = [...monthly.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count }));
  const platforms = [...platformCount.entries()].sort((a, b) => b[1] - a[1]).map(([platform, count]) => ({ platform, count }));

  const insights = {
    totalPlays: rows.length,
    genuineListens: qualifying.length,
    browsableMoments: moments.length,
    dateRange: { start: earliest, end: latest },
    hourly,
    weekday,
    monthlyActivity,
    topArtists,
    topTracks,
    platforms,
    lateNightPlays: lateNight,
    lateNightShare: rows.length ? lateNight / rows.length : 0,
    skippedPlays: skipped,
    skipRate: rows.length ? skipped / rows.length : 0,
    shuffledPlays: shuffled,
    shuffleRate: rows.length ? shuffled / rows.length : 0,
    totalMsPlayed,
    totalHoursPlayed: totalMsPlayed / 3.6e6,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "spotify-moments.json"), JSON.stringify(moments));
  fs.writeFileSync(path.join(OUT_DIR, "spotify-insights.json"), JSON.stringify(insights));

  console.log(`Parsed ${rows.length} raw plays.`);
  console.log(`Kept ${moments.length} browsable moments (ms_played >= 30s).`);
  console.log(`Wrote spotify-moments.json and spotify-insights.json to ${OUT_DIR}`);
}

main();
