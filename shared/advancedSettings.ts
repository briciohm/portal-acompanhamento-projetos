export const ADVANCED_SETTING_KEYS = [
  "maintenance_mode",
  "allow_project_edits",
  "allow_user_management",
  "diagnostic_collection",
] as const;

export type AdvancedSettingKey = (typeof ADVANCED_SETTING_KEYS)[number];

export const ADVANCED_SETTING_DEFINITIONS: Record<AdvancedSettingKey, {
  label: string;
  description: string;
  risk: "alto" | "médio" | "baixo";
  defaultValue: boolean;
}> = {
  maintenance_mode: {
    label: "Modo de manutenção",
    description: "Sinaliza que alterações operacionais devem ser temporariamente interrompidas durante intervenções críticas.",
    risk: "alto",
    defaultValue: false,
  },
  allow_project_edits: {
    label: "Permitir edições de projetos",
    description: "Controla globalmente alterações de projetos, etapas, marcos, indicadores e evidências.",
    risk: "alto",
    defaultValue: true,
  },
  allow_user_management: {
    label: "Permitir gestão de usuários",
    description: "Controla globalmente criação, alteração e desativação de perfis pelo Back-Office.",
    risk: "alto",
    defaultValue: true,
  },
  diagnostic_collection: {
    label: "Coleta de diagnóstico do cliente",
    description: "Permite registrar erros reais do cliente para investigação técnica e melhoria da estabilidade.",
    risk: "médio",
    defaultValue: true,
  },
};

export function parseAdvancedSettingValue(value: string | boolean | null | undefined, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}
