import { describe, expect, it } from "vitest";
import { computeConnection, buildConnections } from "./connections";

function makeReceipt(overrides = {}) {
  return {
    id: overrides.id || "r-1",
    title: overrides.title || "Receipt",
    subtitle: overrides.subtitle || "",
    description: overrides.description || "",
    category: overrides.category || "note",
    date: overrides.date || "2025-02-03",
    time: overrides.time || "23:30",
    location: overrides.location || "Home",
    tags: overrides.tags || ["study"],
    ...overrides,
  };
}

describe("connection engine", () => {
  it("produces symmetric scores for matching receipts", () => {
    const a = makeReceipt({
      id: "a",
      title: "Late-night study",
      description: "Study plan before the exam.",
      date: "2025-02-03",
      time: "23:10",
      location: "Home",
      tags: ["study", "late-night"],
    });

    const b = makeReceipt({
      id: "b",
      title: "Study notes",
      description: "Updated notes after the study session.",
      date: "2025-02-03",
      time: "23:45",
      location: "Home",
      tags: ["study", "late-night"],
    });

    const left = computeConnection(a, b);
    const right = computeConnection(b, a);

    expect(left).not.toBeNull();
    expect(right).not.toBeNull();
    expect(left.score).toBe(right.score);
  });

  it("filters out below-threshold connections", () => {
    const a = makeReceipt({
      id: "a",
      title: "Morning coffee",
      date: "2025-02-03",
      time: "08:10",
      location: "Moonlight Café",
      tags: ["coffee"],
      description: "Coffee before work.",
    });

    const b = makeReceipt({
      id: "b",
      title: "Different place",
      date: "2025-02-04",
      time: "09:00",
      location: "Office",
      tags: ["work"],
      description: "No meaningful overlap.",
    });

    expect(computeConnection(a, b)).toBeNull();
    expect(buildConnections([a, b])).toEqual([]);
  });

  it("generates reasons from actual matching factors", () => {
    const a = makeReceipt({
      id: "a",
      title: "Late-night study plan",
      date: "2025-02-03",
      time: "23:00",
      location: "Home",
      tags: ["study", "late-night"],
      description: "Study plan for the exam.",
    });

    const b = makeReceipt({
      id: "b",
      title: "Study notes",
      date: "2025-02-03",
      time: "23:40",
      location: "Home",
      tags: ["study", "late-night"],
      description: "Updated notes for the exam.",
    });

    const connection = computeConnection(a, b);
    expect(connection).not.toBeNull();
    expect(connection.reasons.length).toBeGreaterThan(0);
    expect(connection.reasons.some((reason) => reason.toLowerCase().includes("location"))).toBe(true);
    expect(connection.reasons.some((reason) => reason.toLowerCase().includes("study"))).toBe(true);
  });

  it("keeps the breakdown aligned with the actual matched factors", () => {
    const a = makeReceipt({
      id: "a",
      title: "Late-night study",
      date: "2025-02-03",
      time: "08:00",
      location: "Home",
      tags: ["study", "late-night"],
      description: "The exam is tomorrow.",
    });

    const b = makeReceipt({
      id: "b",
      title: "Study notes",
      date: "2025-02-03",
      time: "10:00",
      location: "Home",
      tags: ["study", "late-night"],
      description: "I wrote new notes before the exam.",
    });

    const connection = computeConnection(a, b);

    expect(connection).not.toBeNull();
    expect(connection.breakdown).toBeDefined();
    expect(connection.breakdown.location).toBeGreaterThan(0);
    expect(connection.breakdown.keyword).toBeGreaterThan(0);
    expect(connection.breakdown.tag).toBeGreaterThan(0);
    expect(connection.breakdown.sameDay).toBeGreaterThan(0);
    expect(connection.reasons.length).toBe(
      Object.values(connection.breakdown).filter((value) => value > 0).length
    );
    expect(Object.values(connection.breakdown).reduce((sum, value) => sum + value, 0)).toBeGreaterThan(0);
  });
});
