import {
  ArrowUpRight,
  BarChart3,
  FileText,
  FolderKanban,
  Gauge,
  Landmark,
  LineChart,
  Loader2,
  Plus,
  Settings2,
  Sparkles,
  Target,
  Truck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  InstitutionalHeader,
  InstitutionalFooter,
  AdminLink,
  NavigationBar,
} from "@/components/PortalShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar, ProgressIndicator } from "@/components/ProgressIndicator";
import {
  filterProjectsByPortfolio,
  filterProjectsBySector,
  type PortfolioFilter,
  type SectorFilter,
} from "@/lib/portfolio";

type SectorOption = {
  code: Exclude<SectorFilter, "all">;
  shortCode: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SECTOR_DEFINITIONS: Array<{
  code: SectorOption["code"];
  fallbackName: string;
  fallbackDescription: string;
  fallbackIcon: string;
}> = [
  {
    code: "DPAT",
    fallbackName: "Divisão de Patrimônio",
    fallbackDescription: "Gestão patrimonial, imobiliária e de almoxarifado.",
    fallbackIcon: "landmark",
  },
  {
    code: "DPGDOC",
    fallbackName: "Departamento de Gestão Documental",
    fallbackDescription: "Gestão, organização e controle documental.",
    fallbackIcon: "file-text",
  },
  {
    code: "DTRAN",
    fallbackName: "Divisão de Transportes",
    fallbackDescription: "Planejamento e acompanhamento de transportes.",
    fallbackIcon: "truck",
  },
  {
    code: "DZEL",
    fallbackName: "Divisão de Zeladoria",
    fallbackDescription: "Ações de zeladoria e manutenção dos espaços.",
    fallbackIcon: "sparkles",
  },
];

const SECTOR_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  landmark: Landmark,
  "file-text": FileText,
  truck: Truck,
  sparkles: Sparkles,
  folder: FolderKanban,
  briefcase: Settings2,
  shield: Target,
  "building-2": Landmark,
  "clipboard-list": FileText,
};

