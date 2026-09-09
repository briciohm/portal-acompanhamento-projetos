import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { areas, projectMetrics, projectMilestones, projectPhotos, projectStages, projects } from "../drizzle/schema";
import { assertUserCanManageArea, assertUserCanManageProject, assertUserCanManageStage, createArea, createClientDiagnosticEvent, createDocument, createManagedUser, createMetric, createMilestone, createPhoto, createProject, createStage, getAdvancedSettingValue, getExecutiveSummary, getManagedUserProfile, getProjectDetail, getRecurringDiagnosticAlerts, getUserAreaIds, listAdvancedSettings, listAdvancedSettingsAudit, listAreas, listClientDiagnosticEvents, listFilteredClientDiagnosticEvents, listFilteredStageStatusHistory, listProjects, listStageStatusHistory, listUserProfileAuditLogs, listUsers, recordUserProfileAudit, setAreaHidden, setProjectHidden, updateAdvancedSetting, updateArea, updateManagedUser, updateProject, updateStage } from "./db";
import { canAssignProfile, profileOfUser, type UserProfile } from "../shared/userRoles";
import { ADVANCED_SETTING_KEYS } from "../shared/advancedSettings";

const profileOf = (user: { role: string; profile?: UserProfile | null; email?: string | null }) => profileOfUser(user);
const backOfficeProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.isActive === false || !["admin_master", "admin_geral", "gestor_setor", "editor_projetos", "consulta"].includes(profileOf(ctx.user))) throw new TRPCError({ code: "FORBIDDEN", message: "Perfil inativo ou não autorizado." });
  return next({ ctx: { ...ctx, profile: profileOf(ctx.user) } });
});
const adminProcedure = backOfficeProcedure.use(({ ctx, next }) => {
  if (!["admin_master", "admin_geral"].includes(ctx.profile)) throw new TRPCError({ code: "FORBIDDEN", message: "Esta ação exige um perfil administrativo." });
  return next();
});
const masterProcedure = backOfficeProcedure.use(({ ctx, next }) => {
  if (ctx.profile !== "admin_master") throw new TRPCError({ code: "FORBIDDEN", message: "Esta ação exige o Administrador Master." });
  return next();
});
async function assertAdvancedFeature(key: "allow_project_edits" | "allow_user_management", message: string) {
  const enabled = await getAdvancedSettingValue(key);
  if (!enabled) throw new TRPCError({ code: "FORBIDDEN", message });
  const maintenance = await getAdvancedSettingValue("maintenance_mode");
  if (maintenance) throw new TRPCError({ code: "FORBIDDEN", message: "O portal está em modo de manutenção. Tente novamente após a liberação do Administrador Master." });
}
const editorProcedure = backOfficeProcedure.use(({ ctx, next }) => {
  if (ctx.profile === "consulta") throw new TRPCError({ code: "FORBIDDEN", message: "O perfil Consulta possui acesso somente leitura." });
  return next();
});

async function recordBlockedProfileAttempt(input: { actorUserId: number; targetUserId?: number | null; requestedProfile?: UserProfile | null; reason: string }) {
  try {
    await recordUserProfileAudit({ actorUserId: input.actorUserId, targetUserId: input.targetUserId, action: "blocked", newProfile: input.requestedProfile ?? null, reason: input.reason });
  } catch (error) {
    console.warn("[Audit] Falha ao registrar tentativa bloqueada:", error);
  }
}

