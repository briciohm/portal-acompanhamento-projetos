import { describe, expect, it } from "vitest";
import { diagnosticAlertKey } from "./diagnostic";

describe("diagnosticAlertKey", () => {
  it("separates alert groups that share type and route but have different messages", () => {
    const first = diagnosticAlertKey({ type: "api-query-error", route: "/admin", message: "Falha em áreas" });
    const second = diagnosticAlertKey({ type: "api-query-error", route: "/admin", message: "Falha em projetos" });

    expect(first).not.toBe(second);
  });

  it("keeps the same alert group stable", () => {
    const input = { type: "client-error", route: "/admin", message: "Erro real" };

    expect(diagnosticAlertKey(input)).toBe(diagnosticAlertKey(input));
  });
});