function normalizeSectorValue(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function buildSectorOptions(
  areas: Array<{
    code: string;
    shortCode?: string | null;
    name: string;
    description?: string | null;
    icon?: string | null;
  }>
): SectorOption[] {
  return SECTOR_DEFINITIONS.map(definition => {
    const area = areas.find(
      item =>
        normalizeSectorValue(item.code).startsWith(definition.code) ||
        normalizeSectorValue(item.shortCode) === definition.code
    );
    const Icon =
      SECTOR_ICONS[area?.icon || definition.fallbackIcon] ||
      SECTOR_ICONS.folder;
    return {
      code: definition.code,
      shortCode: area?.shortCode?.trim() || definition.code,
      name: area?.name || definition.fallbackName,
      description: area?.description || definition.fallbackDescription,
      icon: Icon,
    };
  });
}

export default function Home() {
  const { data, isLoading, error } = trpc.dashboard.summary.useQuery();
  const [portfolioFilter, setPortfolioFilter] =
    useState<PortfolioFilter>("all");
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [showCharts, setShowCharts] = useState(false);
  const scrollToSection = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => {
    if (showCharts) scrollToSection("graficos");
  }, [showCharts]);
  const openCharts = () => setShowCharts(true);
  const closeCharts = () => {
    setShowCharts(false);
    scrollToSection("carteira");
  };
  const selectPortfolioFilter = (filter: PortfolioFilter) => {
    setPortfolioFilter(filter);
    setSectorFilter("all");
    scrollToSection("carteira");
  };
  const selectSectorFilter = (sector: SectorFilter) => {
    setSectorFilter(sector);
    setPortfolioFilter("all");
    scrollToSection("carteira");
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#e30613]" />
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center">
        <p className="font-semibold">Não foi possível carregar o painel.</p>
        <p className="mt-2 text-sm text-neutral-500">
          Verifique a conexão com o banco e tente novamente.
        </p>
      </div>
    );

  const totals = data?.totals ?? {
    projects: 0,
    active: 0,
    completed: 0,
    averageProgress: 0,
  };
  const projects = data?.projects ?? [];
  const areaRows = data?.areas ?? [];
  const sectorOptions = buildSectorOptions(areaRows);
  const areaById = new Map(areaRows.map(area => [area.id, area]));
  const projectsWithArea = projects.map(project => ({
    ...project,
    areaCode: areaById.get(project.areaId)?.code,
    areaName: areaById.get(project.areaId)?.name,
  }));
  const sortedProjects = [...projectsWithArea].sort((a, b) =>
    a.code.localeCompare(b.code, undefined, { numeric: true })
  );
  const filteredBySector = filterProjectsBySector(sortedProjects, sectorFilter);
  const filteredProjects = filterProjectsByPortfolio(
    filteredBySector,
    portfolioFilter
  );
  const selectedSector = sectorOptions.find(
    sector => sector.code === sectorFilter
  );
  const areaChart = (data?.areas ?? []).map(area => {
    const areaProjects = projects.filter(project => project.areaId === area.id);
    return {
      name: area.name.length > 18 ? `${area.name.slice(0, 18)}…` : area.name,
      projetos: areaProjects.length,
      progresso: areaProjects.length
        ? Math.round(
            areaProjects.reduce((sum, project) => sum + project.progress, 0) /
              areaProjects.length
          )
        : 0,
    };
  });
  const statusChart = [
    { name: "Em andamento", valor: totals.active, fill: "#e30613" },
    { name: "Concluídos", valor: totals.completed, fill: "#16a34a" },
  ];
  const rankingChart = [...projects]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 6)
    .map(project => ({ name: project.code, progresso: project.progress }));

  return (
    <div className="min-h-screen bg-[#080808] text-white institutional-pattern">
      <section className="relative overflow-hidden bg-[#171717] text-white">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10">
          <InstitutionalHeader section="SU​​COR · SUBSECRETARIA DE GESTÃO CORPORATIVA" />
          <div className="pointer-events-none absolute inset-x-0 top-[78px] z-20 flex justify-end px-6 pt-5 md:px-16">
            <div className="pointer-events-auto">
              <AdminLink />
            </div>
          </div>
          <div className="grid min-h-[330px] items-center gap-10 px-6 py-12 md:grid-cols-[1.2fr_.8fr] md:px-16">
            <div>
              <div className="mb-7 h-2 w-24 bg-[#e30613]" />
              <p className="mb-3 text-xs font-bold uppercase tracking-[.28em] text-[#e30613]">
                Portal executivo
              </p>
              <h1 className="max-w-3xl text-4xl font-black uppercase leading-[.98] tracking-tight md:text-6xl">
                Coordenadoria Geral de Suporte Administrativo (COGESPA)
              </h1>
              <p className="mt-4 text-lg font-bold uppercase tracking-[.12em] text-white/85">
                Portal de acompanhamento de Projetos
              </p>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 md:text-base">
                Visão consolidada da evolução, movimentações, entregas e
                próximos passos das áreas responsáveis.
              </p>
            </div>
            <div className="hidden justify-self-end border-l border-white/20 pl-8 md:block">
              <p className="text-xs uppercase tracking-[.24em] text-white/50">
                Atualização em tempo real
              </p>
              <p className="mt-3 text-5xl font-black text-[#e30613]">
                {totals.averageProgress}%
              </p>
              <p className="text-sm text-white/70">
                progresso médio dos projetos
              </p>
            </div>
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-[1500px] px-5 py-10 md:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#e30613]">
              Visão Geral
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              Painel consolidado.
            </h2>
          </div>
        </div>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricFilterButton
            active={portfolioFilter === "all"}
            onClick={() => selectPortfolioFilter("all")}
            icon={<FolderKanban />}
            label="Projetos cadastrados"
            value={totals.projects}
          />
          <MetricFilterButton
            active={portfolioFilter === "active"}
            onClick={() => selectPortfolioFilter("active")}
            icon={<Gauge />}
            label="Projetos em andamento"
            value={totals.active}
          />
          <MetricFilterButton
            active={portfolioFilter === "completed"}
            onClick={() => selectPortfolioFilter("completed")}
            icon={<BarChart3 />}
            label="Projetos concluídos"
            value={totals.completed}
          />
          <MetricActionButton
            onClick={openCharts}
            icon={<LineChart />}
            label="Gráficos"
            description="Ver dashboards"
          />
        </section>
        {showCharts && (
          <section id="graficos" className="mt-10 scroll-mt-24">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e30613]">
                  Dashboards executivos
                </p>
                <h3 className="mt-1 text-2xl font-black">
                  Gráficos da Visão Geral
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={closeCharts}
                className="border-black/20 text-black"
              >
                Ocultar gráficos
              </Button>
            </div>
            <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
              <Card className="border-black/10 bg-white">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center bg-[#fff0f1] text-[#e30613]">
                      <BarChart3 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e30613]">
                        Status da carteira
                      </p>
                      <h3 className="text-xl font-black">
                        Distribuição dos projetos
                      </h3>
                    </div>
                  </div>
                  <div className="h-56">
                    {statusChart.some(item => item.valor > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={statusChart}
                          layout="vertical"
                          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="#e5e5e5"
                          />
                          <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={92}
                            tick={{ fontSize: 10 }}
                          />
                          <Tooltip
                            formatter={(value: number) => [
                              `${value} projeto${value === 1 ? "" : "s"}`,
                              "Quantidade",
                            ]}
                          />
                          <Bar dataKey="valor" radius={[0, 5, 5, 0]}>
                            {statusChart.map(item => (
                              <Cell key={item.name} fill={item.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart text="Ainda não há projetos suficientes para exibir a distribuição." />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-black/10 bg-white">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center bg-[#fff0f1] text-[#e30613]">
                      <Target className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e30613]">
                        Evolução comparativa
                      </p>
                      <h3 className="text-xl font-black">
                        Progresso médio por área
                      </h3>
                    </div>
                  </div>
                  <div className="h-56">
                    {areaChart.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={areaChart}
                          margin={{ top: 4, right: 12, bottom: 4, left: -20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e5e5"
                          />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9 }}
                            interval={0}
                            angle={-18}
                            textAnchor="end"
                            height={52}
                          />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              name === "progresso" ? `${value}%` : value,
                              name === "progresso"
                                ? "Progresso médio"
                                : "Projetos",
                            ]}
                          />
                          <Bar
                            dataKey="progresso"
                            fill="#171717"
                            radius={[5, 5, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart text="Cadastre áreas e projetos para comparar o progresso." />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Card className="border-black/10 bg-white">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e30613]">
                        Ranking executivo
                      </p>
                      <h3 className="text-xl font-black">
                        Projetos com maior progresso
                      </h3>
                    </div>
                    <span className="text-xs text-neutral-500">
                      Dados cadastrados no portal
                    </span>
                  </div>
                  <div className="h-64">
                    {rankingChart.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={rankingChart}
                          margin={{ top: 4, right: 12, bottom: 4, left: -20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e5e5"
                          />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Tooltip
                            formatter={(value: number) => [
                              `${value}%`,
                              "Progresso",
                            ]}
                          />
                          <Bar
                            dataKey="progresso"
                            fill="#e30613"
                            radius={[5, 5, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart text="Ainda não há projetos para compor o ranking." />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e30613]">
                SETORES
              </p>
              <h3 className="mt-1 text-2xl font-black">
                Áreas e departamentos
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              Selecione um setor para ver seus projetos.
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sectorOptions.map((sector, index) => (
              <SectorButton
                key={sector.code}
                sector={sector}
                index={index}
                active={sectorFilter === sector.code}
                count={
                  filterProjectsBySector(projectsWithArea, sector.code).length
                }
                onClick={() => selectSectorFilter(sector.code)}
              />
            ))}
          </div>
        </section>
        <section id="carteira" className="mt-12 scroll-mt-24">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e30613]">
                Carteira atual
              </p>
              <h3 className="mt-1 text-2xl font-black">
                {selectedSector
                  ? `${selectedSector.shortCode} — ${selectedSector.name}`
                  : portfolioFilter === "all"
                    ? "Todos os projetos"
                    : portfolioFilter === "active"
                      ? "Projetos em andamento"
                      : "Projetos concluídos"}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-black/20"
                onClick={() => selectSectorFilter("all")}
              >
                Limpar setor
              </Button>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden border-black/20 sm:flex"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Gerenciar conteúdo
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.length ? (
              filteredProjects.map(project => {
                const isCompleted =
                  project.progress >= 100 || project.status === "concluído";
                const progress = Math.min(100, Math.max(0, project.progress));
                return (
                  <Link key={project.id} href={`/projeto/${project.id}`}>
                    <Card
                      className={`h-full border-black/10 bg-white transition hover:shadow-lg ${isCompleted ? "border-emerald-500/60 hover:border-emerald-600" : "hover:border-[#e30613]/40"}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs font-bold tracking-widest text-neutral-400">
                            {project.code}
                          </p>
                          <ProgressIndicator
                            progress={progress}
                            isManual={project.isManual}
                            manualObservation={project.manualObservation}
                            className={`shrink-0 text-sm font-black ${isCompleted ? "text-emerald-600" : "text-[#e30613]"}`}
                          />
                        </div>
                        <h4 className="mt-4 text-lg font-black">
                          {project.name}
                        </h4>
                        <p className="mt-3 text-sm font-bold text-neutral-700">
                          Responsável: {project.owner || "A definir"}
                        </p>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-500">
                          {project.summary ||
                            "Resumo do tema ainda não cadastrado."}
                        </p>
                        <div className="mt-5">
                          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                            <span
                              className={
                                isCompleted
                                  ? "text-emerald-600"
                                  : "text-neutral-500"
                              }
                            >
                              {isCompleted ? "Concluído" : "Progresso"}
                            </span>
                            <ProgressIndicator
                              progress={progress}
                              isManual={project.isManual}
                              manualObservation={project.manualObservation}
                              className={
                                isCompleted
                                  ? "text-emerald-600"
                                  : "text-neutral-500"
                              }
                            />
                          </div>
                          <ProgressBar
                            progress={progress}
                            isCompleted={isCompleted}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <EmptyState
                title="Nenhum projeto encontrado"
                text="Não há projetos correspondentes ao filtro selecionado."
              />
            )}
          </div>
        </section>
        <InstitutionalFooter />
      </main>
      <NavigationBar nextHref="#carteira" backLabel="Ir para a carteira" />
    </div>
  );
}

function SectorButton({
  sector,
  index,
  count,
  active,
  onClick,
}: {
  sector: SectorOption;
  index: number;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = sector.icon;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="group block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e30613] focus-visible:ring-offset-2"
    >
      <Card
        className={`h-full border-black/10 bg-white transition-all hover:-translate-y-1 hover:border-[#e30613]/50 hover:shadow-xl ${active ? "ring-2 ring-[#e30613] ring-offset-2" : ""}`}
      >
        <CardContent className="flex h-full items-start gap-4 p-5">
          <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center bg-[#fff0f1] text-[#e30613] transition group-hover:bg-[#e30613] group-hover:text-white">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-black tracking-tight">
                  {sector.shortCode}
                </p>
                <p className="mt-1 text-sm font-bold leading-5 text-neutral-700">
                  {sector.name}
                </p>
              </div>
              <span className="text-2xl font-black text-neutral-200">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-3 text-sm leading-5 text-neutral-500">
              {sector.description}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 text-xs font-bold uppercase tracking-wider">
              <span className={active ? "text-[#e30613]" : "text-neutral-500"}>
                {active ? "Setor selecionado" : "Ver projetos"}
              </span>
              <span className="text-neutral-400">
                {count} projeto{count === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <ArrowUpRight
            className="mt-1 h-5 w-5 shrink-0 text-neutral-300 transition group-hover:text-[#e30613]"
            aria-hidden="true"
          />
        </CardContent>
      </Card>
    </button>
  );
}

function MetricFilterButton({
  icon,
  label,
  value,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e30613] focus-visible:ring-offset-2"
    >
      <MetricCard icon={icon} label={label} value={value} active={active} />
    </button>
  );
}
function MetricActionButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e30613] focus-visible:ring-offset-2"
    >
      <Card className="h-full border-black/10 bg-white transition hover:border-[#e30613]/50 hover:shadow-lg">
        <CardContent className="flex h-full items-center gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fff0f1] text-[#e30613]">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="text-lg font-black">{label}</p>
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {description}
            </p>
          </div>
          <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-neutral-300 transition group-hover:text-[#e30613]" />
        </CardContent>
      </Card>
    </button>
  );
}
function MetricCard({
  icon,
  label,
  value,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <Card
      className={`h-full border-black/10 bg-white transition ${active ? "ring-2 ring-[#e30613] ring-offset-2" : "hover:border-[#e30613]/50"}`}
    >
      <CardContent className="flex h-full items-center gap-4 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fff0f1] text-[#e30613]">
          {icon}
        </span>
        <div>
          <p className="text-3xl font-black">{value}</p>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card className="border-dashed border-black/20 bg-white md:col-span-2 xl:col-span-4">
      <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <Settings2 className="h-8 w-8 text-[#e30613]" />
        <h4 className="mt-4 font-black">{title}</h4>
        <p className="mt-2 max-w-md text-sm text-neutral-500">{text}</p>
        <Link href="/admin" className="mt-5">
          <Button className="bg-[#e30613] hover:bg-[#c80511]">
            Abrir back-office
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
function EmptyChart({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center px-5 text-center text-sm text-neutral-500">
      {text}
    </div>
  );
}
