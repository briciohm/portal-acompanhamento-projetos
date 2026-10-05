export type AdminProjectRow = {
  id: number;
  areaId: number;
  code: string;
  name: string;
  summary?: string | null;
  owner?: string | null;
  status: string;
  progress: number;
  isHidden?: boolean | null;
};

export type AdminAreaRow = {
  id: number;
  name: string;
  shortCode?: string | null;
};

export type ProjectListFilters = {
  search: string;
  status: string;
  areaId: string;
  owner: string;
};

export function filterAdminProjects(
  projects: AdminProjectRow[],
  areas: AdminAreaRow[],
  filters: ProjectListFilters
): AdminProjectRow[] {
  const query = filters.search.trim().toLocaleLowerCase();
  const ownerQuery = filters.owner.trim().toLocaleLowerCase();
  return projects.filter(project => {
    const area = areas.find(item => item.id === project.areaId);
    const searchable = [
      project.code,
      project.name,
      project.summary,
      project.owner,
      area?.name,
      area?.shortCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    const matchesSearch = !query || searchable.includes(query);
    const matchesStatus = !filters.status || project.status === filters.status;
    const matchesArea =
      !filters.areaId || String(project.areaId) === filters.areaId;
    const matchesOwner =
      !ownerQuery ||
      String(project.owner ?? "")
        .toLocaleLowerCase()
        .includes(ownerQuery);
    return matchesSearch && matchesStatus && matchesArea && matchesOwner;
  });
}

export function projectExportRows(
  projects: AdminProjectRow[],
  areas: AdminAreaRow[]
) {
  const areaNames = new Map(
    areas.map(area => [
      area.id,
      area.shortCode ? `${area.shortCode} — ${area.name}` : area.name,
    ])
  );
  return projects.map(project => ({
    Código: project.code,
    Projeto: project.name,
    Setor: areaNames.get(project.areaId) ?? "Área não encontrada",
    Responsável: project.owner ?? "Não informado",
    Status: project.status,
    Progresso: `${project.progress}%${project.isHidden ? " (oculto)" : ""}`,
    Resumo: project.summary ?? "",
  }));
}

export function toCsv(rows: Record<string, unknown>[]): string {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const escape = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    headers.map(escape).join(","),
    ...rows.map(row => headers.map(header => escape(row[header])).join(",")),
  ].join("\n");
}