const statusSchema = z.enum(["estruturação", "andamento", "execução", "concluído", "pausado"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
    dashboard: router({
    summary: publicProcedure.query(() => getExecutiveSummary()),
    areas: publicProcedure.query(() => listAreas()),
    projects: publicProcedure.input(z.object({ areaId: z.number().optional() }).optional()).query(({ input }) => listProjects(input?.areaId)),
    project: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getProjectDetail(input.id)),
    stageHistory: publicProcedure.input(z.object({ projectId: z.number() })).query(({ input }) => listStageStatusHistory(input.projectId)),
    reportClientDiagnostic: publicProcedure.input(z.object({ type: z.string().min(1).max(64), message: z.string().min(1).max(4000), route: z.string().max(240).optional(), context: z.string().max(4000).optional() })).mutation(async ({ input }) => { if (!(await getAdvancedSettingValue("diagnostic_collection"))) return { ignored: true }; await createClientDiagnosticEvent(input); return { ignored: false }; }),
  }),
  admin: router({
    areas: backOfficeProcedure.query(() => listAreas(true)),
    projects: backOfficeProcedure.input(z.object({ areaId: z.number().optional(), includeHidden: z.boolean().default(true) }).optional()).query(({ input }) => listProjects(input?.areaId, input?.includeHidden ?? true)),
    toggleAreaVisibility: adminProcedure.input(z.object({ id: z.number(), isHidden: z.boolean() })).mutation(({ input }) => setAreaHidden(input.id, input.isHidden)),
    toggleProjectVisibility: adminProcedure.input(z.object({ id: z.number(), isHidden: z.boolean() })).mutation(({ input }) => setProjectHidden(input.id, input.isHidden)),
    updateArea: adminProcedure.input(z.object({ id: z.number(), data: z.object({ name: z.string().min(2).optional(), code: z.string().min(2).optional(), shortCode: z.string().min(1).max(32).optional(), icon: z.string().min(1).max(32).optional(), description: z.string().optional(), accent: z.string().optional() }) })).mutation(({ input }) => updateArea(input.id, input.data)),
    project: backOfficeProcedure.input(z.object({ id: z.number() })).query(({ input }) => getProjectDetail(input.id, true)),
    createArea: adminProcedure.input(z.object({ name: z.string().min(2), code: z.string().min(2), shortCode: z.string().min(1).max(32).optional(), icon: z.string().min(1).max(32).optional(), description: z.string().optional(), accent: z.string().optional() })).mutation(({ input }) => createArea(input)),
    createProject: editorProcedure.input(z.object({ areaId: z.number(), name: z.string().min(2), summary: z.string().optional(), status: statusSchema.optional(), owner: z.string().optional(), progress: z.number().min(0).max(100).optional(), nextSteps: z.string().optional(), startDate: z.date().optional(), targetDate: z.date().optional() })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageArea(ctx.user.id, ctx.profile, input.areaId); return createProject(input); }),
    updateProject: editorProcedure.input(z.object({ id: z.number(), data: z.object({ name: z.string().min(2).optional(), summary: z.string().optional(), status: statusSchema.optional(), owner: z.string().optional(), progress: z.number().min(0).max(100).optional(), isManual: z.boolean().optional(), manualObservation: z.string().optional(), nextSteps: z.string().optional(), startDate: z.date().optional(), targetDate: z.date().optional() }).superRefine((data, ctx) => { if (data.isManual === true && !data.manualObservation?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["manualObservation"], message: "A observação é obrigatória para o progresso manual." }); }) })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageProject(ctx.user.id, ctx.profile, input.id); return updateProject(input.id, input.data); }),
    createMetric: editorProcedure.input(z.object({ projectId: z.number(), label: z.string().min(2), value: z.number(), unit: z.string().optional(), target: z.number().optional(), recordedAt: z.date().optional() })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageProject(ctx.user.id, ctx.profile, input.projectId); return createMetric({ ...input, value: String(input.value), target: input.target === undefined ? undefined : String(input.target) }); }),
    createStage: editorProcedure.input(z.object({ projectId: z.number(), title: z.string().min(2), description: z.string().optional(), status: z.enum(["pendente", "em andamento", "concluída"]).optional(), progressStatus: z.number().int().min(0).max(2).optional(), orderIndex: z.number().optional(), dueDate: z.date().optional() })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageProject(ctx.user.id, ctx.profile, input.projectId); return createStage(input); }),
    updateStage: editorProcedure.input(z.object({ id: z.number(), data: z.object({ status: z.enum(["pendente", "em andamento", "concluída"]).optional(), progressStatus: z.number().int().min(0).max(2).optional(), title: z.string().min(2).optional(), description: z.string().optional(), orderIndex: z.number().optional(), dueDate: z.date().optional() }) })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageStage(ctx.user.id, ctx.profile, input.id); return updateStage(input.id, input.data, ctx.user.id); }),
    diagnosticEvents: backOfficeProcedure.input(z.object({ limit: z.number().int().min(1).max(500).optional(), type: z.string().max(64).optional(), route: z.string().max(240).optional(), from: z.date().optional(), to: z.date().optional() }).optional()).query(({ input }) => input ? listFilteredClientDiagnosticEvents(input) : listClientDiagnosticEvents()),
    diagnosticAlerts: backOfficeProcedure.input(z.object({ days: z.number().int().min(1).max(90).optional(), threshold: z.number().int().min(2).max(100).optional() }).optional()).query(({ input }) => getRecurringDiagnosticAlerts(input)),
    stageHistoryFiltered: backOfficeProcedure.input(z.object({ projectId: z.number().optional(), changedBy: z.number().optional(), from: z.date().optional(), to: z.date().optional(), limit: z.number().int().min(1).max(500).optional() })).query(({ input }) => listFilteredStageStatusHistory(input)),
    users: backOfficeProcedure.query(({ ctx }) => listUsers({ userId: ctx.user.id, profile: ctx.profile })),
    profileAudit: backOfficeProcedure.input(z.object({ actorUserId: z.number().int().optional(), action: z.enum(["create", "update", "blocked"]).optional(), from: z.date().optional(), to: z.date().optional() }).optional()).query(({ input, ctx }) => listUserProfileAuditLogs({ scope: { userId: ctx.user.id, profile: ctx.profile }, actorUserId: input?.actorUserId, action: input?.action, from: input?.from, to: input?.to })),
    advancedSettings: masterProcedure.query(() => listAdvancedSettings()),
    advancedSettingsAudit: masterProcedure.query(() => listAdvancedSettingsAudit()),
    updateAdvancedSetting: masterProcedure.input(z.object({ key: z.enum(ADVANCED_SETTING_KEYS), value: z.boolean(), reason: z.string().trim().min(10).max(500) })).mutation(({ input, ctx }) => updateAdvancedSetting({ ...input, changedBy: ctx.user.id })),
    createUser: editorProcedure.input(z.object({ openId: z.string().min(3).max(64), name: z.string().max(160).optional(), email: z.string().email().optional(), profile: z.enum(["admin_master", "admin_geral", "gestor_setor", "editor_projetos", "consulta"]).default("consulta"), areaIds: z.array(z.number().int()).default([]) })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_user_management", "A gestão de usuários está bloqueada pelo Administrador Master."); if (!canAssignProfile(ctx.profile, input.profile)) { await recordBlockedProfileAttempt({ actorUserId: ctx.user.id, requestedProfile: input.profile, reason: "Tentativa de criar perfil igual ou superior ao perfil do solicitante." }); throw new TRPCError({ code: "FORBIDDEN", message: "Você só pode criar perfis estritamente inferiores ao seu." }); } if (ctx.profile === "gestor_setor") { const allowed = new Set(await getUserAreaIds(ctx.user.id)); if (input.areaIds.some(areaId => !allowed.has(areaId))) throw new TRPCError({ code: "FORBIDDEN", message: "Você só pode vincular usuários aos seus próprios setores." }); } return createManagedUser({ ...input, actorUserId: ctx.user.id }); }),
    updateUser: editorProcedure.input(z.object({ id: z.number(), profile: z.enum(["admin_master", "admin_geral", "gestor_setor", "editor_projetos", "consulta"]).optional(), areaIds: z.array(z.number().int()).optional(), isActive: z.boolean().optional() })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_user_management", "A gestão de usuários está bloqueada pelo Administrador Master."); if (input.id === ctx.user.id && (input.isActive === false || input.profile !== undefined || input.areaIds !== undefined)) throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode alterar o próprio perfil, setores ou desativar o próprio acesso." }); const currentTargetProfile = await getManagedUserProfile(input.id); if (!currentTargetProfile || !canAssignProfile(ctx.profile, currentTargetProfile)) { await recordBlockedProfileAttempt({ actorUserId: ctx.user.id, targetUserId: input.id, requestedProfile: input.profile ?? currentTargetProfile, reason: "Tentativa de administrar usuário com perfil igual ou superior ao perfil do solicitante." }); throw new TRPCError({ code: "FORBIDDEN", message: "Você só pode administrar usuários com perfil estritamente inferior ao seu." }); } if (ctx.profile === "gestor_setor") { const allowed = new Set(await getUserAreaIds(ctx.user.id)); const targetAreas = await getUserAreaIds(input.id); if (!targetAreas.some(areaId => allowed.has(areaId)) || (input.areaIds ?? []).some(areaId => !allowed.has(areaId))) throw new TRPCError({ code: "FORBIDDEN", message: "Você só pode administrar usuários vinculados aos seus próprios setores." }); } if (input.profile !== undefined && !canAssignProfile(ctx.profile, input.profile)) { await recordBlockedProfileAttempt({ actorUserId: ctx.user.id, targetUserId: input.id, requestedProfile: input.profile, reason: "Tentativa de atribuir perfil igual ou superior ao perfil do solicitante." }); throw new TRPCError({ code: "FORBIDDEN", message: "Você só pode atribuir perfis estritamente inferiores ao seu." }); } return updateManagedUser(input.id, { actorUserId: ctx.user.id, profile: input.profile, areaIds: input.areaIds, isActive: input.isActive }); }),
    createMilestone: editorProcedure.input(z.object({ projectId: z.number(), title: z.string().min(2), description: z.string().optional(), milestoneDate: z.date(), icon: z.string().optional() })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageProject(ctx.user.id, ctx.profile, input.projectId); return createMilestone(input); }),
    uploadPhoto: editorProcedure.input(z.object({ projectId: z.number(), fileName: z.string().min(1), mimeType: z.string().startsWith("image/"), data: z.string().min(10), title: z.string().optional(), description: z.string().optional() })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageProject(ctx.user.id, ctx.profile, input.projectId);
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `project-photos/${input.projectId}/${Date.now()}-${safeName}`;
      const buffer = Buffer.from(input.data.split(",")[1] ?? input.data, "base64");
      const stored = await storagePut(key, buffer, input.mimeType);
      return createPhoto({ projectId: input.projectId, storageKey: stored.key, url: stored.url, title: input.title, description: input.description });
    }),
    uploadDocument: editorProcedure.input(z.object({ projectId: z.number(), fileName: z.string().min(1).max(255), mimeType: z.enum(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain", "text/csv", "image/jpeg", "image/png", "image/webp", "application/zip"]).or(z.string().startsWith("application/")), data: z.string().min(10), title: z.string().min(1).max(200), category: z.string().max(80).optional(), sizeBytes: z.number().int().positive().max(20 * 1024 * 1024) })).mutation(async ({ input, ctx }) => { await assertAdvancedFeature("allow_project_edits", "As edições de projetos estão bloqueadas pelo Administrador Master."); await assertUserCanManageProject(ctx.user.id, ctx.profile, input.projectId);
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `project-documents/${input.projectId}/${Date.now()}-${safeName}`;
      const buffer = Buffer.from(input.data.split(",")[1] ?? input.data, "base64");
      const stored = await storagePut(key, buffer, input.mimeType);
      return createDocument({ projectId: input.projectId, title: input.title, fileName: input.fileName, mimeType: input.mimeType, category: input.category, sizeBytes: input.sizeBytes, storageKey: stored.key, url: stored.url });
    }),
  }),
});

export type AppRouter = typeof appRouter;
