import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { areas, clientDiagnosticEvents, InsertUser, projectDocuments, projectMetrics, projectMilestones, projectPhotos, projectStageStatusHistory, projectStages, projects, users } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listAreas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(areas).orderBy(asc(areas.name));
}

export async function listProjects(areaId?: number) {
  const db = await getDb();
  if (!db) return [];
  const query = areaId ? db.select().from(projects).where(eq(projects.areaId, areaId)) : db.select().from(projects);
  return query.orderBy(desc(projects.updatedAt));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const project = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return project[0];
}

const STAGE_WEIGHTS = [0, 50, 100] as const;

export function stageStatusToProgress(status: number) {
  return STAGE_WEIGHTS[Math.max(0, Math.min(2, Math.round(status)))];
}

export function calculateStageProgress(stages: Array<{ progressStatus: number }>) {
  if (!stages.length) return 0;
  return Math.round(stages.reduce((sum, stage) => sum + stageStatusToProgress(stage.progressStatus), 0) / stages.length);
}

export async function syncProjectProgressFromStages(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const project = await getProjectById(projectId);
  if (!project || project.isManual) return project;
  const stages = await db.select({ progressStatus: projectStages.progressStatus }).from(projectStages).where(eq(projectStages.projectId, projectId));
  const progress = calculateStageProgress(stages);
  await db.update(projects).set({ progress, status: progress >= 100 ? "concluído" : project.status === "concluído" ? "andamento" : project.status }).where(eq(projects.id, projectId));
  return getProjectById(projectId);
}

export async function getProjectDetail(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const project = await getProjectById(id);
  if (!project) return undefined;
  const [metrics, stages, milestones, photos, documents, statusHistory] = await Promise.all([
    db.select().from(projectMetrics).where(eq(projectMetrics.projectId, id)).orderBy(asc(projectMetrics.recordedAt)),
    db.select().from(projectStages).where(eq(projectStages.projectId, id)).orderBy(asc(projectStages.orderIndex)),
    db.select().from(projectMilestones).where(eq(projectMilestones.projectId, id)).orderBy(asc(projectMilestones.milestoneDate)),
    db.select().from(projectPhotos).where(eq(projectPhotos.projectId, id)).orderBy(desc(projectPhotos.createdAt)),
    db.select().from(projectDocuments).where(eq(projectDocuments.projectId, id)).orderBy(desc(projectDocuments.createdAt)),
    db.select().from(projectStageStatusHistory).where(eq(projectStageStatusHistory.projectId, id)).orderBy(desc(projectStageStatusHistory.changedAt)),
  ]);
  return { project, metrics, stages: stages.map(stage => ({ ...stage, progressStatus: stage.progressStatus ?? (stage.status === "concluída" ? 2 : stage.status === "em andamento" ? 1 : 0) })), milestones, photos, documents, statusHistory };
}

export async function getExecutiveSummary() {
  const db = await getDb();
  if (!db) return { areas: [], projects: [], totals: { projects: 0, active: 0, completed: 0, averageProgress: 0 } };
  const [areaRows, allProjectRows] = await Promise.all([listAreas(), listProjects()]);
  const projectRows = allProjectRows.filter((p) => p.status !== "pausado").map((project) => project.progress >= 100 && project.status !== "concluído" ? { ...project, status: "concluído" as const } : project);
  const active = projectRows.filter((p) => p.progress < 100 && p.status !== "concluído").length;
  const completed = projectRows.filter((p) => p.progress >= 100 || p.status === "concluído").length;
  const averageProgress = projectRows.length ? Math.round(projectRows.reduce((sum, p) => sum + p.progress, 0) / projectRows.length) : 0;
  return { areas: areaRows, projects: projectRows, totals: { projects: projectRows.length, active, completed, averageProgress } };
}

export async function createArea(input: typeof areas.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(areas).values(input);
  return { id: Number(result[0].insertId) };
}

export async function createProject(input: typeof projects.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(projects).values(input);
  return { id: Number(result[0].insertId) };
}

export async function updateProject(id: number, input: Partial<typeof projects.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  if (input.isManual && !input.manualObservation?.trim()) throw new Error("A observação é obrigatória para o progresso manual.");
  const normalizedInput = input.isManual === false
    ? { ...input, manualObservation: null }
    : input.progress !== undefined && input.progress >= 100 && input.status === undefined
      ? { ...input, status: "concluído" as const }
      : input;
  await db.update(projects).set(normalizedInput).where(eq(projects.id, id));
  return normalizedInput.isManual === false ? syncProjectProgressFromStages(id) : getProjectById(id);
}

export async function createMetric(input: typeof projectMetrics.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(projectMetrics).values(input);
  return { id: Number(result[0].insertId) };
}

export async function createStage(input: typeof projectStages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const progressStatus = input.progressStatus ?? (input.status === "concluída" ? 2 : input.status === "em andamento" ? 1 : 0);
  const result = await db.insert(projectStages).values({ ...input, progressStatus });
  await syncProjectProgressFromStages(input.projectId);
  return { id: Number(result[0].insertId) };
}

