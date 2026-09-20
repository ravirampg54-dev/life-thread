import { describe, expect, it } from "vitest";
import { detectThreads } from "./threads";

function receipt(id, date, category) {
  return { id, date, time: "10:00", title: category, category, location: "Moonlight Café", tags: [] };
}

describe("thread thresholds", () => {
  it("requires enough receipts and repeated dates", () => {
    const belowMinimum = [receipt("a", "2025-01-01", "music"), receipt("b", "2025-01-01", "place"), receipt("c", "2025-01-02", "purchase")];
    expect(detectThreads(belowMinimum)).toEqual([]);

    const twoOccurrences = [
      receipt("a", "2025-01-01", "music"),
      receipt("b", "2025-01-01", "place"),
      receipt("c", "2025-01-02", "music"),
      receipt("d", "2025-01-02", "place"),
    ];
    const threads = detectThreads(twoOccurrences);
    expect(threads.some((thread) => thread.id === "cafe-thread")).toBe(true);
  });
});