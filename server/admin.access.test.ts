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
    await expect(caller.admin.createArea({ name: "Área teste", code: "TESTE" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
