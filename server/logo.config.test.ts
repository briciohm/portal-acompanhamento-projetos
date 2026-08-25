import { describe, expect, it } from "vitest";

const logoPath = process.env.VITE_APP_LOGO || "/manus-storage/LogoEscuro_530888e1.png";

describe("configuração do logo institucional", () => {
  it("mantém um caminho de ativo válido e acessível pelo servidor local", async () => {
    expect(logoPath).toMatch(/^\/manus-storage\/.+\.png$/);

    const response = await fetch(`http://127.0.0.1:3000${logoPath}`);
    expect(response.ok).toBe(true);
    const contentType = response.headers.get("content-type") || "";
    expect(["image", "application/octet-stream"].some(type => contentType.includes(type))).toBe(true);
    expect(Number(response.headers.get("content-length") || "0")).toBeGreaterThan(0);
  });
});
