const DATA_FILES = [
  ["household", "/data/Daily Household Transactions.csv", "csv"],
  // One India dump only — csv/tsv/xml are the same transactions in other
  // encodings and would otherwise be fetched four times for the same ids.
  ["india", "/data/Augmented_IndiaTransactMultiFacet2024.json", "json"],
  // Real Spotify streaming history (see scripts/prepareSpotify.mjs). This is a
  // deterministic, evenly-spaced sample of genuine listens (>=30s played)
  // drawn from the full 149,860-row export — never invented data.
  ["spotify", "/data/spotify-moments.json", "json"],
];

function parseDelimited(text, delimiter = ",") {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);

  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, "").trim());
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}

function parseXml(text) {
  const document = new DOMParser().parseFromString(text, "application/xml");
  return [...document.querySelectorAll("Transaction")].map((node) =>
    Object.fromEntries([...node.children].map((child) => [child.tagName, child.textContent.trim()]))
  );
}

function clean(value) {
  return value == null || value === "" ? null : String(value).trim();
}

function householdReceipt(row, index) {
  const [day, month, yearAndTime] = (row.Date || "").split("/");
  const [year, time = "00:00"] = (yearAndTime || "").split(" ");
  const amount = clean(row.Amount);
  const category = clean(row.Category) || "Other";
  const subcategory = clean(row.Subcategory);
  return {
    id: `household-${index + 1}`,
    category: "purchase",
    tags: [category, subcategory, row["Income/Expense"]].filter(Boolean).map((tag) => tag.toLowerCase()),
    location: null,
    title: subcategory || category,
    subtitle: amount ? `${row.Currency || "INR"} ${amount}` : row.Mode || "Household transaction",
    date: `${year || "1970"}-${(month || "01").padStart(2, "0")}-${(day || "01").padStart(2, "0")}`,
    time: time.slice(0, 5),
    description: `${row["Income/Expense"] || "Transaction"} via ${row.Mode || "unknown account"}${row.Note ? `: ${row.Note}` : ""}`,
  };
}

function parseLat(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= -90 && n <= 90 ? n : null;
}

function parseLng(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= -180 && n <= 180 ? n : null;
}

function indiaReceipt(row, index) {
  const [month, day, yearAndTime] = (row.trans_date_trans_time || "").split("/");
  const [year, time = "00:00"] = (yearAndTime || "").split(" ");
  const category = clean(row.category) || "uncategorized";
  const merchant = clean(row.merchant) || "Card transaction";
  const city = clean(row.city);
  const state = clean(row.state);
  const isFraud = row.is_fraud === "1.0" || row.is_fraud === "1" || row.is_fraud === 1;
  const lat = parseLat(row.merch_lat) ?? parseLat(row.lat);
  const lng = parseLng(row.merch_long) ?? parseLng(row.long);
  return {
    id: `india-${index + 1}`,
    category: "purchase",
    tags: [category, row.gender, state, isFraud ? "fraud flagged" : "verified"].filter(Boolean).map((tag) => String(tag).toLowerCase()),
    location: [city, state].filter(Boolean).join(", ") || state || city,
    title: merchant,
    subtitle: `${category} · INR ${clean(row.amt) || "0"}`,
    date: `${year || "1970"}-${(month || "01").padStart(2, "0")}-${(day || "01").padStart(2, "0")}`,
    time: time.slice(0, 5),
    description: `${row.first || ""} ${row.last || ""}`.trim() + (isFraud ? " · Fraud flag present" : ""),
    lat,
    lng,
  };
}

function musicReceipt(row) {
  const artist = clean(row.artist) || "Unknown Artist";
  const seconds = Math.round((row.ms || 0) / 1000);
  const hour = Number((row.ts || "").slice(11, 13));
  const isLateNight = Number.isFinite(hour) && (hour >= 23 || hour < 2);
  return {
    id: row.id,
    category: "music",
    tags: [artist.toLowerCase(), isLateNight ? "late-night" : null, row.shuffle ? "shuffle" : null, row.skipped ? "skipped" : null].filter(Boolean),
    location: null,
    title: row.track || "Unknown Track",
    subtitle: artist,
    date: (row.ts || "1970-01-01").slice(0, 10),
    time: (row.ts || "00:00").slice(11, 16),
    description: `Played on ${row.platform || "Spotify"} · ${seconds}s listened${row.skipped ? " · skipped" : ""}${row.reasonStart ? ` · started via ${row.reasonStart}` : ""}`,
  };
}

const RECEIPT_BUILDERS = {
  household: householdReceipt,
  india: indiaReceipt,
  spotify: musicReceipt,
};

function parseFile(text, format) {
  if (format === "json") return JSON.parse(text);
  if (format === "xml") return parseXml(text);
  return parseDelimited(text, format === "tsv" ? "\t" : ",");
}

let archivePromise = null;

export async function loadArchiveReceipts() {
  if (!archivePromise) archivePromise = loadArchiveReceiptsOnce();
  return archivePromise;
}

async function loadArchiveReceiptsOnce() {
  const loaded = await Promise.all(
    DATA_FILES.map(async ([kind, path, format]) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Could not load ${path}`);
      try {
        const rows = parseFile(await response.text(), format);
        const build = RECEIPT_BUILDERS[kind];
        return rows.map((row, index) => build(row, index));
      } catch {
        return [];
      }
    })
  );

  const unique = new Map();
  loaded.flat().forEach((receipt) => unique.set(receipt.id, receipt));
  return [...unique.values()].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}
