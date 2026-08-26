from pathlib import Path

path = Path('/home/ubuntu/portal-acompanhamento-projetos/client/src/pages/Admin.tsx')
text = path.read_text()

text = text.replace(
    'import { toCsv } from "@/lib/adminTools";',
    'import { filterAdminProjects, projectExportRows, toCsv } from "@/lib/adminTools";\nimport type { AdminProjectRow, ProjectListFilters } from "@/lib/adminTools";\nimport * as XLSX from "xlsx";\nimport jsPDF from "jspdf";\nimport autoTable from "jspdf-autotable";'
)
text = text.replace(
    'type AdminProject = { id: number; areaId: number; code: string; name: string; status: string; progress: number; isHidden?: boolean | null };',
    'type AdminProject = AdminProjectRow & { summary?: string | null; owner?: string | null };'
)
start = text.index('function VisibilityManagement(')
end = text.index('\nfunction AreaEditForm', start)
replacement = '''function VisibilityManagement({ areas, projects, onToggleArea, onToggleProject, onUpdateArea, loading }: { areas: AdminArea[]; projects: AdminProject[]; onToggleArea: (id: number, isHidden: boolean) => void; onToggleProject: (id: number, isHidden: boolean) => void; onUpdateArea: (id: number, data: AreaUpdate) => void; loading: boolean }) {
  const [scope, setScope] = useState<"all" | "active" | "hidden">("all");
  const [editingAreaId, setEditingAreaId] = useState<number | null>(null);
  const [filters, setFilters] = useState<ProjectListFilters>({ search: "", status: "", areaId: "", owner: "" });
  const matchesScope = (isHidden: boolean | null | undefined) => scope === "all" || (scope === "hidden" ? Boolean(isHidden) : !isHidden);
  const filteredAreas = areas.filter(area => matchesScope(area.isHidden));
  const areaNames = new Map(areas.map(area => [area.id, area.name]));
  const scopedProjects = projects.filter(project => matchesScope(project.isHidden));
  const filteredProjects = filterAdminProjects(scopedProjects, areas, filters);
  const exportRows = projectExportRows(filteredProjects, areas);
  const setFilter = (key: keyof ProjectListFilters, value: string) => setFilters(current => ({ ...current, [key]: value }));
  const resetFilters = () => setFilters({ search: "", status: "", areaId: "", owner: "" });
  const exportExcel = () => {
    if (!exportRows.length) return;
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = [{ wch: 16 }, { wch: 38 }, { wch: 34 }, { wch: 26 }, { wch: 16 }, { wch: 14 }, { wch: 70 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projetos");
    XLSX.writeFile(workbook, `projetos-back-office-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(`${filteredProjects.length} projeto(s) exportado(s) para Excel.`);
  };
  const exportPdf = () => {
    if (!exportRows.length) return;
    const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    document.setFontSize(16);
    document.text("COGESPA — Relatório de projetos", 14, 16);
    document.setFontSize(9);
    document.setTextColor(90);
    document.text(`Gerado em ${new Date().toLocaleString()} · ${filteredProjects.length} projeto(s)`, 14, 22);
    autoTable(document, {
      startY: 28,
      head: [["Código", "Projeto", "Setor", "Responsável", "Status", "Progresso"]],
      body: exportRows.map(row => [row.Código, row.Projeto, row.Setor, row.Responsável, row.Status, row.Progresso]),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [227, 6, 19] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });
    document.save(`projetos-back-office-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success(`${filteredProjects.length} projeto(s) exportado(s) para PDF.`);
  };
  return <div className="space-y-6"><Card className="border-[#e30613]/20 bg-[#fffafa]"><CardHeader><CardTitle className="flex items-center gap-2 text-lg font-black"><Eye className="h-5 w-5 text-[#e30613]" />Visibilidade do portal</CardTitle><p className="text-sm leading-6 text-neutral-600">Ocultar não exclui registros. Projetos e áreas ocultos deixam de aparecer no portal público, mas continuam disponíveis aqui para edição e reativação.</p></CardHeader><CardContent><div className="flex flex-wrap gap-2"><Button size="sm" variant={scope === "all" ? "default" : "outline"} onClick={() => setScope("all")} className={scope === "all" ? "bg-[#171717]" : ""}>Todos ({areas.length + projects.length})</Button><Button size="sm" variant={scope === "active" ? "default" : "outline"} onClick={() => setScope("active")} className={scope === "active" ? "bg-[#171717]" : ""}>Visíveis ({areas.filter(area => !area.isHidden).length + projects.filter(project => !project.isHidden).length})</Button><Button size="sm" variant={scope === "hidden" ? "default" : "outline"} onClick={() => setScope("hidden")} className={scope === "hidden" ? "bg-[#e30613] hover:bg-[#c80511]" : ""}>Ocultos ({areas.filter(area => area.isHidden).length + projects.filter(project => project.isHidden).length})</Button></div></CardContent></Card><div className="grid gap-6 xl:grid-cols-2"><Card><CardHeader><CardTitle className="text-lg font-black">Áreas</CardTitle></CardHeader><CardContent className="space-y-4">{filteredAreas.length ? filteredAreas.map(area => <div key={area.id} className="border-b border-neutral-100 pb-4 last:border-0"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-black">{area.name}</p><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${area.isHidden ? "bg-[#fff0f1] text-[#a0040d]" : "bg-emerald-50 text-emerald-700"}`}>{area.isHidden ? "Oculta" : "Visível"}</span></div><p className="mt-1 text-xs text-neutral-500">{area.code} · {projects.filter(project => project.areaId === area.id).length} projeto(s)</p></div><div className="flex shrink-0 gap-2"><Button size="sm" variant="outline" onClick={() => setEditingAreaId(editingAreaId === area.id ? null : area.id)} disabled={loading}><Pencil className="mr-1 h-3.5 w-3.5" />Editar</Button><Button size="sm" variant={area.isHidden ? "default" : "outline"} onClick={() => onToggleArea(area.id, !Boolean(area.isHidden))} disabled={loading} className={area.isHidden ? "bg-[#e30613] hover:bg-[#c80511]" : ""}>{loading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : area.isHidden ? <RefreshCcw className="mr-1 h-3.5 w-3.5" /> : <EyeOff className="mr-1 h-3.5 w-3.5" />}{loading ? "Processando..." : area.isHidden ? "Reativar" : "Ocultar"}</Button></div></div>{editingAreaId === area.id ? <AreaEditForm key={area.id} area={area} onSubmit={data => onUpdateArea(area.id, data)} onCancel={() => setEditingAreaId(null)} loading={loading} /> : null}</div>) : <EmptyAdmin text={scope === "hidden" ? "Nenhuma área oculta encontrada." : "Nenhuma área encontrada para este filtro."} />}</CardContent></Card><Card><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg font-black">Projetos</CardTitle><p className="mt-1 text-xs text-neutral-500">{filteredProjects.length} de {scopedProjects.length} projeto(s) exibido(s)</p></div><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={exportExcel} disabled={!exportRows.length}><Download className="mr-1 h-3.5 w-3.5" />Excel</Button><Button size="sm" variant="outline" onClick={exportPdf} disabled={!exportRows.length}><Download className="mr-1 h-3.5 w-3.5" />PDF</Button></div></div></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 md:grid-cols-2"><Input aria-label="Pesquisar projetos" value={filters.search} onChange={event => setFilter("search", event.target.value)} placeholder="Pesquisar por código, nome, resumo ou setor" /><Input aria-label="Filtrar por responsável" value={filters.owner} onChange={event => setFilter("owner", event.target.value)} placeholder="Filtrar por responsável" /><Select value={filters.status || "todos"} onValueChange={value => setFilter("status", value === "todos" ? "" : value)}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos os status</SelectItem>{["estruturação", "andamento", "execução", "concluído", "pausado"].map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select><Select value={filters.areaId || "todas"} onValueChange={value => setFilter("areaId", value === "todas" ? "" : value)}><SelectTrigger><SelectValue placeholder="Setor" /></SelectTrigger><SelectContent><SelectItem value="todas">Todos os setores</SelectItem>{areas.map(area => <SelectItem key={area.id} value={String(area.id)}>{area.shortCode ? `${area.shortCode} — ${area.name}` : area.name}</SelectItem>)}</SelectContent></Select></div><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-neutral-500">A busca considera código, nome, resumo, responsável e setor.</p><Button size="sm" variant="ghost" onClick={resetFilters} disabled={!filters.search && !filters.status && !filters.areaId && !filters.owner}>Limpar filtros</Button></div>{filteredProjects.length ? filteredProjects.map(project => <div key={project.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-4 last:border-0"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-black">{project.name}</p><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${project.isHidden ? "bg-[#fff0f1] text-[#a0040d]" : "bg-emerald-50 text-emerald-700"}`}>{project.isHidden ? "Oculto" : "Visível"}</span></div><p className="mt-1 text-xs text-neutral-500">{project.code} · {areaNames.get(project.areaId) || "Área não encontrada"} · {project.owner || "Responsável não informado"} · {project.progress}%</p></div><Button size="sm" variant={project.isHidden ? "default" : "outline"} onClick={() => onToggleProject(project.id, !Boolean(project.isHidden))} disabled={loading} className={project.isHidden ? "bg-[#e30613] hover:bg-[#c80511]" : ""}>{loading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : project.isHidden ? <RefreshCcw className="mr-1 h-3.5 w-3.5" /> : <EyeOff className="mr-1 h-3.5 w-3.5" />}{loading ? "Processando..." : project.isHidden ? "Reativar" : "Ocultar"}</Button></div>) : <EmptyAdmin text={filters.search || filters.status || filters.areaId || filters.owner ? "Nenhum projeto corresponde aos filtros atuais." : scope === "hidden" ? "Nenhum projeto oculto encontrado." : "Nenhum projeto encontrado para este filtro."} />}</CardContent></Card></div></div>;
}'''
text = text[:start] + replacement + text[end:]
path.write_text(text)
PY
python /home/ubuntu/portal-acompanhamento-projetos/scripts/update_admin_exports.py
rm /home/ubuntu/portal-acompanhamento-projetos/scripts/update_admin_exports.py
