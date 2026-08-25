export type PortfolioFilter = "all" | "active" | "completed";

export type PortfolioProject = {
  progress: number;
  status: string;
};

export function filterProjectsByPortfolio<T extends PortfolioProject>(projects: readonly T[], filter: PortfolioFilter): T[] {
  if (filter === "completed") {
    return projects.filter(project => project.progress >= 100 || project.status === "concluído");
  }

  if (filter === "active") {
    return projects.filter(project => project.progress < 100 && project.status !== "concluído");
  }

  return [...projects];
}
