import { describe, expect, it } from "vitest";
import { buildStory } from "./story";

describe("buildStory", () => {
  it("always returns opening and closing scenes", () => {
    const scenes = buildStory([], [], []);
    expect(scenes.length).toBe(2);
    expect(scenes[0].id).toBe("scene-open");
    expect(scenes[1].id).toBe("scene-close");
  });

  it("adds midnight scene when chapter exists", () => {
    const chapters = [{ id: "midnight-phase", summary: "summary", receiptIds: [] }];
    const scenes = buildStory(chapters, [], []);
    expect(scenes.some(s => s.id === "scene-midnight")).toBe(true);
    expect(scenes.length).toBe(3);
  });
});
