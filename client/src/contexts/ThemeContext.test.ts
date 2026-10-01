import { describe, expect, it } from "vitest";
import { resolveTheme } from "./ThemeContext";

describe("resolveTheme", () => {
  it("restores a persisted light or dark theme", () => {
    expect(resolveTheme("light", "dark")).toBe("dark");
    expect(resolveTheme("dark", "light")).toBe("light");
  });

  it("falls back to the configured default for invalid or missing storage", () => {
    expect(resolveTheme("light", null)).toBe("light");
    expect(resolveTheme("dark", "system")).toBe("dark");
  });
});
