import { describe, expect, it } from "vitest";
import { assignableProfiles, canAssignProfile, USER_PROFILES, USER_PROFILE_LABELS, USER_PROFILE_PERMISSION_MATRIX, canManageContent, roleForProfile } from "../shared/userRoles";

describe("perfis de usuários", () => {
  it("expõe os quatro perfis institucionais", () => {
    expect(USER_PROFILES).toEqual(["admin_geral", "gestor_setor", "editor_projetos", "consulta"]);
    expect(USER_PROFILE_LABELS.gestor_setor).toBe("Gestor de Setor");
  });

  it("expõe a matriz visual completa e coerente com a hierarquia", () => {
    expect(USER_PROFILE_PERMISSION_MATRIX.map(item => item.profile)).toEqual(USER_PROFILES);
    expect(USER_PROFILE_PERMISSION_MATRIX.find(item => item.profile === "gestor_setor")?.canCreate).toContain("Editor");
    expect(USER_PROFILE_PERMISSION_MATRIX.find(item => item.profile === "gestor_setor")?.scope).toContain("vinculados");
    expect(USER_PROFILE_PERMISSION_MATRIX.find(item => item.profile === "consulta")?.canCreate).toContain("Não cria");
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

  it("permite somente perfis estritamente inferiores, sem espelhamento", () => {
    expect(assignableProfiles("admin_geral")).toEqual(["gestor_setor", "editor_projetos", "consulta"]);
    expect(assignableProfiles("gestor_setor")).toEqual(["editor_projetos", "consulta"]);
    expect(assignableProfiles("editor_projetos")).toEqual(["consulta"]);
    expect(assignableProfiles("consulta")).toEqual([]);
    expect(canAssignProfile("gestor_setor", "gestor_setor")).toBe(false);
    expect(canAssignProfile("gestor_setor", "admin_geral")).toBe(false);
    expect(canAssignProfile("gestor_setor", "editor_projetos")).toBe(true);
    expect(canAssignProfile("editor_projetos", "consulta")).toBe(true);
  });
});
