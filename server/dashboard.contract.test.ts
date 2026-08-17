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
    expect(result?.project.code).toBe("SECED-003");
    expect(result?.documents).toEqual(expect.any(Array));
    expect(result?.documents.length).toBeGreaterThanOrEqual(15);
  });
});
