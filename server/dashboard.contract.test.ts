import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext: TrpcContext = {
  user: undefined,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("dashboard contracts", () => {
  it("returns the executive summary shape", async () => {
    const result = await appRouter.createCaller(publicContext).dashboard.summary();
    expect(result).toHaveProperty("areas");
    expect(result).toHaveProperty("projects");
    expect(result.totals).toEqual(expect.objectContaining({ projects: expect.any(Number), active: expect.any(Number), completed: expect.any(Number), averageProgress: expect.any(Number) }));
  });

  it("returns documents in the project detail contract", async () => {
    const result = await appRouter.createCaller(publicContext).dashboard.project({ id: 3 });
    expect(result?.project.code).toBe("DPAT-003");
    expect(result?.documents).toEqual(expect.any(Array));
    expect(result?.documents.length).toBeGreaterThanOrEqual(13);
  });

  it("returns the SAM Patrimônio materials", async () => {
    const result = await appRouter.createCaller(publicContext).dashboard.project({ id: 8 });
    expect(result?.project.code).toBe("DPAT-008");
    expect(result?.documents).toEqual(expect.any(Array));
    expect(result?.documents.length).toBeGreaterThanOrEqual(16);
  });

  it("preserves owner and percentage progress in the project detail", async () => {
    const result = await appRouter.createCaller(publicContext).dashboard.project({ id: 8 });
    expect(result?.project.owner).toEqual(expect.any(String));
    expect(result?.project.progress).toEqual(expect.any(Number));
    expect(result?.project.progress).toBeGreaterThanOrEqual(0);
    expect(result?.project.progress).toBeLessThanOrEqual(100);
  });

  it("returns the Almoxarifado and SAM Estoque action plans", async () => {
    const almoxarifado = await appRouter.createCaller(publicContext).dashboard.project({ id: 6 });
    const samEstoque = await appRouter.createCaller(publicContext).dashboard.project({ id: 7 });

    expect(almoxarifado?.project.code).toBe("DPAT-006");
    expect(almoxarifado?.documents.some((document) => document.title.includes("Almoxarifado"))).toBe(true);
    expect(samEstoque?.project.code).toBe("DPAT-007");
    expect(samEstoque?.documents.some((document) => document.title.includes("SAM Estoque"))).toBe(true);
  });

  it("returns the new project classifications and Portal DPAT evidence", async () => {
    const deposits = await appRouter.createCaller(publicContext).dashboard.project({ id: 60001 });
    const pops = await appRouter.createCaller(publicContext).dashboard.project({ id: 60002 });
    const pills = await appRouter.createCaller(publicContext).dashboard.project({ id: 60003 });
    const portal = await appRouter.createCaller(publicContext).dashboard.project({ id: 5 });

    expect(deposits?.project.code).toBe("DPAT-013");
    expect(deposits?.documents.some((document) => document.title.includes("Depósitos"))).toBe(true);
    expect(pops?.project.code).toBe("DPAT-014");
    expect(pops?.documents.some((document) => document.title.includes("Procedimentos Operacionais"))).toBe(true);
    expect(pills?.project.code).toBe("DPAT-015");
    expect(pills?.documents.some((document) => document.title.includes("Pílulas"))).toBe(true);
    expect(portal?.documents.some((document) => document.title.includes("Atualização Portal DPAT"))).toBe(true);
    expect(portal?.photos.some((photo) => photo.title?.includes("referência visual anterior"))).toBe(true);
  });
});
