import { describe, expect, it } from "vitest";
import { calculateStageProgress, stageStatusToProgress } from "./db";

describe("progress calculation", () => {
  it("maps stage statuses to the required weights", () => {
    expect(stageStatusToProgress(0)).toBe(0);
    expect(stageStatusToProgress(1)).toBe(50);
    expect(stageStatusToProgress(2)).toBe(100);
  });

  it("calculates the rounded average across all stages", () => {
    expect(calculateStageProgress([{ progressStatus: 0 }, { progressStatus: 1 }, { progressStatus: 2 }])).toBe(50);
    expect(calculateStageProgress([{ progressStatus: 1 }, { progressStatus: 2 }])).toBe(75);
  });

  it("returns zero when a project has no stages", () => {
    expect(calculateStageProgress([])).toBe(0);
  });
});
