import { describe, expect, it } from "vitest";
import { toCsv } from "../client/src/lib/adminTools";

describe("admin CSV export", () => {
  it("serializes headers, commas, quotes, line breaks and empty values", () => {
    const csv = toCsv([
      { id: 1, message: "Falha, revisar", context: "linha \"A\"\nlinha B", route: null },
    ]);
    expect(csv).toBe('"id","message","context","route"\n"1","Falha, revisar","linha ""A""\nlinha B",""');
  });

  it("returns an empty string when there are no rows", () => {
    expect(toCsv([])).toBe("");
  });
});
