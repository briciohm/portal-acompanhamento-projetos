import { describe, expect, it } from "vitest";
import {
  assignableProfiles,
  canAccessGovernance,
  canAssignProfile,
  canManageContent,
  canUseMasterProfile,
  isMasterAccount,
  MASTER_ACCOUNT_EMAIL,
  profileOfUser,
  roleForProfile,
  USER_PROFILES,
  USER_PROFILE_LABELS,
  USER_PROFILE_PERMISSION_MATRIX,
} from "../shared/userRoles";

describe("perfis de usuários", () => {
  it("expõe os cinco perfis institucionais com Master no topo", () => {
    expect(USER_PROFILES).toEqual([
      "admin_master",
      "admin_geral",
      "gestor_setor",
      "editor_projetos",
      "consulta",
    ]);
    expect(USER_PROFILE_LABELS.admin_master).toBe("Administrador Master");
    expect(MASTER_ACCOUNT_EMAIL).toBe("gustavocvc0810@gmail.com");
  });

  it("expõe a matriz visual completa e coerente com a hierarquia", () => {
    expect(USER_PROFILE_PERMISSION_MATRIX.map(item => item.profile)).toEqual(
      USER_PROFILES
    );
    expect(
      USER_PROFILE_PERMISSION_MATRIX.find(
        item => item.profile === "admin_master"
      )?.canCreate
    ).toContain("não replica");
    expect(
      USER_PROFILE_PERMISSION_MATRIX.find(
        item => item.profile === "gestor_setor"
      )?.canCreate
    ).toContain("Editor");
    expect(
      USER_PROFILE_PERMISSION_MATRIX.find(
        item => item.profile === "gestor_setor"
      )?.scope
    ).toContain("vinculados");
    expect(
      USER_PROFILE_PERMISSION_MATRIX.find(item => item.profile === "consulta")
        ?.canCreate
    ).toContain("Não cria");
  });

  it("mantém o papel legado admin/user coerente com o perfil", () => {
    expect(roleForProfile("admin_master")).toBe("admin");
    expect(roleForProfile("admin_geral")).toBe("admin");
    expect(roleForProfile("consulta")).toBe("user");
    expect(roleForProfile("editor_projetos")).toBe("user");
  });

  it("permite edição apenas para perfis operacionais ou administrativos", () => {
    expect(canManageContent("admin_master")).toBe(true);
    expect(canManageContent("admin_geral")).toBe(true);
    expect(canManageContent("gestor_setor")).toBe(true);
    expect(canManageContent("editor_projetos")).toBe(true);
    expect(canManageContent("consulta")).toBe(false);
  });

  it("restringe a Governança ao Administrador Geral e ao Master", () => {
    expect(canAccessGovernance("admin_master")).toBe(true);
    expect(canAccessGovernance("admin_geral")).toBe(true);
    expect(canAccessGovernance("gestor_setor")).toBe(false);
    expect(canAccessGovernance("editor_projetos")).toBe(false);
    expect(canAccessGovernance("consulta")).toBe(false);
  });

  it("permite somente perfis estritamente inferiores e nunca replica o Master", () => {
    expect(assignableProfiles("admin_master")).toEqual([
      "admin_geral",
      "gestor_setor",
      "editor_projetos",
      "consulta",
    ]);
    expect(assignableProfiles("admin_geral")).toEqual([
      "gestor_setor",
      "editor_projetos",
      "consulta",
    ]);
    expect(assignableProfiles("gestor_setor")).toEqual([
      "editor_projetos",
      "consulta",
    ]);
    expect(assignableProfiles("editor_projetos")).toEqual(["consulta"]);
    expect(assignableProfiles("consulta")).toEqual([]);
    expect(canAssignProfile("admin_master", "admin_master")).toBe(false);
    expect(canAssignProfile("admin_geral", "admin_master")).toBe(false);
    expect(canAssignProfile("gestor_setor", "gestor_setor")).toBe(false);
    expect(canAssignProfile("gestor_setor", "admin_geral")).toBe(false);
    expect(canAssignProfile("gestor_setor", "editor_projetos")).toBe(true);
    expect(canAssignProfile("editor_projetos", "consulta")).toBe(true);
  });

  it("aceita o Master somente para a conta proprietária", () => {
    expect(isMasterAccount("gustavocvc0810@gmail.com")).toBe(true);
    expect(isMasterAccount("GUSTAVOCVC0810@GMAIL.COM")).toBe(true);
    expect(isMasterAccount("outra pessoa@example.com")).toBe(false);
    expect(
      canUseMasterProfile("gustavocvc0810@gmail.com", "admin_master")
    ).toBe(true);
    expect(
      canUseMasterProfile("outra pessoa@example.com", "admin_master")
    ).toBe(false);
    expect(canUseMasterProfile("outra pessoa@example.com", "admin_geral")).toBe(
      true
    );
  });

  it("resolve o perfil efetivo com fallback compatível com o papel legado", () => {
    expect(
      profileOfUser({
        role: "admin",
        profile: null,
        email: "gestor@example.com",
      })
    ).toBe("admin_geral");
    expect(
      profileOfUser({
        role: "user",
        profile: null,
        email: "consulta@example.com",
      })
    ).toBe("consulta");
    expect(
      profileOfUser({
        role: "user",
        profile: "editor_projetos",
        email: "editor@example.com",
      })
    ).toBe("editor_projetos");
    expect(
      profileOfUser({
        role: "user",
        profile: "consulta",
        email: MASTER_ACCOUNT_EMAIL,
      })
    ).toBe("admin_master");
  });
});
