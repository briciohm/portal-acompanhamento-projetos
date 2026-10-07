import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

function readServerEntry() {
  return readFileSync(resolve(projectRoot, "server/_core/index.ts"), "utf8");
}

describe("API fallback protection", () => {
  it("keeps unmatched tRPC requests out of the SPA HTML fallback", () => {
    const source = readServerEntry();

    expect(source).toContain('app.use("/api/trpc", (_req, res) =>');
    expect(source).toContain('code: "TRPC_API_NOT_FOUND"');
    expect(source).toContain(
      'message: "A rota tRPC solicitada não está disponível."'
    );
  });
});
