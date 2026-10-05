import { describe, expect, it } from "vitest";
import {
  filterAdminProjects,
  projectExportRows,
  toCsv,
} from "../client/src/lib/adminTools";

describe("admin CSV export", () => {
  it("serializes headers, commas, quotes, line breaks and empty values", () => {
    const csv = toCsv([
      {
        id: 1,
        message: "Falha, revisar",
        context: 'linha "A"\nlinha B',
        route: null,
      },
    ]);
    expect(csv).toBe(
      '"id","message","context","route"\n"1","Falha, revisar","linha ""A""\nlinha B",""'
    );
  });

  it("returns an empty string when there are no rows", () => {
    expect(toCsv([])).toBe("");
  });

  it("filters by search, status, sector and owner together", () => {
    const projects = [
      {
        id: 1,
        areaId: 10,
        code: "DPAT-001",
        name: "Inventário",
        summary: "Levantamento patrimonial",
        owner: "Ana",
        status: "andamento",
        progress: 50,
      },
      {
        id: 2,
        areaId: 11,
        code: "DTRAN-002",
        name: "Frota",
        summary: "Controle de veículos",
        owner: "Bruno",
        status: "concluído",
        progress: 100,
      },
    ];
    const areas = [
      { id: 10, name: "Patrimônio", shortCode: "DPAT" },
      { id: 11, name: "Transportes", shortCode: "DTRAN" },
    ];
    expect(
      filterAdminProjects(projects, areas, {
        search: "inventário",
        status: "andamento",
        areaId: "10",
        owner: "ana",
      })
    ).toHaveLength(1);
    expect(
      filterAdminProjects(projects, areas, {
        search: "",
        status: "",
        areaId: "",
        owner: "",
      }).map(project => project.code)
    ).toEqual(["DPAT-001", "DTRAN-002"]);
  });

  it("prepares stable executive columns for export", () => {
    const rows = projectExportRows(
      [
        {
          id: 1,
          areaId: 10,
          code: "DPAT-001",
          name: "Inventário",
          summary: "Resumo",
          owner: null,
          status: "andamento",
          progress: 50,
          isHidden: true,
        },
      ],
      [{ id: 10, name: "Patrimônio", shortCode: "DPAT" }]
    );
    expect(rows[0]).toEqual({
      Código: "DPAT-001",
      Projeto: "Inventário",
      Setor: "DPAT — Patrimônio",
      Responsável: "Não informado",
      Status: "andamento",
      Progresso: "50% (oculto)",
      Resumo: "Resumo",
    });
  });
});
