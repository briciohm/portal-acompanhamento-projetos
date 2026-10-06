import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Download,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  LockKeyhole,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  ScrollText,
  ShieldCheck,
  Upload,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toCsv } from "@/lib/adminTools";
import { nextProjectCode } from "@shared/projectCode";
import {
  assignableProfiles,
  canAccessGovernance,
  profileOfUser,
  USER_PROFILES,
  USER_PROFILE_DESCRIPTIONS,
  USER_PROFILE_LABELS,
  USER_PROFILE_PERMISSION_MATRIX,
  type UserProfile,
} from "@shared/userRoles";
import {
  ADVANCED_SETTING_DEFINITIONS,
  ADVANCED_SETTING_KEYS,
  type AdvancedSettingKey,
} from "@shared/advancedSettings";
import { diagnosticAlertKey } from "@/lib/diagnostic";
import {
  InstitutionalHeader,
  InstitutionalFooter,
  NavigationBar,
} from "@/components/PortalShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Admin() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#e30613]" />
      </div>
    );
  if (!user) return <AccessGate />;
  const profile = profileOfUser(user);
  if (!user.isActive || !USER_PROFILES.includes(profile))
    return (
      <AccessGate
        message="Seu usuário não possui um perfil ativo para acessar o back-office."
        canLogin={false}
      />
    );
  return <AdminContent />;
}

