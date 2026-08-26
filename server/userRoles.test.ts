import { describe, expect, it } from "vitest";
import { USER_PROFILES, USER_PROFILE_LABELS, canManageContent, roleForProfile } from "../shared/userRoles";

describe("perfis de usuários", () => {
  it("expõe os quatro perfis institucionais", () => {
    expect(USER_PROFILES).toEqual(["admin_geral", "gestor_setor", "editor_projetos", "consulta"]);
    expect(USER_PROFILE_LABELS.gestor_setor).toBe("Gestor de Setor");
  });

  it("mantém o papel legado admin/user coerente com o perfil", () => {
    expect(roleForProfile("admin_geral")).toBe("admin");
    expect(roleForProfile("consulta")).toBe("user");
    expect(roleForProfile("editor_projetos")).toBe("user");
  });

  it("permite edição apenas para perfis operacionais ou administrativos", () => {
    expect(canManageContent("admin_geral")).toBe(true);
    expect(canManageContent("gestor_setor")).toBe(true);
    expect(canManageContent("editor_projetos")).toBe(true);
    expect(canManageContent("consulta")).toBe(false);
  });
});
