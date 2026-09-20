import { describe, expect, it } from "vitest";
import { detectChapters } from "./chapters";

function receipt(id, date) {
  return {
    id,
    date,
    time: "10:00",
    title: "Painting session",
    category: "note",
    location: "Studio",
    tags: ["creative"],
  };
}

describe("chapter thresholds", () => {
  it("does not emit the creative chapter below its minimum count", () => {
    expect(detectChapters(Array.from({ length: 4 }, (_, index) => receipt(`r-${index}`, `2025-01-0${index + 1}`)))).toEqual([]);
  });

  it("emits the creative chapter at its configured minimum count", () => {
    const chapters = detectChapters(Array.from({ length: 5 }, (_, index) => receipt(`r-${index}`, `2025-01-0${index + 1}`)));
    expect(chapters.some((chapter) => chapter.id === "creative-streak")).toBe(true);
  });
});