function AdminContent() {
  const { user: currentUser } = useAuth();
  const currentProfile = currentUser ? profileOfUser(currentUser) : "consulta";
  const hasGovernanceAccess = canAccessGovernance(currentProfile);
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState("cadastro");
  const isProjectTabActive = ["projeto", "evidencias", "documentos"].includes(
    activeTab
  );
  const isGovernanceTabActive = activeTab === "governanca";
  const isUsersTabActive = activeTab === "usuarios";
  const {
    data: areas,
    isLoading: areasLoading,
    error: areasError,
  } = trpc.admin.areas.useQuery(undefined, { retry: false });
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = trpc.admin.projects.useQuery({ includeHidden: true }, { retry: false });
  const [selectedProject, setSelectedProject] = useState("");
  const project = useMemo(
    () => projects?.find(item => String(item.id) === selectedProject),
    [projects, selectedProject]
  );
  const projectDetailQuery = trpc.admin.project.useQuery(
    { id: Number(selectedProject) },
    {
      enabled: Boolean(selectedProject) && isProjectTabActive,
      retry: false,
    }
  );
  const [historyProjectFilter, setHistoryProjectFilter] = useState("");
  const [historyUserFilter, setHistoryUserFilter] = useState("");
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const [diagnosticTypeFilter, setDiagnosticTypeFilter] = useState("");
  const [diagnosticRouteFilter, setDiagnosticRouteFilter] = useState("");
  const diagnosticEventsQuery = trpc.admin.diagnosticEvents.useQuery(
    {
      limit: 200,
      type: diagnosticTypeFilter || undefined,
      route: diagnosticRouteFilter || undefined,
    },
    {
      enabled: hasGovernanceAccess && isGovernanceTabActive,
      retry: false,
    }
  );
  const diagnosticAlertsQuery = trpc.admin.diagnosticAlerts.useQuery(
    { days: 7, threshold: 3 },
    { enabled: hasGovernanceAccess && isGovernanceTabActive, retry: false }
  );
  const filteredHistoryQuery = trpc.admin.stageHistoryFiltered.useQuery(
    {
      projectId: historyProjectFilter
        ? Number(historyProjectFilter)
        : undefined,
      changedBy: historyUserFilter ? Number(historyUserFilter) : undefined,
      from: historyFrom ? new Date(`${historyFrom}T00:00:00`) : undefined,
      to: historyTo ? new Date(`${historyTo}T23:59:59`) : undefined,
      limit: 500,
    },
    { enabled: hasGovernanceAccess && isGovernanceTabActive, retry: false }
  );
  const managedUsersQuery = trpc.admin.users.useQuery(undefined, {
    enabled:
      currentProfile !== "consulta" &&
      (isUsersTabActive || isGovernanceTabActive),
    retry: false,
  });
  const [auditActorFilter, setAuditActorFilter] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("");
  const [auditFrom, setAuditFrom] = useState("");
  const [auditTo, setAuditTo] = useState("");
  const profileAuditInput = useMemo(
    () => ({
      actorUserId: auditActorFilter ? Number(auditActorFilter) : undefined,
      action: auditActionFilter
        ? (auditActionFilter as "create" | "update" | "blocked")
        : undefined,
      from: auditFrom ? new Date(`${auditFrom}T00:00:00`) : undefined,
      to: auditTo ? new Date(`${auditTo}T23:59:59`) : undefined,
    }),
    [auditActorFilter, auditActionFilter, auditFrom, auditTo]
  );
  const profileAuditQuery = trpc.admin.profileAudit.useQuery(
    profileAuditInput,
    { enabled: hasGovernanceAccess && isGovernanceTabActive, retry: false }
  );
  const authAuditQuery = trpc.admin.authAudit.useQuery(undefined, {
    enabled: hasGovernanceAccess && isGovernanceTabActive,
    retry: false,
  });
  const createArea = trpc.admin.createArea.useMutation({
    onSuccess: () => {
      toast.success("Área cadastrada.");
      utils.dashboard.summary.invalidate();
      utils.dashboard.areas.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const createProject = trpc.admin.createProject.useMutation({
    onSuccess: () => {
      toast.success("Projeto cadastrado.");
      utils.dashboard.summary.invalidate();
      utils.dashboard.projects.invalidate();
      utils.admin.projects.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const updateProject = trpc.admin.updateProject.useMutation({
    onSuccess: () => {
      toast.success("Projeto atualizado.");
      utils.dashboard.summary.invalidate();
      utils.dashboard.projects.invalidate();
      utils.admin.projects.invalidate();
      if (selectedProject)
        utils.admin.project.invalidate({ id: Number(selectedProject) });
    },
    onError: e => toast.error(e.message),
  });
  const updateArea = trpc.admin.updateArea.useMutation({
    onSuccess: () => {
      toast.success("Área atualizada.");
      utils.dashboard.summary.invalidate();
      utils.dashboard.areas.invalidate();
      utils.admin.areas.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const toggleAreaVisibility = trpc.admin.toggleAreaVisibility.useMutation({
    onSuccess: result => {
      toast.success(result?.isHidden ? "Área ocultada." : "Área reativada.");
      utils.dashboard.summary.invalidate();
      utils.dashboard.areas.invalidate();
      utils.admin.areas.invalidate();
      utils.admin.projects.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const toggleProjectVisibility =
    trpc.admin.toggleProjectVisibility.useMutation({
      onSuccess: result => {
        toast.success(
          result?.isHidden ? "Projeto ocultado." : "Projeto reativado."
        );
        utils.dashboard.summary.invalidate();
        utils.dashboard.areas.invalidate();
        utils.dashboard.projects.invalidate();
        utils.dashboard.project.invalidate();
        utils.admin.projects.invalidate();
        utils.admin.project.invalidate();
      },
      onError: e => toast.error(e.message),
    });
  const createMetric = trpc.admin.createMetric.useMutation({
    onSuccess: () => {
      toast.success("KPI registrado.");
      utils.dashboard.project.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const createStage = trpc.admin.createStage.useMutation({
    onSuccess: () => {
      toast.success("Etapa adicionada.");
      utils.dashboard.project.invalidate();
      utils.dashboard.summary.invalidate();
      utils.dashboard.projects.invalidate();
      utils.admin.projects.invalidate();
      if (selectedProject)
        utils.admin.project.invalidate({ id: Number(selectedProject) });
    },
    onError: e => toast.error(e.message),
  });
  const updateStage = trpc.admin.updateStage.useMutation({
    onSuccess: () => {
      toast.success("Status da etapa atualizado.");
      utils.dashboard.project.invalidate();
      utils.dashboard.stageHistory.invalidate();
      utils.dashboard.summary.invalidate();
      utils.dashboard.projects.invalidate();
      utils.admin.projects.invalidate();
      if (selectedProject)
        utils.admin.project.invalidate({ id: Number(selectedProject) });
    },
    onError: e => toast.error(e.message),
  });
  const createMilestone = trpc.admin.createMilestone.useMutation({
    onSuccess: () => {
      toast.success("Marco adicionado.");
      utils.dashboard.project.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const uploadPhoto = trpc.admin.uploadPhoto.useMutation({
    onSuccess: () => {
      toast.success("Foto enviada.");
      utils.dashboard.project.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const uploadDocument = trpc.admin.uploadDocument.useMutation({
    onSuccess: () => {
      toast.success("Documento/material enviado.");
      utils.dashboard.project.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const createUser = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário adicionado.");
      utils.admin.users.invalidate();
      utils.admin.profileAudit.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const updateUser = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Permissões atualizadas.");
      utils.admin.users.invalidate();
      utils.admin.profileAudit.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const advancedSettingsQuery = trpc.admin.advancedSettings.useQuery(
    undefined,
    {
      enabled: currentProfile === "admin_master" && activeTab === "avancado",
      retry: false,
    }
  );
  const advancedSettingsAuditQuery = trpc.admin.advancedSettingsAudit.useQuery(
    undefined,
    {
      enabled: currentProfile === "admin_master" && activeTab === "avancado",
      retry: false,
    }
  );
  const governanceError = [
    diagnosticEventsQuery.error,
    diagnosticAlertsQuery.error,
    filteredHistoryQuery.error,
    profileAuditQuery.error,
    authAuditQuery.error,
  ].find(Boolean);
  const retryGovernance = () => {
    void Promise.all([
      diagnosticEventsQuery.refetch(),
      diagnosticAlertsQuery.refetch(),
      filteredHistoryQuery.refetch(),
      profileAuditQuery.refetch(),
      authAuditQuery.refetch(),
    ]);
  };
  const updateAdvancedSetting = trpc.admin.updateAdvancedSetting.useMutation({
    onSuccess: () => {
      toast.success("Configuração crítica atualizada e auditada.");
      utils.admin.advancedSettings.invalidate();
      utils.admin.advancedSettingsAudit.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  if (areasLoading || projectsLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#e30613]" />
      </div>
    );
  if (areasError || projectsError)
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-2xl font-black">
          Não foi possível carregar o back-office
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Atualize a página ou verifique a conexão com o banco.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 bg-[#e30613] hover:bg-[#c80511]"
        >
          Tentar novamente
        </Button>
      </div>
    );
  return (
    <div className="admin-shell min-h-screen bg-[#080808] text-white">
      <Toaster position="top-right" richColors />
      <InstitutionalHeader section="BACK-OFFICE" />
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-5 md:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#e30613]">
              Gestão autônoma
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
              Back-office editorial.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              Atualize o conteúdo que alimenta o portal executivo sem alterar o
              código da aplicação.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">Ver portal executivo</Button>
          </Link>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <span id="cadastro" className="sr-only">
            Cadastro
          </span>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,.12)] lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)]">
            <div className="min-w-0">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/45">
                Operação do conteúdo
              </p>
              <TabsList className="admin-nav grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-3 lg:flex lg:flex-wrap">
                <TabsTrigger value="cadastro">
                  <Plus className="h-4 w-4" />
                  <span>Cadastro</span>
                </TabsTrigger>
                <TabsTrigger value="visibilidade">
                  <Eye className="h-4 w-4" />
                  <span>Visibilidade</span>
                </TabsTrigger>
                <TabsTrigger value="projeto">
                  <Pencil className="h-4 w-4" />
                  <span>Atualizar projeto</span>
                </TabsTrigger>
                <TabsTrigger value="evidencias">
                  <Upload className="h-4 w-4" />
                  <span>Evidências</span>
                </TabsTrigger>
                <TabsTrigger value="documentos">
                  <ScrollText className="h-4 w-4" />
                  <span>Documentos e materiais</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="min-w-0 lg:border-l lg:border-white/10 lg:pl-3">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/45">
                Governança e acesso
              </p>
              <TabsList className="admin-nav grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-3">
                {hasGovernanceAccess && (
                  <TabsTrigger value="governanca">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Governança</span>
                  </TabsTrigger>
                )}
                {currentProfile === "admin_master" && (
                  <TabsTrigger value="avancado">
                    <LockKeyhole className="h-4 w-4" />
                    <span>Avançado</span>
                  </TabsTrigger>
                )}
                {currentProfile !== "consulta" && (
                  <TabsTrigger value="usuarios">
                    <UserPlus className="h-4 w-4" />
                    <span>Usuários</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
          </div>
          <TabsContent value="cadastro" className="grid gap-4 lg:grid-cols-2">
            <AreaForm
              onSubmit={input => createArea.mutate(input)}
              loading={createArea.isPending}
            />
            <ProjectForm
              areas={areas ?? []}
              projects={projects ?? []}
              onSubmit={input => createProject.mutate(input)}
              loading={createProject.isPending}
            />
          </TabsContent>
          <TabsContent value="visibilidade">
            <VisibilityManagement
              areas={areas ?? []}
              projects={projects ?? []}
              onToggleArea={(id: number, isHidden: boolean) =>
                toggleAreaVisibility.mutate({ id, isHidden })
              }
              onToggleProject={(id: number, isHidden: boolean) =>
                toggleProjectVisibility.mutate({ id, isHidden })
              }
              onUpdateArea={(id: number, data: AreaUpdate) =>
                updateArea.mutate({ id, data })
              }
              loading={
                toggleAreaVisibility.isPending ||
                toggleProjectVisibility.isPending ||
                updateArea.isPending
              }
            />
          </TabsContent>
          <TabsContent value="projeto">
            <div className="mb-5 max-w-xl">
              <Label>Selecione o projeto</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className="mt-2 bg-white">
                  <SelectValue placeholder="Escolha um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map(item => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.code} · {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {projectDetailQuery.error ? (
              <QueryErrorNotice
                error={projectDetailQuery.error}
                onRetry={() => void projectDetailQuery.refetch()}
              />
            ) : project ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <UpdateForm
                  key={project.id}
                  project={project}
                  onSubmit={data =>
                    updateProject.mutate({ id: project.id, data })
                  }
                  loading={updateProject.isPending}
                />
                <div className="space-y-4">
                  <MetricForm
                    projectId={project.id}
                    onSubmit={input => createMetric.mutate(input)}
                    loading={createMetric.isPending}
                  />
                  <StageStatusForm
                    stages={projectDetailQuery.data?.stages ?? []}
                    onUpdate={(id, progressStatus) =>
                      updateStage.mutate({ id, data: { progressStatus } })
                    }
                    loading={updateStage.isPending}
                  />
                  <StageHistoryCard
                    history={projectDetailQuery.data?.statusHistory ?? []}
                  />
                  <StageForm
                    projectId={project.id}
                    onSubmit={input => createStage.mutate(input)}
                    loading={createStage.isPending}
                  />
                  <MilestoneForm
                    projectId={project.id}
                    onSubmit={input => createMilestone.mutate(input)}
                    loading={createMilestone.isPending}
                  />
                </div>
              </div>
            ) : (
              <EmptyAdmin text="Selecione um projeto para editar seu status e adicionar informações de acompanhamento." />
            )}
          </TabsContent>
          <TabsContent value="evidencias">
            <div className="max-w-2xl">
              {project ? (
                <PhotoForm
                  projectId={project.id}
                  onSubmit={input => uploadPhoto.mutate(input)}
                  loading={uploadPhoto.isPending}
                />
              ) : (
                <EmptyAdmin text="Selecione um projeto na aba Atualizar projeto para enviar fotos." />
              )}
            </div>
          </TabsContent>
          <TabsContent value="documentos">
            <div className="max-w-2xl">
              {project ? (
                <DocumentForm
                  projectId={project.id}
                  onSubmit={input => uploadDocument.mutate(input)}
                  loading={uploadDocument.isPending}
                />
              ) : (
                <EmptyAdmin text="Selecione um projeto na aba Atualizar projeto para enviar documentos e materiais." />
              )}
            </div>
          </TabsContent>
          {hasGovernanceAccess && (
            <TabsContent value="governanca">
              {governanceError ? (
                <QueryErrorNotice
                  error={governanceError}
                  onRetry={retryGovernance}
                />
              ) : null}
              <GovernancePanel
                history={filteredHistoryQuery.data ?? []}
                profileAudit={profileAuditQuery.data ?? []}
                authAudit={authAuditQuery.data ?? []}
                diagnosticEvents={diagnosticEventsQuery.data ?? []}
                diagnosticAlerts={diagnosticAlertsQuery.data ?? []}
                diagnosticLoading={diagnosticEventsQuery.isLoading}
                projects={projects ?? []}
                users={managedUsersQuery.data ?? []}
                historyFilters={{
                  project: historyProjectFilter,
                  user: historyUserFilter,
                  from: historyFrom,
                  to: historyTo,
                }}
                setHistoryFilter={(key, value) => {
                  if (key === "project") setHistoryProjectFilter(value);
                  if (key === "user") setHistoryUserFilter(value);
                  if (key === "from") setHistoryFrom(value);
                  if (key === "to") setHistoryTo(value);
                }}
                diagnosticFilters={{
                  type: diagnosticTypeFilter,
                  route: diagnosticRouteFilter,
                }}
                setDiagnosticFilter={(key, value) => {
                  if (key === "type") setDiagnosticTypeFilter(value);
                  if (key === "route") setDiagnosticRouteFilter(value);
                }}
                auditFilters={{
                  actor: auditActorFilter,
                  action: auditActionFilter,
                  from: auditFrom,
                  to: auditTo,
                }}
                setAuditFilter={(key, value) => {
                  if (key === "actor") setAuditActorFilter(value);
                  if (key === "action") setAuditActionFilter(value);
                  if (key === "from") setAuditFrom(value);
                  if (key === "to") setAuditTo(value);
                }}
              />
            </TabsContent>
          )}
          {currentProfile === "admin_master" && (
            <TabsContent value="avancado">
              {advancedSettingsQuery.error ||
              advancedSettingsAuditQuery.error ? (
                <QueryErrorNotice
                  error={
                    advancedSettingsQuery.error ||
                    advancedSettingsAuditQuery.error
                  }
                  onRetry={() => {
                    void Promise.all([
                      advancedSettingsQuery.refetch(),
                      advancedSettingsAuditQuery.refetch(),
                    ]);
                  }}
                />
              ) : null}
              <AdvancedSettingsPanel
                settings={advancedSettingsQuery.data ?? []}
                audit={advancedSettingsAuditQuery.data ?? []}
                loading={
                  advancedSettingsQuery.isLoading ||
                  updateAdvancedSetting.isPending
                }
                onUpdate={(key, value, reason) =>
                  updateAdvancedSetting.mutate({ key, value, reason })
                }
              />
            </TabsContent>
          )}
          {currentProfile !== "consulta" && (
            <TabsContent value="usuarios">
              {managedUsersQuery.error ? (
                <QueryErrorNotice
                  error={managedUsersQuery.error}
                  onRetry={() => void managedUsersQuery.refetch()}
                />
              ) : null}
              <UserManagement
                actorProfile={currentProfile}
                users={managedUsersQuery.data ?? []}
                areas={areas ?? []}
                onCreate={(input: {
                  openId: string;
                  name: string;
                  email: string;
                  profile: UserProfile;
                  areaIds: number[];
                }) => createUser.mutate(input)}
                onUpdate={(
                  id: number,
                  data: {
                    profile?: UserProfile;
                    areaIds?: number[];
                    isActive?: boolean;
                  }
                ) => updateUser.mutate({ id, ...data })}
                loading={createUser.isPending || updateUser.isPending}
              />
            </TabsContent>
          )}
        </Tabs>
        <InstitutionalFooter subtitle="Gestão autônoma de conteúdo e evidências." />
      </main>
      <NavigationBar
        backHref="/"
        nextHref="#cadastro"
        backLabel="Voltar ao portal"
      />
    </div>
  );
}

type AdminArea = {
  id: number;
  name: string;
  code: string;
  shortCode?: string | null;
  icon?: string | null;
  description?: string | null;
  isHidden?: boolean | null;
};
type AdminProject = {
  id: number;
  areaId: number;
  code: string;
  name: string;
  status: string;
  progress: number;
  isHidden?: boolean | null;
};
type AreaUpdate = {
  name?: string;
  code?: string;
  shortCode?: string;
  icon?: string;
  description?: string;
  accent?: string;
};

const statusLabel = (value: number) =>
  value === 2 ? "Concluída" : value === 1 ? "Em andamento" : "Em branco";
const downloadCsv = (rows: Record<string, unknown>[], filename: string) => {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const ICON_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "landmark", label: "Edifício / patrimônio" },
  { value: "file-text", label: "Documento" },
  { value: "truck", label: "Transportes" },
  { value: "sparkles", label: "Zeladoria" },
  { value: "folder", label: "Pasta" },
  { value: "briefcase", label: "Gestão" },
  { value: "shield", label: "Proteção" },
  { value: "building-2", label: "Unidade administrativa" },
  { value: "clipboard-list", label: "Controle" },
];

function VisibilityManagement({
  areas,
  projects,
  onToggleArea,
  onToggleProject,
  onUpdateArea,
  loading,
}: {
  areas: AdminArea[];
  projects: AdminProject[];
  onToggleArea: (id: number, isHidden: boolean) => void;
  onToggleProject: (id: number, isHidden: boolean) => void;
  onUpdateArea: (id: number, data: AreaUpdate) => void;
  loading: boolean;
}) {
  const [scope, setScope] = useState<"all" | "active" | "hidden">("all");
  const [editingAreaId, setEditingAreaId] = useState<number | null>(null);
  const matchesScope = (isHidden: boolean | null | undefined) =>
    scope === "all" || (scope === "hidden" ? Boolean(isHidden) : !isHidden);
  const filteredAreas = areas.filter(area => matchesScope(area.isHidden));
  const filteredProjects = projects.filter(project =>
    matchesScope(project.isHidden)
  );
  const areaNames = new Map(areas.map(area => [area.id, area.name]));
  return (
    <div className="space-y-4">
      <Card className="border-[#e30613]/20 bg-[#fffafa]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black">
            <Eye className="h-5 w-5 text-[#e30613]" />
            Visibilidade do portal
          </CardTitle>
          <p className="text-sm leading-6 text-neutral-600">
            Ocultar não exclui registros. Projetos e áreas ocultos deixam de
            aparecer no portal público, mas continuam disponíveis aqui para
            edição e reativação.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={scope === "all" ? "default" : "outline"}
              onClick={() => setScope("all")}
              className={scope === "all" ? "bg-[#171717]" : ""}
            >
              Todos ({areas.length + projects.length})
            </Button>
            <Button
              size="sm"
              variant={scope === "active" ? "default" : "outline"}
              onClick={() => setScope("active")}
              className={scope === "active" ? "bg-[#171717]" : ""}
            >
              Visíveis (
              {areas.filter(area => !area.isHidden).length +
                projects.filter(project => !project.isHidden).length}
              )
            </Button>
            <Button
              size="sm"
              variant={scope === "hidden" ? "default" : "outline"}
              onClick={() => setScope("hidden")}
              className={
                scope === "hidden" ? "bg-[#e30613] hover:bg-[#c80511]" : ""
              }
            >
              Ocultos (
              {areas.filter(area => area.isHidden).length +
                projects.filter(project => project.isHidden).length}
              )
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-black">Áreas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredAreas.length ? (
              filteredAreas.map(area => (
                <div
                  key={area.id}
                  className="border-b border-neutral-100 pb-4 last:border-0"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black">{area.name}</p>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${area.isHidden ? "bg-[#fff0f1] text-[#a0040d]" : "bg-emerald-50 text-emerald-700"}`}
                        >
                          {area.isHidden ? "Oculta" : "Visível"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {area.code} ·{" "}
                        {
                          projects.filter(project => project.areaId === area.id)
                            .length
                        }{" "}
                        projeto(s)
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditingAreaId(
                            editingAreaId === area.id ? null : area.id
                          )
                        }
                        disabled={loading}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={area.isHidden ? "default" : "outline"}
                        onClick={() =>
                          onToggleArea(area.id, !Boolean(area.isHidden))
                        }
                        disabled={loading}
                        className={
                          area.isHidden ? "bg-[#e30613] hover:bg-[#c80511]" : ""
                        }
                      >
                        {area.isHidden ? (
                          <RefreshCcw className="mr-1 h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="mr-1 h-3.5 w-3.5" />
                        )}
                        {area.isHidden ? "Reativar" : "Ocultar"}
                      </Button>
                    </div>
                  </div>
                  {editingAreaId === area.id ? (
                    <AreaEditForm
                      key={area.id}
                      area={area}
                      onSubmit={data => onUpdateArea(area.id, data)}
                      onCancel={() => setEditingAreaId(null)}
                      loading={loading}
                    />
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyAdmin
                text={
                  scope === "hidden"
                    ? "Nenhuma área oculta encontrada."
                    : "Nenhuma área encontrada para este filtro."
                }
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-black">Projetos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredProjects.length ? (
              filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-4 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black">{project.name}</p>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${project.isHidden ? "bg-[#fff0f1] text-[#a0040d]" : "bg-emerald-50 text-emerald-700"}`}
                      >
                        {project.isHidden ? "Oculto" : "Visível"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      {project.code} ·{" "}
                      {areaNames.get(project.areaId) || "Área não encontrada"} ·{" "}
                      {project.progress}%
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={project.isHidden ? "default" : "outline"}
                    onClick={() =>
                      onToggleProject(project.id, !Boolean(project.isHidden))
                    }
                    disabled={loading}
                    className={
                      project.isHidden ? "bg-[#e30613] hover:bg-[#c80511]" : ""
                    }
                  >
                    {project.isHidden ? (
                      <RefreshCcw className="mr-1 h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="mr-1 h-3.5 w-3.5" />
                    )}
                    {project.isHidden ? "Reativar" : "Ocultar"}
                  </Button>
                </div>
              ))
            ) : (
              <EmptyAdmin
                text={
                  scope === "hidden"
                    ? "Nenhum projeto oculto encontrado."
                    : "Nenhum projeto encontrado para este filtro."
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AreaEditForm({
  area,
  onSubmit,
  onCancel,
  loading,
}: {
  area: AdminArea;
  onSubmit: (data: AreaUpdate) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState(area.name);
  const [code, setCode] = useState(area.code);
  const [shortCode, setShortCode] = useState(area.shortCode || "");
  const [icon, setIcon] = useState(area.icon || "folder");
  const [description, setDescription] = useState(area.description || "");
  return (
    <div className="mt-4 space-y-3 rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <Field label="Nome exibido">
        <Input value={name} onChange={e => setName(e.target.value)} />
      </Field>
      <Field label="Sigla exibida">
        <Input
          value={shortCode}
          onChange={e => setShortCode(e.target.value)}
          placeholder="Ex.: DPAT"
        />
      </Field>
      <Field label="Código técnico">
        <Input value={code} onChange={e => setCode(e.target.value)} />
      </Field>
      <Field label="Ícone do setor">
        <Select value={icon} onValueChange={setIcon}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ICON_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Descrição">
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          className="bg-[#171717]"
          disabled={
            loading || !name.trim() || !code.trim() || !shortCode.trim()
          }
          onClick={() =>
            onSubmit({
              name: name.trim(),
              code: code.trim(),
              shortCode: shortCode.trim().toUpperCase(),
              icon,
              description: description.trim(),
            })
          }
        >
          <Save className="mr-1 h-3.5 w-3.5" />
          Salvar setor
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}

function AreaForm({
  onSubmit,
  loading,
}: {
  onSubmit: (input: {
    name: string;
    code: string;
    shortCode?: string;
    icon?: string;
    description?: string;
  }) => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [icon, setIcon] = useState("folder");
  const [description, setDescription] = useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black">
          <Plus className="h-5 w-5 text-[#e30613]" />
          Nova área
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Nome">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex.: Patrimônio Imobiliário"
          />
        </Field>
        <Field label="Sigla exibida">
          <Input
            value={shortCode}
            onChange={e => setShortCode(e.target.value)}
            placeholder="Ex.: DPAT"
          />
        </Field>
        <Field label="Código técnico">
          <Input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Ex.: PAT-IMOB"
          />
        </Field>
        <Field label="Ícone do setor">
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ICON_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Descrição">
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descrição curta da área"
          />
        </Field>
        <Button
          disabled={loading || !name || !code || !shortCode}
          onClick={() =>
            onSubmit({
              name,
              code,
              shortCode: shortCode.toUpperCase(),
              icon,
              description,
            })
          }
          className="bg-[#e30613] hover:bg-[#c80511]"
        >
          Cadastrar área
        </Button>
      </CardContent>
    </Card>
  );
}
function ProjectForm({
  areas,
  projects,
  onSubmit,
  loading,
}: {
  areas: Array<{
    id: number;
    name: string;
    code: string;
    shortCode?: string | null;
  }>;
  projects: Array<{ areaId: number; code: string }>;
  onSubmit: (input: {
    areaId: number;
    name: string;
    summary?: string;
    owner?: string;
  }) => void;
  loading: boolean;
}) {
  const [areaId, setAreaId] = useState("");
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [owner, setOwner] = useState("");
  const selectedArea = areas.find(area => String(area.id) === areaId);
  const suggestedCode = selectedArea
    ? nextProjectCode(
        selectedArea.shortCode || selectedArea.code,
        projects
          .filter(project => project.areaId === selectedArea.id)
          .map(project => project.code)
      )
    : "";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black">
          <Plus className="h-5 w-5 text-[#e30613]" />
          Novo projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Área">
          <Select value={areaId} onValueChange={setAreaId}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha a área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map(area => (
                <SelectItem key={area.id} value={String(area.id)}>
                  {area.shortCode ? `${area.shortCode} — ` : ""}
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Nome">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome do projeto"
          />
        </Field>
        <Field label="Código automático">
          <Input
            value={suggestedCode}
            readOnly
            placeholder="Selecione um setor"
            className="bg-neutral-100 font-bold tracking-wide"
          />
          <p className="text-xs text-neutral-500">
            O sistema definirá este código automaticamente ao cadastrar o
            projeto.
          </p>
        </Field>
        <Field label="Resumo">
          <Textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
          />
        </Field>
        <Field label="Responsável">
          <Input value={owner} onChange={e => setOwner(e.target.value)} />
        </Field>
        <Button
          disabled={loading || !areaId || !name}
          onClick={() =>
            onSubmit({ areaId: Number(areaId), name, summary, owner })
          }
          className="bg-[#e30613] hover:bg-[#c80511]"
        >
          Cadastrar projeto
        </Button>
      </CardContent>
    </Card>
  );
}
function UpdateForm({
  project,
  onSubmit,
  loading,
}: {
  project: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const [name, setName] = useState(project.name);
  const [summary, setSummary] = useState(project.summary || "");
  const [status, setStatus] = useState(project.status);
  const [progress, setProgress] = useState(String(project.progress));
  const [owner, setOwner] = useState(project.owner || "");
  const [nextSteps, setNextSteps] = useState(project.nextSteps || "");
  const [isManual, setIsManual] = useState(Boolean(project.isManual));
  const [manualObservation, setManualObservation] = useState(
    project.manualObservation || ""
  );
  const numericProgress = Number(progress);
  const manualInvalid =
    isManual &&
    (!manualObservation.trim() ||
      !Number.isFinite(numericProgress) ||
      numericProgress < 0 ||
      numericProgress > 100);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black">
          <Save className="h-5 w-5 text-[#e30613]" />
          Atualização executiva
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Nome do projeto">
          <Input value={name} onChange={e => setName(e.target.value)} />
        </Field>
        <Field label="Resumo executivo">
          <Textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
          />
        </Field>
        <Field label="Status">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "estruturação",
                "andamento",
                "execução",
                "concluído",
                "pausado",
              ].map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Modo de progresso">
          <Select
            value={isManual ? "manual" : "automatico"}
            onValueChange={value => setIsManual(value === "manual")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatico">
                Usar cálculo automático pelas etapas
              </SelectItem>
              <SelectItem value="manual">
                Inserir porcentagem manualmente
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {isManual ? (
          <>
            <Field label="Progresso manual (%)">
              <Input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={e => setProgress(e.target.value)}
              />
            </Field>
            <Field label="Observação">
              <Textarea
                required
                value={manualObservation}
                onChange={e => setManualObservation(e.target.value)}
                placeholder="Justifique a inserção manual do progresso"
              />
              <p className="text-xs text-[#a0040d]">
                A observação é obrigatória quando o modo manual está ativo.
              </p>
            </Field>
          </>
        ) : (
          <p className="rounded-md bg-[#fff0f1] p-3 text-xs leading-5 text-[#4f1b1e]">
            O progresso será calculado pela média das etapas: Em branco (0%), Em
            andamento (50%) e Concluído (100%).
          </p>
        )}
        <Field label="Responsável">
          <Input value={owner} onChange={e => setOwner(e.target.value)} />
        </Field>
        <Field label="Próximos passos">
          <Textarea
            rows={6}
            value={nextSteps}
            onChange={e => setNextSteps(e.target.value)}
          />
        </Field>
        <Button
          disabled={loading || manualInvalid}
          onClick={() =>
            onSubmit({
              name,
              summary,
              status,
              progress: numericProgress,
              isManual,
              manualObservation: isManual ? manualObservation : undefined,
              owner,
              nextSteps,
            })
          }
          className="bg-[#e30613] hover:bg-[#c80511]"
        >
          Salvar atualização
        </Button>
      </CardContent>
    </Card>
  );
}
function MetricForm({
  projectId,
  onSubmit,
  loading,
}: {
  projectId: number;
  onSubmit: (input: any) => void;
  loading: boolean;
}) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [target, setTarget] = useState("");
  const numericValue = Number(value);
  const numericTarget = target ? Number(target) : undefined;
  const invalidNumber =
    !Number.isFinite(numericValue) ||
    (numericTarget !== undefined && !Number.isFinite(numericTarget));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-black">Registrar KPI</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Indicador"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Valor"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Meta"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <Button
          className="bg-[#171717] sm:col-span-3"
          disabled={loading || !label.trim() || !value.trim() || invalidNumber}
          onClick={() =>
            onSubmit({
              projectId,
              label,
              value: numericValue,
              target: numericTarget,
            })
          }
        >
          Adicionar KPI
        </Button>
      </CardContent>
    </Card>
  );
}
function StageStatusForm({
  stages,
  onUpdate,
  loading,
}: {
  stages: any[];
  onUpdate: (id: number, progressStatus: number) => void;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-black">
          Cronograma de etapas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.length ? (
          stages.map(stage => (
            <div
              key={stage.id}
              className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{stage.title}</p>
                <p className="text-xs text-neutral-500">
                  Peso:{" "}
                  {stage.progressStatus === 2
                    ? "100%"
                    : stage.progressStatus === 1
                      ? "50%"
                      : "0%"}
                </p>
              </div>
              <Select
                value={String(stage.progressStatus ?? 0)}
                onValueChange={value => onUpdate(stage.id, Number(value))}
              >
                <SelectTrigger className="w-44" disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Em branco (0%)</SelectItem>
                  <SelectItem value="1">Em andamento (50%)</SelectItem>
                  <SelectItem value="2">Concluído (100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">
            Cadastre etapas para habilitar o cálculo automático.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
function StageHistoryCard({ history }: { history: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-black">
          Histórico de status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length ? (
          history.map(item => (
            <div
              key={item.id}
              className="border-b border-neutral-100 pb-3 text-xs last:border-0"
            >
              <p className="font-bold">
                Etapa #{item.stageId}: {statusLabel(item.previousStatus)} →{" "}
                {statusLabel(item.nextStatus)}
              </p>
              <p className="mt-1 text-neutral-500">
                {new Date(item.changedAt).toLocaleString()} · Usuário #
                {item.changedBy ?? "sistema"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">
            Nenhuma alteração de status registrada para este projeto.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
function HistoryTools({
  history,
  projects,
  users,
  projectFilter,
  userFilter,
  from,
  to,
  setProjectFilter,
  setUserFilter,
  setFrom,
  setTo,
}: {
  history: any[];
  projects: any[];
  users: any[];
  projectFilter: string;
  userFilter: string;
  from: string;
  to: string;
  setProjectFilter: (value: string) => void;
  setUserFilter: (value: string) => void;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
}) {
  const exportHistory = () =>
    downloadCsv(
      history.map(item => ({
        id: item.id,
        projectId: item.projectId,
        stageId: item.stageId,
        previousStatus: item.previousStatus,
        nextStatus: item.nextStatus,
        changedBy: item.changedBy,
        changedAt: item.changedAt,
      })),
      "historico-status.csv"
    );
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black">
              Histórico de alterações
            </CardTitle>
            <p className="mt-1 text-xs text-neutral-500">
              Filtre por projeto, usuário e período para auditoria operacional.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={exportHistory}
            disabled={!history.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-4">
          <Select
            value={projectFilter || "todos"}
            onValueChange={value =>
              setProjectFilter(value === "todos" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os projetos</SelectItem>
              {projects.map(item => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.code} · {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={userFilter || "todos"}
            onValueChange={value =>
              setUserFilter(value === "todos" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os usuários</SelectItem>
              {users.map(item => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name || item.email || `Usuário #${item.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            aria-label="Data inicial"
          />
          <Input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            aria-label="Data final"
          />
        </div>
        <div className="max-h-[480px] overflow-auto rounded-md border border-neutral-200">
          {history.length ? (
            history.map(item => (
              <div
                key={item.id}
                className="border-b border-neutral-100 p-3 text-xs last:border-0"
              >
                <p className="font-bold">
                  Projeto #{item.projectId} · Etapa #{item.stageId}:{" "}
                  {statusLabel(item.previousStatus)} →{" "}
                  {statusLabel(item.nextStatus)}
                </p>
                <p className="mt-1 text-neutral-500">
                  {new Date(item.changedAt).toLocaleString()} · usuário #
                  {item.changedBy ?? "sistema"}
                </p>
              </div>
            ))
          ) : (
            <p className="p-6 text-sm text-neutral-500">
              Nenhuma alteração encontrada para os filtros selecionados.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
function DiagnosticPanel({
  events,
  alerts,
  loading,
  typeFilter,
  routeFilter,
  setTypeFilter,
  setRouteFilter,
}: {
  events: any[];
  alerts: any[];
  loading: boolean;
  typeFilter: string;
  routeFilter: string;
  setTypeFilter: (value: string) => void;
  setRouteFilter: (value: string) => void;
}) {
  const exportDiagnostics = () =>
    downloadCsv(
      events.map(event => ({
        id: event.id,
        type: event.type,
        message: event.message,
        route: event.route,
        context: event.context,
        createdAt: event.createdAt,
      })),
      "diagnostico-client.csv"
    );
  return (
    <div className="space-y-4">
      <Card className="border-[#e30613]/30">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-black">
                <AlertTriangle className="h-5 w-5 text-[#e30613]" />
                Diagnóstico de erros reais
              </CardTitle>
              <p className="mt-1 text-xs text-neutral-500">
                Avisos recorrentes são agrupados para priorizar investigação.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={exportDiagnostics}
              disabled={!events.length}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              placeholder="Filtrar por tipo"
            />
            <Input
              value={routeFilter}
              onChange={e => setRouteFilter(e.target.value)}
              placeholder="Filtrar por rota"
            />
          </div>
          {alerts.length ? (
            <div className="rounded-md border border-[#e30613]/30 bg-[#fff5f5] p-3 text-xs text-[#6d1117]">
              <p className="font-bold">Alertas recorrentes</p>
              {alerts.map(alert => (
                <p key={diagnosticAlertKey(alert)} className="mt-1">
                  {alert.count} ocorrências de {alert.type}
                  {alert.route ? ` em ${alert.route}` : ""} — último registro{" "}
                  {new Date(alert.lastSeen).toLocaleString()}.
                </p>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <ShieldCheck className="mr-1 inline h-4 w-4" />
              Nenhum alerta recorrente no período analisado.
            </div>
          )}
          {loading ? (
            <p className="text-sm text-neutral-500">Carregando eventos...</p>
          ) : events.length ? (
            events.map(event => (
              <div
                key={event.id}
                className="border-b border-neutral-100 pb-3 text-xs last:border-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold uppercase text-[#a0040d]">
                    {event.type}
                  </span>
                  <span className="text-neutral-500">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 break-words font-medium">{event.message}</p>
                {event.route && (
                  <p className="mt-1 text-neutral-500">Rota: {event.route}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">
              Nenhum erro real registrado.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function AdvancedSettingsPanel({
  settings,
  audit,
  loading,
  onUpdate,
}: {
  settings: Array<{ key: string; value: boolean }>;
  audit: Array<{
    id: number;
    settingKey: string;
    previousValue: string | null;
    newValue: string;
    reason: string | null;
    createdAt: Date;
    actor?: { name: string | null; email: string | null } | null;
  }>;
  loading: boolean;
  onUpdate: (key: AdvancedSettingKey, value: boolean, reason: string) => void;
}) {
  const [values, setValues] = useState<Record<AdvancedSettingKey, boolean>>(
    () =>
      Object.fromEntries(
        ADVANCED_SETTING_KEYS.map(key => [
          key,
          ADVANCED_SETTING_DEFINITIONS[key].defaultValue,
        ])
      ) as Record<AdvancedSettingKey, boolean>
  );
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (settings.length)
      setValues(current => ({
        ...current,
        ...Object.fromEntries(
          settings
            .filter(item =>
              ADVANCED_SETTING_KEYS.includes(item.key as AdvancedSettingKey)
            )
            .map(item => [item.key, item.value])
        ),
      }));
  }, [settings]);
  const submit = (key: AdvancedSettingKey) => {
    if (reason.trim().length < 10) {
      toast.error("Informe uma justificativa com pelo menos 10 caracteres.");
      return;
    }
    onUpdate(key, values[key], reason.trim());
    setReason("");
  };
  return (
    <div className="space-y-4">
      <Card className="border-[#e30613]/40 bg-white text-neutral-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black">
            <LockKeyhole className="h-5 w-5 text-[#e30613]" />
            Configurações avançadas do Administrador Master
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Área exclusiva para recursos críticos. Toda alteração exige
            justificativa e gera registro de auditoria.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-[#e30613]/25 bg-[#fff7f7] p-4 text-sm text-[#6d1117]">
            <strong>Atenção:</strong> estas opções podem alterar o comportamento
            global do portal. Faça uma alteração por vez e valide o efeito antes
            de prosseguir.
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ADVANCED_SETTING_KEYS.map(key => {
              const definition = ADVANCED_SETTING_DEFINITIONS[key];
              return (
                <div
                  key={key}
                  className="rounded-md border border-neutral-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{definition.label}</p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        {definition.description}
                      </p>
                    </div>
                    <label className="flex shrink-0 items-center gap-2 text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={values[key]}
                        onChange={event =>
                          setValues(current => ({
                            ...current,
                            [key]: event.target.checked,
                          }))
                        }
                        disabled={loading}
                      />
                      {values[key] ? "Ativo" : "Inativo"}
                    </label>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider ${definition.risk === "alto" ? "text-[#e30613]" : "text-amber-700"}`}
                    >
                      Risco {definition.risk}
                    </span>
                    <Button
                      size="sm"
                      className="bg-[#171717]"
                      onClick={() => submit(key)}
                      disabled={loading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvar alteração
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Field label="Justificativa obrigatória">
            <Textarea
              value={reason}
              onChange={event => setReason(event.target.value)}
              placeholder="Descreva o motivo operacional e o efeito esperado da alteração."
              rows={3}
            />
          </Field>
        </CardContent>
      </Card>
      <Card className="bg-white text-neutral-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black">
            <ScrollText className="h-5 w-5 text-[#e30613]" />
            Histórico das configurações críticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audit.length ? (
            <div className="space-y-3">
              {audit.map(item => (
                <div
                  key={item.id}
                  className="border-b border-neutral-100 pb-3 text-xs last:border-0"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <strong>
                      {ADVANCED_SETTING_DEFINITIONS[
                        item.settingKey as AdvancedSettingKey
                      ]?.label ?? item.settingKey}
                    </strong>
                    <span className="text-neutral-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">
                    {item.previousValue ?? "padrão"} → {item.newValue}
                  </p>
                  <p className="mt-1 text-neutral-500">
                    Por {item.actor?.name || item.actor?.email || "usuário"}.
                    Motivo: {item.reason || "não informado"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              Nenhuma alteração registrada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GovernancePanel({
  history,
  profileAudit,
  authAudit,
  diagnosticEvents,
  diagnosticAlerts,
  diagnosticLoading,
  projects,
  users,
  historyFilters,
  setHistoryFilter,
  diagnosticFilters,
  setDiagnosticFilter,
  auditFilters,
  setAuditFilter,
}: {
  history: any[];
  profileAudit: any[];
  authAudit: any[];
  diagnosticEvents: any[];
  diagnosticAlerts: any[];
  diagnosticLoading: boolean;
  projects: AdminProject[];
  users: any[];
  historyFilters: { project: string; user: string; from: string; to: string };
  setHistoryFilter: (
    key: "project" | "user" | "from" | "to",
    value: string
  ) => void;
  diagnosticFilters: { type: string; route: string };
  setDiagnosticFilter: (key: "type" | "route", value: string) => void;
  auditFilters: { actor: string; action: string; from: string; to: string };
  setAuditFilter: (
    key: "actor" | "action" | "from" | "to",
    value: string
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#e30613]/25 bg-[#fffafa] p-5 text-neutral-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e30613]">
              Acesso restrito
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Governança e conformidade
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Auditoria de perfis, histórico operacional e diagnóstico de erros
              reais reunidos em um único espaço para o Administrador Geral.
            </p>
          </div>
          <ShieldCheck className="h-8 w-8 text-[#e30613]" />
        </div>
      </div>
      <Tabs defaultValue="auditoria" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-1 bg-white sm:grid-cols-4">
          <TabsTrigger value="auditoria">
            <ScrollText className="mr-2 h-4 w-4" />
            Auditoria de perfis
          </TabsTrigger>
          <TabsTrigger value="historico">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Histórico de alterações
          </TabsTrigger>
          <TabsTrigger value="diagnostico">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Diagnóstico de erros reais
          </TabsTrigger>
          <TabsTrigger value="acessos">
            <UserRound className="mr-2 h-4 w-4" />
            Acessos ao sistema
          </TabsTrigger>
        </TabsList>
        <TabsContent value="auditoria">
          <ProfileAuditContent
            logs={profileAudit}
            users={users}
            filters={auditFilters}
            setFilter={setAuditFilter}
          />
        </TabsContent>
        <TabsContent value="historico">
          <HistoryTools
            history={history}
            projects={projects}
            users={users}
            projectFilter={historyFilters.project}
            userFilter={historyFilters.user}
            from={historyFilters.from}
            to={historyFilters.to}
            setProjectFilter={value => setHistoryFilter("project", value)}
            setUserFilter={value => setHistoryFilter("user", value)}
            setFrom={value => setHistoryFilter("from", value)}
            setTo={value => setHistoryFilter("to", value)}
          />
        </TabsContent>
        <TabsContent value="diagnostico">
          <DiagnosticPanel
            events={diagnosticEvents}
            alerts={diagnosticAlerts}
            loading={diagnosticLoading}
            typeFilter={diagnosticFilters.type}
            routeFilter={diagnosticFilters.route}
            setTypeFilter={value => setDiagnosticFilter("type", value)}
            setRouteFilter={value => setDiagnosticFilter("route", value)}
          />
        </TabsContent>
        <TabsContent value="acessos">
          <AuthAuditContent logs={authAudit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuthAuditContent({ logs }: { logs: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-black">
          <UserRound className="h-5 w-5 text-[#e30613]" />
          Acessos ao sistema
        </CardTitle>
        <p className="text-sm text-neutral-500">
          Registro dos eventos de login e logout realizados pelos usuários.
        </p>
      </CardHeader>
      <CardContent>
        {logs.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-[.12em] text-neutral-500">
                <tr>
                  <th className="px-3 py-3">Evento</th>
                  <th className="px-3 py-3">Usuário</th>
                  <th className="px-3 py-3">Perfil</th>
                  <th className="px-3 py-3">Método</th>
                  <th className="px-3 py-3">Data e hora</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[.1em] ${
                          log.event === "login"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {log.event === "login" ? "Login" : "Logout"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold">
                        {log.userName || "Sem nome"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {log.email || "E-mail não informado"}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-neutral-600">
                      {log.profile
                        ? (USER_PROFILE_LABELS[log.profile as UserProfile] ??
                          log.profile)
                        : "—"}
                    </td>
                    <td className="px-3 py-3 text-neutral-600">
                      {log.loginMethod || "—"}
                    </td>
                    <td className="px-3 py-3 text-neutral-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyAdmin text="Nenhum login ou logout foi registrado ainda." />
        )}
      </CardContent>
    </Card>
  );
}

function ProfileAuditContent({
  logs,
  users,
  filters,
  setFilter,
}: {
  logs: any[];
  users: any[];
  filters: { actor: string; action: string; from: string; to: string };
  setFilter: (key: "actor" | "action" | "from" | "to", value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <ScrollText className="h-5 w-5 text-[#e30613]" />
              Auditoria de perfis
            </CardTitle>
            <p className="text-sm text-neutral-500">
              Criações, alterações e tentativas bloqueadas por autor, ação e
              período.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              ["actor", "action", "from", "to"].forEach(key =>
                setFilter(key as "actor" | "action" | "from" | "to", "")
              )
            }
          >
            <RefreshCcw className="mr-2 h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Select
            value={filters.actor || "todos"}
            onValueChange={value =>
              setFilter("actor", value === "todos" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Autor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os autores</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name || user.email || `Usuário #${user.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.action || "todas"}
            onValueChange={value =>
              setFilter("action", value === "todas" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as ações</SelectItem>
              <SelectItem value="create">Perfil criado</SelectItem>
              <SelectItem value="update">Perfil alterado</SelectItem>
              <SelectItem value="blocked">Tentativa bloqueada</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filters.from}
            onChange={e => setFilter("from", e.target.value)}
            aria-label="Data inicial da auditoria"
          />
          <Input
            type="date"
            value={filters.to}
            onChange={e => setFilter("to", e.target.value)}
            aria-label="Data final da auditoria"
          />
        </div>
        <div className="max-h-[420px] space-y-3 overflow-auto">
          {logs.length ? (
            logs.map(log => (
              <div
                key={log.id}
                className={`border-b pb-3 text-xs last:border-0 ${log.action === "blocked" ? "border-[#e30613]/30 bg-[#fff5f5] p-3" : "border-neutral-100"}`}
              >
                <p className="font-bold">
                  {log.action === "create"
                    ? "Perfil criado"
                    : log.action === "update"
                      ? "Perfil alterado"
                      : "Tentativa bloqueada"}
                  {log.newProfile
                    ? `: ${USER_PROFILE_LABELS[log.newProfile as UserProfile] || log.newProfile}`
                    : ""}
                </p>
                <p className="mt-1 text-neutral-500">
                  Alvo:{" "}
                  {log.target?.name ||
                    log.target?.email ||
                    (log.targetUserId
                      ? `Usuário #${log.targetUserId}`
                      : "não informado")}{" "}
                  · por{" "}
                  {log.actor?.name ||
                    log.actor?.email ||
                    `Usuário #${log.actorUserId}`}
                </p>
                {log.reason ? (
                  <p className="mt-1 text-[#a0040d]">Motivo: {log.reason}</p>
                ) : null}
                <p className="mt-1 text-neutral-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">
              Nenhum evento encontrado para os filtros selecionados.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UserManagement({
  users,
  areas,
  actorProfile,
  onCreate,
  onUpdate,
  loading,
}: {
  users: any[];
  areas: AdminArea[];
  actorProfile: UserProfile;
  onCreate: (input: {
    openId: string;
    name: string;
    email: string;
    profile: UserProfile;
    areaIds: number[];
  }) => void;
  onUpdate: (
    id: number,
    data: { profile?: UserProfile; areaIds?: number[]; isActive?: boolean }
  ) => void;
  loading: boolean;
}) {
  const [openId, setOpenId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<UserProfile>("consulta");
  const [areaIds, setAreaIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingProfile, setEditingProfile] = useState<UserProfile>("consulta");
  const [editingAreaIds, setEditingAreaIds] = useState<number[]>([]);
  const toggleArea = (
    setter: (updater: (current: number[]) => number[]) => void,
    id: number
  ) =>
    setter(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  const profileOptions = assignableProfiles(actorProfile).map(value => ({
    value,
    label: USER_PROFILE_LABELS[value],
    description: USER_PROFILE_DESCRIPTIONS[value],
  }));
  const permissionMatrix = USER_PROFILE_PERMISSION_MATRIX;
  const firstAssignableProfile = profileOptions[0]?.value ?? "consulta";
  return (
    <div className="space-y-4">
      <Card className="border-[#e30613]/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black">
            <ShieldCheck className="h-5 w-5 text-[#e30613]" />
            Matriz de permissões
          </CardTitle>
          <p className="text-sm text-neutral-500">
            As opções de atribuição abaixo respeitam o seu perfil atual:{" "}
            <strong>{USER_PROFILE_LABELS[actorProfile]}</strong>.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-neutral-200">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-neutral-100 uppercase tracking-wide text-neutral-600">
                <tr>
                  <th className="px-3 py-3">Perfil</th>
                  <th className="px-3 py-3">Acesso</th>
                  <th className="px-3 py-3">Pode criar</th>
                  <th className="px-3 py-3">Abrangência</th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map(item => (
                  <tr
                    key={item.profile}
                    className="border-t border-neutral-100"
                  >
                    <td className="px-3 py-3 font-bold">
                      {USER_PROFILE_LABELS[item.profile]}
                    </td>
                    <td className="px-3 py-3">{item.access}</td>
                    <td className="px-3 py-3">{item.canCreate}</td>
                    <td className="px-3 py-3">{item.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <UserPlus className="h-5 w-5 text-[#e30613]" />
              Adicionar usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Open ID">
              <Input
                value={openId}
                onChange={e => setOpenId(e.target.value)}
                placeholder="Identificador OAuth"
              />
            </Field>
            <Field label="Nome">
              <Input value={name} onChange={e => setName(e.target.value)} />
            </Field>
            <Field label="E-mail">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Perfil">
              <Select
                value={profile}
                onValueChange={value => setProfile(value as UserProfile)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {profileOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-neutral-500">
                {USER_PROFILE_DESCRIPTIONS[profile]}
              </p>
            </Field>
            {profile === "gestor_setor" && (
              <Field label="Setores vinculados">
                <div className="grid gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                  {areas.map(area => (
                    <label
                      key={area.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={areaIds.includes(area.id)}
                        onChange={() => toggleArea(setAreaIds, area.id)}
                      />
                      {area.shortCode ? `${area.shortCode} — ` : ""}
                      {area.name}
                    </label>
                  ))}
                </div>
              </Field>
            )}
            <Button
              disabled={
                loading || !openId || !name || !email || !profileOptions.length
              }
              onClick={() =>
                onCreate({ openId, name, email, profile, areaIds })
              }
              className="bg-[#e30613] hover:bg-[#c80511]"
            >
              Cadastrar usuário
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <ShieldCheck className="h-5 w-5 text-[#e30613]" />
              Usuários cadastrados
            </CardTitle>
            <p className="text-sm text-neutral-500">
              Gestores de Setor visualizam somente usuários com vínculo em seus
              setores.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.length ? (
              users.map(user => {
                const currentProfile = (user.profile ||
                  (user.role === "admin"
                    ? "admin_geral"
                    : "consulta")) as UserProfile;
                const isEditing = editingId === user.id;
                return (
                  <div
                    key={user.id}
                    className="rounded-md border border-neutral-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{user.name || "Sem nome"}</p>
                        <p className="text-xs text-neutral-500">
                          {user.email} · {USER_PROFILE_LABELS[currentProfile]}
                        </p>
                        {user.areaIds?.length ? (
                          <p className="mt-1 text-xs text-neutral-500">
                            Setores:{" "}
                            {user.areaIds
                              .map(
                                (id: number) =>
                                  areas.find(area => area.id === id)
                                    ?.shortCode || `#${id}`
                              )
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(isEditing ? null : user.id);
                            setEditingProfile(currentProfile);
                            setEditingAreaIds(user.areaIds || []);
                          }}
                          disabled={loading}
                        >
                          {isEditing ? "Cancelar" : "Editar perfil"}
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            user.isActive === false ? "default" : "outline"
                          }
                          onClick={() =>
                            onUpdate(user.id, {
                              isActive: user.isActive === false,
                            })
                          }
                          disabled={loading}
                        >
                          {user.isActive === false ? "Ativar" : "Desativar"}
                        </Button>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
                        <Field label="Perfil">
                          <Select
                            value={editingProfile}
                            onValueChange={value =>
                              setEditingProfile(value as UserProfile)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {profileOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        {editingProfile === "gestor_setor" && (
                          <Field label="Setores vinculados">
                            <div className="grid gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                              {areas.map(area => (
                                <label
                                  key={area.id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={editingAreaIds.includes(area.id)}
                                    onChange={() =>
                                      toggleArea(setEditingAreaIds, area.id)
                                    }
                                  />
                                  {area.shortCode ? `${area.shortCode} — ` : ""}
                                  {area.name}
                                </label>
                              ))}
                            </div>
                          </Field>
                        )}
                        <Button
                          size="sm"
                          className="bg-[#171717]"
                          disabled={loading}
                          onClick={() => {
                            onUpdate(user.id, {
                              profile: editingProfile,
                              areaIds: editingAreaIds,
                            });
                            setEditingId(null);
                          }}
                        >
                          Salvar perfil
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-neutral-500">
                Nenhum usuário encontrado nos setores permitidos.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StageForm({
  projectId,
  onSubmit,
  loading,
}: {
  projectId: number;
  onSubmit: (input: any) => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-black">Adicionar etapa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Título da etapa"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <Button
          className="bg-[#171717]"
          disabled={loading || !title}
          onClick={() =>
            onSubmit({ projectId, title, description, progressStatus: 0 })
          }
        >
          Adicionar etapa
        </Button>
      </CardContent>
    </Card>
  );
}
function MilestoneForm({
  projectId,
  onSubmit,
  loading,
}: {
  projectId: number;
  onSubmit: (input: any) => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-black">Adicionar marco</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Título do marco"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <Button
          className="bg-[#171717]"
          disabled={loading || !title || !date}
          onClick={() =>
            onSubmit({
              projectId,
              title,
              milestoneDate: new Date(`${date}T12:00:00`),
            })
          }
        >
          Adicionar marco
        </Button>
      </CardContent>
    </Card>
  );
}
function DocumentForm({
  projectId,
  onSubmit,
  loading,
}: {
  projectId: number;
  onSubmit: (input: {
    projectId: number;
    fileName: string;
    mimeType: string;
    data: string;
    title: string;
    category?: string;
    sizeBytes: number;
  }) => void;
  loading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const maxBytes = 20 * 1024 * 1024;
  const send = () => {
    if (!file || !title.trim() || file.size > maxBytes) return;
    const reader = new FileReader();
    reader.onload = () =>
      onSubmit({
        projectId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        data: String(reader.result),
        title: title.trim(),
        category: category.trim() || undefined,
        sizeBytes: file.size,
      });
    reader.onerror = () =>
      toast.error("Não foi possível ler o arquivo selecionado.");
    reader.readAsDataURL(file);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black">
          <Upload className="h-5 w-5 text-[#e30613]" />
          Documentos e materiais do projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-neutral-600">
          Inclua planos de ação, manuais, relatórios, planilhas ou outros
          materiais relevantes do projeto.
        </p>
        <Field label="Arquivo">
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.webp,.zip"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </Field>
        <Field label="Título do material">
          <Input
            value={title}
            maxLength={200}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex.: Plano de Ação 2026"
          />
        </Field>
        <Field label="Categoria">
          <Input
            value={category}
            maxLength={80}
            onChange={e => setCategory(e.target.value)}
            placeholder="Ex.: Plano de ação, manual, relatório"
          />
        </Field>
        {file ? (
          <p
            className={`text-xs ${file.size > maxBytes ? "text-[#a0040d]" : "text-neutral-500"}`}
          >
            {file.name} · {(file.size / 1024).toFixed(1)} KB
            {file.size > maxBytes ? " · limite máximo de 20 MB excedido" : ""}
          </p>
        ) : null}
        <Button
          disabled={
            loading ||
            !file ||
            !title.trim() ||
            Boolean(file && file.size > maxBytes)
          }
          onClick={send}
          className="bg-[#e30613] hover:bg-[#c80511]"
        >
          Enviar documento/material
        </Button>
      </CardContent>
    </Card>
  );
}
function PhotoForm({
  projectId,
  onSubmit,
  loading,
}: {
  projectId: number;
  onSubmit: (input: any) => void;
  loading: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const send = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      onSubmit({
        projectId,
        fileName: file.name,
        mimeType: file.type,
        data: String(reader.result),
        title,
        description,
      });
    reader.onerror = () =>
      toast.error("Não foi possível ler a imagem selecionada.");
    reader.readAsDataURL(file);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-black">
          <Upload className="h-5 w-5 text-[#e30613]" />
          Enviar evidência fotográfica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Arquivo de imagem">
          <Input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </Field>
        <Field label="Título">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex.: Inventário físico"
          />
        </Field>
        <Field label="Descrição">
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </Field>
        <Button
          disabled={loading || !file}
          onClick={send}
          className="bg-[#e30613] hover:bg-[#c80511]"
        >
          Enviar foto
        </Button>
      </CardContent>
    </Card>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function EmptyAdmin({ text }: { text: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-16 text-center text-sm text-neutral-500">
        {text}
      </CardContent>
    </Card>
  );
}
function QueryErrorNotice({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const message = error instanceof Error ? error.message : "Erro inesperado";
  return (
    <Card className="mb-4 border-[#e30613]/30 bg-[#fffafa]">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-start gap-3 text-sm text-[#6d1117]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#e30613]" />
          <div>
            <p className="font-bold">Não foi possível carregar esta função.</p>
            <p className="mt-1 break-words text-xs text-neutral-600">
              {message}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="shrink-0"
        >
          <RefreshCcw className="mr-2 h-3.5 w-3.5" />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}
function AccessGate({
  message = "A área de gestão exige autenticação de administrador.",
  canLogin = true,
}: {
  message?: string;
  canLogin?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#171717] text-white">
      <InstitutionalHeader section="BACK-OFFICE" />
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-28 text-center">
        <LockKeyhole className="h-12 w-12 text-[#e30613]" />
        <h1 className="mt-6 text-3xl font-black">Acesso restrito</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">{message}</p>
        {canLogin ? (
          <Link href="/login">
            <Button className="mt-8 bg-[#e30613] hover:bg-[#c80511]">
              Entrar no sistema
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button className="mt-8 bg-[#e30613] hover:bg-[#c80511]">
              Voltar ao portal
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
