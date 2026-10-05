import { describe, expect, it } from "vitest";
import {
  ADVANCED_SETTING_DEFINITIONS,
  ADVANCED_SETTING_KEYS,
  parseAdvancedSettingValue,
} from "../shared/advancedSettings";

describe("configurações avançadas do Administrador Master", () => {
  it("mantém um catálogo fechado de recursos críticos com defaults seguros", () => {
    expect(ADVANCED_SETTING_KEYS).toEqual([
      "maintenance_mode",
      "allow_project_edits",
      "allow_user_management",
      "diagnostic_collection",
    ]);
    expect(ADVANCED_SETTING_DEFINITIONS.maintenance_mode.defaultValue).toBe(
      false
    );
    expect(ADVANCED_SETTING_DEFINITIONS.allow_project_edits.defaultValue).toBe(
      true
    );
    expect(
      ADVANCED_SETTING_DEFINITIONS.allow_user_management.defaultValue
    ).toBe(true);
    expect(
      ADVANCED_SETTING_DEFINITIONS.diagnostic_collection.defaultValue
    ).toBe(true);
  });

  it("interpreta valores persistidos sem aceitar strings arbitrárias como true", () => {
    expect(parseAdvancedSettingValue("true", false)).toBe(true);
    expect(parseAdvancedSettingValue("false", true)).toBe(false);
    expect(parseAdvancedSettingValue("unexpected", false)).toBe(false);
    expect(parseAdvancedSettingValue(undefined, true)).toBe(true);
  });

  it("exige descrição e nível de risco para cada recurso crítico", () => {
    for (const key of ADVANCED_SETTING_KEYS) {
      expect(ADVANCED_SETTING_DEFINITIONS[key].label.length).toBeGreaterThan(3);
      expect(
        ADVANCED_SETTING_DEFINITIONS[key].description.length
      ).toBeGreaterThan(20);
      expect(["alto", "médio", "baixo"]).toContain(
        ADVANCED_SETTING_DEFINITIONS[key].risk
      );
    }
  });
});
