export const USER_PROFILES = ["admin_geral", "gestor_setor", "editor_projetos", "consulta"] as const;

export type UserProfile = (typeof USER_PROFILES)[number];

export const USER_PROFILE_LABELS: Record<UserProfile, string> = {
  admin_geral: "Administrador Geral",
  gestor_setor: "Gestor de Setor",
  editor_projetos: "Editor de Projetos",
  consulta: "Consulta",
};

export const USER_PROFILE_DESCRIPTIONS: Record<UserProfile, string> = {
  admin_geral: "Acesso completo ao conteúdo, estrutura, usuários e permissões.",
  gestor_setor: "Gerencia projetos e evidências dos setores vinculados.",
  editor_projetos: "Edita projetos e evidências, sem administrar usuários ou estrutura.",
  consulta: "Visualiza o back-office e os relatórios, sem alterar dados.",
};

export function roleForProfile(profile: UserProfile) {
  return profile === "admin_geral" ? "admin" as const : "user" as const;
}

export function canManageContent(profile: UserProfile) {
  return profile !== "consulta";
}
