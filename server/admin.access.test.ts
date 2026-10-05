import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextWithRole(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "access-test",
      email: "user@example.com",
      name: "Access Test",
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin access control", () => {
  it("blocks non-admin users from the back-office procedures", async () => {
    const caller = appRouter.createCaller(contextWithRole("user"));
    await expect(
      caller.admin.createArea({ name: "Área teste", code: "TESTE" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks non-admin users from changing project and area visibility", async () => {
    const caller = appRouter.createCaller(contextWithRole("user"));
    await expect(
      caller.admin.toggleProjectVisibility({ id: 90001, isHidden: true })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      caller.admin.toggleAreaVisibility({ id: 1, isHidden: true })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("exposes hidden-state fields through administrative collections", async () => {
    const caller = appRouter.createCaller(contextWithRole("admin"));
    const [areas, projects] = await Promise.all([
      caller.admin.areas(),
      caller.admin.projects({ includeHidden: true }),
    ]);
    expect(Array.isArray(areas)).toBe(true);
    expect(Array.isArray(projects)).toBe(true);
    if (areas[0]) expect(areas[0]).toHaveProperty("isHidden");
    if (projects[0]) expect(projects[0]).toHaveProperty("isHidden");
  });

  it("exposes editable sector presentation fields to administrators", async () => {
    const caller = appRouter.createCaller(contextWithRole("admin"));
    const areas = await caller.admin.areas();
    expect(Array.isArray(areas)).toBe(true);
    if (areas[0]) {
      expect(areas[0]).toHaveProperty("shortCode");
      expect(areas[0]).toHaveProperty("icon");
    }
  });

  it("allows an administrator to update an existing project without remount errors", async () => {
    const caller = appRouter.createCaller(contextWithRole("admin"));
    const result = await caller.admin.updateProject({
      id: 90001,
      data: {
        summary:
          "Projeto cadastrado na carteira. O resumo executivo será elaborado após o recebimento ou localização do Plano de Ação correspondente.",
      },
    });

    expect(result?.id).toBe(90001);
    expect(result?.code).toBe("DPAT-016");
  });
});
