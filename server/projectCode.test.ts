import { describe, expect, it } from "vitest";
import {
  formatProjectCode,
  nextProjectCode,
  normalizeProjectPrefix,
} from "../shared/projectCode";

describe("project code model", () => {
  it("normalizes the department prefix", () => {
    expect(normalizeProjectPrefix(" dzel ")).toBe("DZEL");
    expect(normalizeProjectPrefix("DTRAN/gestão")).toBe("DTRANGESTO");
    expect(normalizeProjectPrefix("")).toBe("PROJ");
  });

  it("formats a five-digit sequence", () => {
    expect(formatProjectCode("DTRAN", 1)).toBe("DTRAN-00001");
    expect(formatProjectCode("DZEL", 42)).toBe("DZEL-00042");
  });

  it("increments only matching codes and preserves legacy codes", () => {
    expect(
      nextProjectCode("DPAT", [
        "DPAT-001",
        "DPAT-00003",
        "DTRAN-00099",
        "DPAT-ABC",
      ])
    ).toBe("DPAT-00004");
    expect(nextProjectCode("DTRAN", ["DTRAN-00099"])).toBe("DTRAN-00100");
    expect(nextProjectCode("DZEL", [])).toBe("DZEL-00001");
  });

  it("rejects sequences outside the supported range", () => {
    expect(() => formatProjectCode("DPAT", 0)).toThrow();
    expect(() => formatProjectCode("DPAT", 100000)).toThrow();
  });
});