export async function updateStage(id: number, input: Partial<typeof projectStages.$inferInsert>, changedBy?: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const current = await db.select().from(projectStages).where(eq(projectStages.id, id)).limit(1);
  if (!current[0]) throw new Error("Etapa não encontrada");
  const progressStatus = input.progressStatus ?? (input.status === "concluída" ? 2 : input.status === "em andamento" ? 1 : undefined);
  const nextProgressStatus = progressStatus ?? current[0].progressStatus;
  await db.update(projectStages).set({ ...input, ...(progressStatus === undefined ? {} : { progressStatus, status: progressStatus === 2 ? "concluída" : progressStatus === 1 ? "em andamento" : "pendente" }) }).where(eq(projectStages.id, id));
  if (nextProgressStatus !== current[0].progressStatus) {
    await db.insert(projectStageStatusHistory).values({ projectId: current[0].projectId, stageId: id, previousStatus: current[0].progressStatus, nextStatus: nextProgressStatus, changedBy: changedBy ?? null });
  }
  await syncProjectProgressFromStages(current[0].projectId);
  return db.select().from(projectStages).where(eq(projectStages.id, id)).limit(1).then(rows => rows[0]);
}

export async function listStageStatusHistory(projectId: number) {
  return listFilteredStageStatusHistory({ projectId, limit: 500 });
}

export async function listFilteredStageStatusHistory(input: { projectId?: number; changedBy?: number; from?: Date; to?: Date; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const filters = [
    input.projectId === undefined ? undefined : eq(projectStageStatusHistory.projectId, input.projectId),
    input.changedBy === undefined ? undefined : eq(projectStageStatusHistory.changedBy, input.changedBy),
    input.from === undefined ? undefined : gte(projectStageStatusHistory.changedAt, input.from),
    input.to === undefined ? undefined : lte(projectStageStatusHistory.changedAt, input.to),
  ].filter(Boolean) as any[];
  return db.select().from(projectStageStatusHistory).where(filters.length ? and(...filters) : undefined).orderBy(desc(projectStageStatusHistory.changedAt)).limit(Math.min(Math.max(input.limit ?? 500, 1), 500));
}

export async function listUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: users.id, openId: users.openId, name: users.name, email: users.email, role: users.role, isActive: users.isActive, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users).orderBy(asc(users.name));
}

export async function createManagedUser(input: { openId: string; name?: string; email?: string; role?: "user" | "admin" }) {
  await upsertUser({ openId: input.openId, name: input.name, email: input.email, role: input.role ?? "user" });
  return getUserByOpenId(input.openId);
}

export async function updateManagedUser(id: number, input: { role?: "user" | "admin"; isActive?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(users).set(input).where(eq(users.id, id));
  return db.select({ id: users.id, openId: users.openId, name: users.name, email: users.email, role: users.role, isActive: users.isActive }).from(users).where(eq(users.id, id)).limit(1).then(rows => rows[0]);
}

export async function listClientDiagnosticEvents(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clientDiagnosticEvents).orderBy(desc(clientDiagnosticEvents.createdAt)).limit(Math.min(Math.max(limit, 1), 500));
}

export async function listFilteredClientDiagnosticEvents(input: { type?: string; route?: string; from?: Date; to?: Date; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const filters = [
    input.type ? eq(clientDiagnosticEvents.type, input.type) : undefined,
    input.route ? eq(clientDiagnosticEvents.route, input.route) : undefined,
    input.from === undefined ? undefined : gte(clientDiagnosticEvents.createdAt, input.from),
    input.to === undefined ? undefined : lte(clientDiagnosticEvents.createdAt, input.to),
  ].filter(Boolean) as any[];
  return db.select().from(clientDiagnosticEvents).where(filters.length ? and(...filters) : undefined).orderBy(desc(clientDiagnosticEvents.createdAt)).limit(Math.min(Math.max(input.limit ?? 500, 1), 500));
}

export async function getRecurringDiagnosticAlerts(input: { days?: number; threshold?: number } = {}) {
  const events = await listFilteredClientDiagnosticEvents({ from: new Date(Date.now() - (input.days ?? 7) * 86400000), limit: 500 });
  const groups = new Map<string, { type: string; message: string; route: string | null; count: number; lastSeen: Date }>();
  for (const event of events) {
    if (/resizeobserver/i.test(event.type) || /resizeobserver/i.test(event.message)) continue;
    const key = `${event.type}|${event.message}|${event.route ?? ""}`;
    const current = groups.get(key);
    groups.set(key, { type: event.type, message: event.message, route: event.route, count: (current?.count ?? 0) + 1, lastSeen: current?.lastSeen ?? event.createdAt });
  }
  return Array.from(groups.values()).filter(item => item.count >= (input.threshold ?? 3)).sort((a, b) => b.count - a.count);
}

export async function createClientDiagnosticEvent(input: typeof clientDiagnosticEvents.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(clientDiagnosticEvents).values(input);
  return { id: Number(result[0].insertId) };
}

export async function createMilestone(input: typeof projectMilestones.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(projectMilestones).values(input);
  return { id: Number(result[0].insertId) };
}

export async function createPhoto(input: typeof projectPhotos.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(projectPhotos).values(input);
  return { id: Number(result[0].insertId) };
}

export async function createDocument(input: typeof projectDocuments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(projectDocuments).values(input);
  return { id: Number(result[0].insertId) };
}
