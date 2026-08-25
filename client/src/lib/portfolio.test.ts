import { describe, expect, it } from "vitest";
import { filterProjectsByPortfolio } from "./portfolio";

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
