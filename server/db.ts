import { and, asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { areas, InsertUser, projectMetrics, projectMilestones, projectPhotos, projectStages, projects, users } from "../drizzle/schema";

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

export async function getProjectDetail(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const project = await getProjectById(id);
  if (!project) return undefined;
  const [metrics, stages, milestones, photos] = await Promise.all([
    db.select().from(projectMetrics).where(eq(projectMetrics.projectId, id)).orderBy(asc(projectMetrics.recordedAt)),
    db.select().from(projectStages).where(eq(projectStages.projectId, id)).orderBy(asc(projectStages.orderIndex)),
    db.select().from(projectMilestones).where(eq(projectMilestones.projectId, id)).orderBy(asc(projectMilestones.milestoneDate)),
    db.select().from(projectPhotos).where(eq(projectPhotos.projectId, id)).orderBy(desc(projectPhotos.createdAt)),
  ]);
  return { project, metrics, stages, milestones, photos };
}

export async function getExecutiveSummary() {
  const db = await getDb();
  if (!db) return { areas: [], projects: [], totals: { projects: 0, active: 0, completed: 0, averageProgress: 0 } };
  const [areaRows, projectRows] = await Promise.all([listAreas(), listProjects()]);
  const active = projectRows.filter((p) => !["concluído", "pausado"].includes(p.status)).length;
  const completed = projectRows.filter((p) => p.status === "concluído").length;
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
  await db.update(projects).set(input).where(eq(projects.id, id));
  return getProjectById(id);
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
  const result = await db.insert(projectStages).values(input);
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
