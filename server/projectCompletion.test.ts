import { describe, expect, it } from "vitest";
import { normalizeProjectUpdate } from "./db";

describe("project completion update", () => {
  it("preserves explicit completion in automatic mode", () => {
    const result = normalizeProjectUpdate({ isManual: false, status: "concluído" });

    expect(result.explicitlyConcluding).toBe(true);
    expect(result.normalizedInput).toMatchObject({
      isManual: false,
      status: "concluído",
      progress: 100,
      manualObservation: null,
    });
  });

  it("keeps automatic synchronization for non-completion updates", () => {
    const result = normalizeProjectUpdate({ isManual: false, status: "andamento" });

    expect(result.explicitlyConcluding).toBe(false);
    expect(result.normalizedInput).toMatchObject({ isManual: false, status: "andamento", manualObservation: null });
    expect(result.normalizedInput.progress).toBeUndefined();
  });

  it("still promotes a supplied progress of 100 when no status is supplied", () => {
    const result = normalizeProjectUpdate({ progress: 100 });

    expect(result.explicitlyConcluding).toBe(false);
    expect(result.normalizedInput).toMatchObject({ progress: 100, status: "concluído" });
  });
});
