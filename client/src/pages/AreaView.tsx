import {
  ArrowRight,
  BarChart3,
  FolderKanban,
  Gauge,
  Loader2,
  Target,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  InstitutionalHeader,
  InstitutionalFooter,
  NavigationBar,
  StatusBadge,
} from "@/components/PortalShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AreaView() {
  const [, params] = useRoute("/area/:id");
  const areaId = Number(params?.id);
  const {
    data: areas,
    isLoading: loadingArea,
    error: areaError,
  } = trpc.dashboard.areas.useQuery(undefined, { retry: false });
  const {
    data: projects,
    isLoading: loadingProjects,
    error: projectsError,
  } = trpc.dashboard.projects.useQuery(
    { areaId },
    { enabled: Number.isFinite(areaId), retry: false }
  );
  const area = areas?.find(item => item.id === areaId);
  if (!Number.isFinite(areaId) || areaError || projectsError)
    return (
      <div className="min-h-screen p-10 text-center">
        <h1 className="text-2xl font-black">
          Não foi possível carregar esta área
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Volte ao painel executivo e tente novamente.
        </p>
        <Link href="/">
          <Button className="mt-6 bg-[#e30613] hover:bg-[#c80511]">
            Voltar ao painel
          </Button>
        </Link>
      </div>
    );
  if (loadingArea || loadingProjects)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#e30613]" />
      </div>
    );
  const rows = projects ?? [];
  const active = rows.filter(
    item => !["concluído", "pausado"].includes(item.status)
  );
  const average = rows.length
    ? Math.round(
        rows.reduce((sum, item) => sum + item.progress, 0) / rows.length
      )
    : 0;
  const statusChart = [
    { name: "Ativos", valor: active.length, fill: "#e30613" },
    {
      name: "Concluídos",
      valor: rows.filter(
        item => item.progress >= 100 || item.status === "concluído"
      ).length,
      fill: "#16a34a",
    },
    {
      name: "Pausados",
      valor: rows.filter(item => item.status === "pausado").length,
      fill: "#737373",
    },
  ];
  const ranking = [...rows]
    .sort((a, b) => b.progress - a.progress)
    .map(item => ({ name: item.code, progresso: item.progress }));
  return (
    <div className="min-h-screen bg-[#080808] text-white institutional-pattern">
      <InstitutionalHeader section={area?.name || "VISÃO DA ÁREA"} />
      <main className="mx-auto max-w-[1500px] px-5 py-10 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#e30613]">
              Nível 1 · Visão da área
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">
              {area?.name || "Área não encontrada"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              {area?.description ||
                "Dashboard geral do setor e dos projetos sob acompanhamento."}
            </p>
          </div>
          <span className="border-l-4 border-[#e30613] pl-4 text-right text-xs font-semibold uppercase tracking-wider text-white/60">
            Painel atualizado
            <br />
            <strong className="text-white">em tempo real</strong>
          </span>
        </div>
        <section className="grid gap-4 sm:grid-cols-3">
          <Kpi
            icon={<FolderKanban />}
            label="Projetos na área"
            value={rows.length}
          />
          <Kpi icon={<Users />} label="Projetos ativos" value={active.length} />
          <Kpi icon={<Gauge />} label="Progresso médio" value={`${average}%`} />
        </section>
        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <Card className="border-black/10 bg-white">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center bg-[#fff0f1] text-[#e30613]">
                  <BarChart3 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e30613]">
                    Composição da área
                  </p>
                  <h2 className="text-xl font-black">Projetos por situação</h2>
                </div>
              </div>
              <div className="h-56">
                {rows.length ? (
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
                        width={76}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value} projeto${value === 1 ? "" : "s"}`,
                          "Quantidade",
                        ]}
                      />
                      <Bar
                        dataKey="valor"
                        radius={[0, 5, 5, 0]}
                        fill="#e30613"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart text="Nenhum projeto cadastrado nesta área." />
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
                    Comparativo interno
                  </p>
                  <h2 className="text-xl font-black">Progresso por projeto</h2>
                </div>
              </div>
              <div className="h-56">
                {ranking.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ranking}
                      margin={{ top: 4, right: 12, bottom: 4, left: -18 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
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
                        fill="#171717"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart text="Nenhum progresso disponível para comparar." />
                )}
              </div>
            </CardContent>
          </Card>
        </section>
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e30613]">
              Carteira da área
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Projetos ativos e históricos
            </h2>
          </div>
          <div className="space-y-3">
            {rows.length ? (
              rows.map(project => (
                <Link key={project.id} href={`/projeto/${project.id}`}>
                  <Card className="group border-black/10 bg-white transition hover:border-[#e30613]/50 hover:shadow-lg">
                    <CardContent className="grid gap-4 p-5 md:grid-cols-[1.5fr_.8fr_.8fr_32px] md:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-bold tracking-widest text-neutral-400">
                            {project.code}
                          </span>
                          <StatusBadge status={project.status} />
                        </div>
                        <h3 className="mt-2 text-lg font-black uppercase">
                          {project.name}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                          {project.summary || "Sem descrição cadastrada."}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Responsável
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {project.owner || "Não informado"}
                        </p>
                      </div>
                      <div>
                        <div className="mb-2 flex justify-between text-xs font-bold">
                          <span>Progresso</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-[#e30613]"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-[#e30613]" />
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="border-dashed border-black/20">
                <CardContent className="py-16 text-center text-sm text-neutral-500">
                  Nenhum projeto foi cadastrado para esta área.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <InstitutionalFooter />
      <NavigationBar
        nextHref={rows[0] ? `/projeto/${rows[0].id}` : "/#carteira"}
        backLabel="Voltar ao painel"
      />
    </div>
  );
}
function Kpi({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="border-black/10 bg-white">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-11 w-11 items-center justify-center bg-[#fff0f1] text-[#e30613]">
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
function EmptyChart({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center px-5 text-center text-sm text-neutral-500">
      {text}
    </div>
  );
}
