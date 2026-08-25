import { describe, expect, it } from "vitest";
import { filterProjectsByPortfolio, filterProjectsBySector } from "./portfolio";

const projects = [
  { id: 1, progress: 0, status: "em andamento" },
  { id: 2, progress: 50, status: "em andamento" },
  { id: 3, progress: 100, status: "em andamento" },
  { id: 4, progress: 80, status: "concluído" },
];

describe("filterProjectsByPortfolio", () => {
  it("returns every registered project for the all filter", () => {
    expect(filterProjectsByPortfolio(projects, "all").map(project => project.id)).toEqual([1, 2, 3, 4]);
  });

  it("returns only active projects below 100 percent", () => {
    expect(filterProjectsByPortfolio(projects, "active").map(project => project.id)).toEqual([1, 2]);
  });

  it("returns projects completed by status or by reaching 100 percent", () => {
    expect(filterProjectsByPortfolio(projects, "completed").map(project => project.id)).toEqual([3, 4]);
  });
});

describe("filterProjectsBySector", () => {
  const sectorProjects = [
    { id: 1, code: "DPAT-001", areaCode: "SEC-EDUC-PROJETOS", areaName: "Projetos Estratégicos da Secretaria da Educação" },
    { id: 2, code: "DPG-001", areaCode: "DPGDOC-001", areaName: "Projetos DPGDOC" },
    { id: 3, code: "DTRAN-001", areaCode: "DTRAN-001", areaName: "Divisão de Transportes" },
    { id: 4, code: "DZEL-001", areaCode: "DZEL-001", areaName: "Divisão de Zeladoria" },
  ];

  it("matches the real DPAT project-code convention", () => {
    expect(filterProjectsBySector(sectorProjects, "DPAT").map(project => project.id)).toEqual([1]);
  });

  it("matches department codes and names for DPGDOC, DTRAN and DZEL", () => {
    expect(filterProjectsBySector(sectorProjects, "DPGDOC").map(project => project.id)).toEqual([2]);
    expect(filterProjectsBySector(sectorProjects, "DTRAN").map(project => project.id)).toEqual([3]);
    expect(filterProjectsBySector(sectorProjects, "DZEL").map(project => project.id)).toEqual([4]);
  });
});
