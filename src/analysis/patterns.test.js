import { describe, expect, it } from "vitest";
import { detectTopWeekday, detectLateNightCluster, detectDiscoveries } from "./patterns";

function receipt(id, date, hour = "10") {
  return { id, date, time: `${hour}:00`, title: "Test", category: "note", location: "Home", tags: ["test"] };
}

describe("pattern detectors", () => {
  it("detectTopWeekday requires at least 5 receipts on the same day of week", () => {
    // 2024-01-01 is a Monday
    const receipts = [
      receipt("r1", "2024-01-01"),
      receipt("r2", "2024-01-08"),
      receipt("r3", "2024-01-15"),
      receipt("r4", "2024-01-22"),
    ];
    expect(detectTopWeekday(receipts)).toBeNull();
    receipts.push(receipt("r5", "2024-01-29"));
    const res = detectTopWeekday(receipts);
    expect(res).not.toBeNull();
    expect(res.id).toBe("top-weekday");
  });

  it("detectLateNightCluster requires at least 4 late night receipts", () => {
    const receipts = Array.from({ length: 4 }, (_, i) => receipt(`r${i}`, "2024-01-01", "23"));
    expect(detectLateNightCluster(receipts.slice(0, 3))).toBeNull();
    expect(detectLateNightCluster(receipts)).not.toBeNull();
  });
  
  it("detectDiscoveries filters out nulls", () => {
    const receipts = [receipt("r1", "2024-01-01", "10")];
    expect(detectDiscoveries(receipts, [])).toEqual([]);
  });
});
