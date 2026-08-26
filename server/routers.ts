import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import { areas, projectMetrics, projectMilestones, projectPhotos, projectStages, projects } from "../drizzle/schema";
import { createArea, createClientDiagnosticEvent, createDocument, createManagedUser, createMetric, createMilestone, createPhoto, createProject, createStage, getExecutiveSummary, getProjectDetail, getRecurringDiagnosticAlerts, listAreas, listClientDiagnosticEvents, listFilteredClientDiagnosticEvents, listFilteredStageStatusHistory, listProjects, listStageStatusHistory, listUsers, setAreaHidden, setProjectHidden, updateArea, updateManagedUser, updateProject, updateStage } from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao back-office." });
  return next();
});

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
    reportClientDiagnostic: publicProcedure.input(z.object({ type: z.string().min(1).max(64), message: z.string().min(1).max(4000), route: z.string().max(240).optional(), context: z.string().max(4000).optional() })).mutation(({ input }) => createClientDiagnosticEvent(input)),
  }),
  admin: router({
    areas: adminProcedure.query(() => listAreas(true)),
    projects: adminProcedure.input(z.object({ areaId: z.number().optional(), includeHidden: z.boolean().default(true) }).optional()).query(({ input }) => listProjects(input?.areaId, input?.includeHidden ?? true)),
    toggleAreaVisibility: adminProcedure.input(z.object({ id: z.number(), isHidden: z.boolean() })).mutation(({ input }) => setAreaHidden(input.id, input.isHidden)),
    toggleProjectVisibility: adminProcedure.input(z.object({ id: z.number(), isHidden: z.boolean() })).mutation(({ input }) => setProjectHidden(input.id, input.isHidden)),
    updateArea: adminProcedure.input(z.object({ id: z.number(), data: z.object({ name: z.string().min(2).optional(), code: z.string().min(2).optional(), shortCode: z.string().min(1).max(32).optional(), icon: z.string().min(1).max(32).optional(), description: z.string().optional(), accent: z.string().optional() }) })).mutation(({ input }) => updateArea(input.id, input.data)),
    project: adminProcedure.input(z.object({ id: z.number() })).query(({ input }) => getProjectDetail(input.id, true)),
    createArea: adminProcedure.input(z.object({ name: z.string().min(2), code: z.string().min(2), shortCode: z.string().min(1).max(32).optional(), icon: z.string().min(1).max(32).optional(), description: z.string().optional(), accent: z.string().optional() })).mutation(({ input }) => createArea(input)),
    createProject: adminProcedure.input(z.object({ areaId: z.number(), name: z.string().min(2), code: z.string().min(2), summary: z.string().optional(), status: statusSchema.optional(), owner: z.string().optional(), progress: z.number().min(0).max(100).optional(), nextSteps: z.string().optional(), startDate: z.date().optional(), targetDate: z.date().optional() })).mutation(({ input }) => createProject(input)),
    updateProject: adminProcedure.input(z.object({ id: z.number(), data: z.object({ name: z.string().min(2).optional(), summary: z.string().optional(), status: statusSchema.optional(), owner: z.string().optional(), progress: z.number().min(0).max(100).optional(), isManual: z.boolean().optional(), manualObservation: z.string().optional(), nextSteps: z.string().optional(), startDate: z.date().optional(), targetDate: z.date().optional() }).superRefine((data, ctx) => { if (data.isManual === true && !data.manualObservation?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["manualObservation"], message: "A observação é obrigatória para o progresso manual." }); }) })).mutation(({ input }) => updateProject(input.id, input.data)),
    createMetric: adminProcedure.input(z.object({ projectId: z.number(), label: z.string().min(2), value: z.number(), unit: z.string().optional(), target: z.number().optional(), recordedAt: z.date().optional() })).mutation(({ input }) => createMetric({ ...input, value: String(input.value), target: input.target === undefined ? undefined : String(input.target) })),
    createStage: adminProcedure.input(z.object({ projectId: z.number(), title: z.string().min(2), description: z.string().optional(), status: z.enum(["pendente", "em andamento", "concluída"]).optional(), progressStatus: z.number().int().min(0).max(2).optional(), orderIndex: z.number().optional(), dueDate: z.date().optional() })).mutation(({ input }) => createStage(input)),
    updateStage: adminProcedure.input(z.object({ id: z.number(), data: z.object({ status: z.enum(["pendente", "em andamento", "concluída"]).optional(), progressStatus: z.number().int().min(0).max(2).optional(), title: z.string().min(2).optional(), description: z.string().optional(), orderIndex: z.number().optional(), dueDate: z.date().optional() }) })).mutation(({ input, ctx }) => updateStage(input.id, input.data, ctx.user.id)),
    diagnosticEvents: adminProcedure.input(z.object({ limit: z.number().int().min(1).max(500).optional(), type: z.string().max(64).optional(), route: z.string().max(240).optional(), from: z.date().optional(), to: z.date().optional() }).optional()).query(({ input }) => input ? listFilteredClientDiagnosticEvents(input) : listClientDiagnosticEvents()),
    diagnosticAlerts: adminProcedure.input(z.object({ days: z.number().int().min(1).max(90).optional(), threshold: z.number().int().min(2).max(100).optional() }).optional()).query(({ input }) => getRecurringDiagnosticAlerts(input)),
    stageHistoryFiltered: adminProcedure.input(z.object({ projectId: z.number().optional(), changedBy: z.number().optional(), from: z.date().optional(), to: z.date().optional(), limit: z.number().int().min(1).max(500).optional() })).query(({ input }) => listFilteredStageStatusHistory(input)),
    users: adminProcedure.query(() => listUsers()),
    createUser: adminProcedure.input(z.object({ openId: z.string().min(3).max(64), name: z.string().max(160).optional(), email: z.string().email().optional(), role: z.enum(["user", "admin"]).default("user") })).mutation(({ input }) => createManagedUser(input)),
    updateUser: adminProcedure.input(z.object({ id: z.number(), role: z.enum(["user", "admin"]).optional(), isActive: z.boolean().optional() })).mutation(({ input, ctx }) => { if (input.id === ctx.user.id && (input.isActive === false || input.role === "user")) throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode remover sua própria administração ou desativar seu acesso." }); return updateManagedUser(input.id, { role: input.role, isActive: input.isActive }); }),
    createMilestone: adminProcedure.input(z.object({ projectId: z.number(), title: z.string().min(2), description: z.string().optional(), milestoneDate: z.date(), icon: z.string().optional() })).mutation(({ input }) => createMilestone(input)),
    uploadPhoto: adminProcedure.input(z.object({ projectId: z.number(), fileName: z.string().min(1), mimeType: z.string().startsWith("image/"), data: z.string().min(10), title: z.string().optional(), description: z.string().optional() })).mutation(async ({ input }) => {
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `project-photos/${input.projectId}/${Date.now()}-${safeName}`;
      const buffer = Buffer.from(input.data.split(",")[1] ?? input.data, "base64");
      const stored = await storagePut(key, buffer, input.mimeType);
      return createPhoto({ projectId: input.projectId, storageKey: stored.key, url: stored.url, title: input.title, description: input.description });
    }),
    uploadDocument: adminProcedure.input(z.object({ projectId: z.number(), fileName: z.string().min(1).max(255), mimeType: z.enum(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain", "text/csv", "image/jpeg", "image/png", "image/webp", "application/zip"]).or(z.string().startsWith("application/")), data: z.string().min(10), title: z.string().min(1).max(200), category: z.string().max(80).optional(), sizeBytes: z.number().int().positive().max(20 * 1024 * 1024) })).mutation(async ({ input }) => {
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `project-documents/${input.projectId}/${Date.now()}-${safeName}`;
      const buffer = Buffer.from(input.data.split(",")[1] ?? input.data, "base64");
      const stored = await storagePut(key, buffer, input.mimeType);
      return createDocument({ projectId: input.projectId, title: input.title, fileName: input.fileName, mimeType: input.mimeType, category: input.category, sizeBytes: input.sizeBytes, storageKey: stored.key, url: stored.url });
    }),
  }),
});

export type AppRouter = typeof appRouter;
