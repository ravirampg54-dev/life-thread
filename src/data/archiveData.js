const DATA_FILES = [
  ["household", "/data/Daily Household Transactions.csv", "csv"],
  ["india", "/data/Augmented_IndiaTransactMultiFacet2024.csv", "csv"],
  ["india", "/data/Augmented_IndiaTransactMultiFacet2024.json", "json"],
  ["india", "/data/Augmented_IndiaTransactMultiFacet2024.tsv", "tsv"],
  ["india", "/data/Augmented_IndiaTransactMultiFacet2024.xml", "xml"],
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

function indiaReceipt(row, index) {
  const [month, day, yearAndTime] = (row.trans_date_trans_time || "").split("/");
  const [year, time = "00:00"] = (yearAndTime || "").split(" ");
  const category = clean(row.category) || "uncategorized";
  const merchant = clean(row.merchant) || "Card transaction";
  const city = clean(row.city);
  const state = clean(row.state);
  const isFraud = row.is_fraud === "1.0" || row.is_fraud === "1";
  return {
    id: `india-${index + 1}`,
    category: "purchase",
    tags: [category, row.gender, isFraud ? "fraud flagged" : "verified"].filter(Boolean).map((tag) => tag.toLowerCase()),
    location: city || state,
    title: merchant,
    subtitle: `${category} · INR ${clean(row.amt) || "0"}`,
    date: `${year || "1970"}-${(month || "01").padStart(2, "0")}-${(day || "01").padStart(2, "0")}`,
    time: time.slice(0, 5),
    description: `${row.first || ""} ${row.last || ""}`.trim() + (isFraud ? " · Fraud flag present" : ""),
  };
}

function parseFile(text, format) {
  if (format === "json") return JSON.parse(text);
  if (format === "xml") return parseXml(text);
  return parseDelimited(text, format === "tsv" ? "\t" : ",");
}

export async function loadArchiveReceipts() {
  const loaded = await Promise.all(
    DATA_FILES.map(async ([kind, path, format]) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Could not load ${path}`);
      try {
        const rows = parseFile(await response.text(), format);
        return rows.map((row, index) => (kind === "household" ? householdReceipt(row, index) : indiaReceipt(row, index)));
      } catch {
        return [];
      }
    })
  );

  const unique = new Map();
  loaded.flat().forEach((receipt) => unique.set(receipt.id, receipt));
  return [...unique.values()].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}
