// All date handling is local, deterministic and dependency-free.

export function toTimestamp(receipt) {
  // receipt.date = "YYYY-MM-DD", receipt.time = "HH:MM"
  const [y, m, d] = receipt.date.split("-").map(Number);
  const [hh, mm] = (receipt.time || "00:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm).getTime();
}

export function minutesBetween(a, b) {
  return Math.abs(toTimestamp(a) - toTimestamp(b)) / 60000;
}

export function isSameDay(a, b) {
  return a.date === b.date;
}

export function getHour(receipt) {
  return Number((receipt.time || "00:00").split(":")[0]);
}

export function getWeekday(receipt) {
  const [y, m, d] = receipt.date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay(); // 0=Sun..6=Sat
}

export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatTime(timeStr) {
  const [hh, mm] = timeStr.split(":").map(Number);
  const period = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${period}`;
}

export function isLateNight(receipt) {
  const h = getHour(receipt);
  return h >= 23 || h < 2;
}

export function daySpan(receipts) {
  if (!receipts.length) return { start: null, end: null, days: 0 };
  const sorted = [...receipts].sort((a, b) => toTimestamp(a) - toTimestamp(b));
  const start = sorted[0].date;
  const end = sorted[sorted.length - 1].date;
  const days = Math.round((toTimestamp(sorted[sorted.length - 1]) - toTimestamp(sorted[0])) / 86400000) + 1;
  return { start, end, days };
}
