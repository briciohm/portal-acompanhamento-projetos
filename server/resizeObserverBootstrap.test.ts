import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("ResizeObserver bootstrap guard", () => {
  it("instala o filtro antes do coletor de diagnóstico", () => {
    const html = readFileSync(
      resolve(process.cwd(), "client/index.html"),
      "utf8"
    );

    const guardMarker = "ResizeObserver loop";
    const appMarker = "/src/main.tsx";
    const collector = readFileSync(
      resolve(process.cwd(), "client/public/__manus__/debug-collector.js"),
      "utf8"
    );

    expect(html).toContain(guardMarker);
    expect(html).toContain(appMarker);
    expect(collector.length).toBeGreaterThan(0);
    expect(html.indexOf(guardMarker)).toBeLessThan(html.indexOf(appMarker));
    expect(html).toMatch(/addEventListener\(["']error["']/);
  });
});
