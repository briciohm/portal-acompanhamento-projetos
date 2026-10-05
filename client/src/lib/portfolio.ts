export type PortfolioFilter = "all" | "active" | "completed";

export type PortfolioProject = {
  progress: number;
  status: string;
};

export function filterProjectsByPortfolio<T extends PortfolioProject>(
  projects: readonly T[],
  filter: PortfolioFilter
): T[] {
  if (filter === "completed") {
    return projects.filter(
      project => project.progress >= 100 || project.status === "concluído"
    );
  }

  if (filter === "active") {
    return projects.filter(
      project => project.progress < 100 && project.status !== "concluído"
    );
  }

  return [...projects];
}

export type SectorFilter = "all" | "DPAT" | "DPGDOC" | "DTRAN" | "DZEL";

export type SectorProject = {
  code: string;
  areaCode?: string | null;
  areaName?: string | null;
};

const sectorAliases: Record<Exclude<SectorFilter, "all">, readonly string[]> = {
  DPAT: ["DPAT", "PATRIMONIO"],
  DPGDOC: ["DPGDOC", "DPG", "GESTAODOCUMENTAL"],
  DTRAN: ["DTRAN", "TRANSPORTES"],
  DZEL: ["DZEL", "ZELADORIA"],
};

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function filterProjectsBySector<T extends SectorProject>(
  projects: readonly T[],
  sector: SectorFilter
): T[] {
  if (sector === "all") return [...projects];

  const aliases = sectorAliases[sector];
  return projects.filter(project => {
    const values = [project.code, project.areaCode, project.areaName].map(
      normalize
    );
    return aliases.some(alias => values.some(value => value.includes(alias)));
  });
}
