import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const readAdmin = () =>
  readFileSync(resolve(projectRoot, "client/src/pages/Admin.tsx"), "utf8");

describe("Back-Office resilience safeguards", () => {
  it("loads secondary data only when its function is selected", () => {
    const source = readAdmin();
    expect(source).toContain("value={activeTab}");
    expect(source).toContain("hasGovernanceAccess && isGovernanceTabActive");
    expect(source).toContain('currentProfile !== "consulta"');
    expect(source).toContain("Boolean(selectedProject) && isProjectTabActive");
  });

  it("offers recovery instead of silently rendering empty secondary panels", () => {
    const source = readAdmin();
    expect(source).toContain("function QueryErrorNotice");
    expect(source).toContain("Não foi possível carregar esta função.");
    expect(source).toContain("retryGovernance");
    expect(source).toContain("managedUsersQuery.error");
  });

  it("blocks invalid numeric submissions before they reach tRPC", () => {
    const source = readAdmin();
    expect(source).toContain("Number.isFinite(numericProgress)");
    expect(source).toContain("Number.isFinite(numericValue)");
    expect(source).toContain("numericTarget !== undefined");
  });

  it("reports local file-reading failures for document and photo uploads", () => {
    const source = readAdmin();
    expect(source).toContain("Não foi possível ler o arquivo selecionado.");
    expect(source).toContain("Não foi possível ler a imagem selecionada.");
  });
});
