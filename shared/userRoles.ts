export const MASTER_ACCOUNT_EMAIL = "gustavocvc0810@gmail.com" as const;

export const USER_PROFILES = ["admin_master", "admin_geral", "gestor_setor", "editor_projetos", "consulta"] as const;

export type UserProfile = (typeof USER_PROFILES)[number];

export const USER_PROFILE_LABELS: Record<UserProfile, string> = {
  admin_master: "Administrador Master",
  admin_geral: "Administrador Geral",
  gestor_setor: "Gestor de Setor",
  editor_projetos: "Editor de Projetos",
  consulta: "Consulta",
};

export const USER_PROFILE_DESCRIPTIONS: Record<UserProfile, string> = {
  admin_master: "Perfil exclusivo da conta proprietária, acima do Administrador Geral, com controle total da plataforma e da hierarquia de perfis.",
  admin_geral: "Acesso completo ao conteúdo, estrutura, usuários e permissões, exceto à conta Master.",
  gestor_setor: "Gerencia projetos e evidências dos setores vinculados.",
  editor_projetos: "Edita projetos e evidências, sem administrar usuários ou estrutura.",
  consulta: "Visualiza o back-office e os relatórios, sem alterar dados.",
};

export function roleForProfile(profile: UserProfile) {
  return profile === "admin_master" || profile === "admin_geral" ? "admin" as const : "user" as const;
}

export const USER_PROFILE_PERMISSION_MATRIX: Array<{ profile: UserProfile; access: string; canCreate: string; scope: string }> = [
  { profile: "admin_master", access: "Controle total e proteção da conta proprietária", canCreate: "Pode criar perfis abaixo dele; não replica o Master", scope: "Todos os setores e configurações" },
  { profile: "admin_geral", access: "Acesso completo", canCreate: "Pode criar Gestor, Editor e Consulta; não cria Master", scope: "Todos os setores" },
  { profile: "gestor_setor", access: "Gestão operacional setorial", canCreate: "Editor de Projetos e Consulta", scope: "Somente setores vinculados" },
  { profile: "editor_projetos", access: "Edição de projetos", canCreate: "Consulta", scope: "Projetos autorizados" },
  { profile: "consulta", access: "Somente leitura", canCreate: "Não cria perfis", scope: "Conteúdo permitido" },
];

export const USER_PROFILE_LEVELS: Record<UserProfile, number> = {
  consulta: 1,
  editor_projetos: 2,
  gestor_setor: 3,
  admin_geral: 4,
  admin_master: 5,
};

export function canManageContent(profile: UserProfile) {
  return profile !== "consulta";
}

export function canAccessGovernance(profile: UserProfile) {
  return profile === "admin_geral" || profile === "admin_master";
}

export function canAssignProfile(actorProfile: UserProfile, targetProfile: UserProfile) {
  return targetProfile !== "admin_master" && USER_PROFILE_LEVELS[targetProfile] < USER_PROFILE_LEVELS[actorProfile];
}

export function assignableProfiles(actorProfile: UserProfile): UserProfile[] {
  return USER_PROFILES.filter(profile => canAssignProfile(actorProfile, profile));
}

export function isMasterAccount(email?: string | null) {
  return email?.trim().toLowerCase() === MASTER_ACCOUNT_EMAIL;
}

export function canUseMasterProfile(email: string | null | undefined, profile: UserProfile) {
  return profile !== "admin_master" || isMasterAccount(email);
}

export function profileOfUser(user: { role: string; profile?: UserProfile | null; email?: string | null }) {
  if (isMasterAccount(user.email)) return "admin_master" as const;
  return (user.profile || (user.role === "admin" ? "admin_geral" : "consulta")) as UserProfile;
}
