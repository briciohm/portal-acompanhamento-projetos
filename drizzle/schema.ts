import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const areas = mysqlTable("project_areas", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  shortCode: varchar("shortCode", { length: 32 }).default("").notNull(),
  icon: varchar("icon", { length: 32 }).default("folder").notNull(),
  description: text("description"),
  accent: varchar("accent", { length: 16 }).default("#e30613").notNull(),
  isHidden: boolean("isHidden").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  areaId: int("areaId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  summary: text("summary"),
  status: mysqlEnum("status", ["estruturação", "andamento", "execução", "concluído", "pausado"]).default("andamento").notNull(),
  owner: varchar("owner", { length: 160 }),
  progress: int("progress").default(0).notNull(),
  isManual: boolean("isManual").default(false).notNull(),
  manualObservation: text("manualObservation"),
  isHidden: boolean("isHidden").default(false).notNull(),
  nextSteps: text("nextSteps"),
  startDate: timestamp("startDate"),
  targetDate: timestamp("targetDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const projectMetrics = mysqlTable("project_metrics", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  label: varchar("label", { length: 120 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 32 }),
  target: decimal("target", { precision: 12, scale: 2 }),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const projectStages = mysqlTable("project_stages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pendente", "em andamento", "concluída"]).default("pendente").notNull(),
  progressStatus: int("progressStatus").default(0).notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  dueDate: timestamp("dueDate"),
});

export const projectStageStatusHistory = mysqlTable("project_stage_status_history", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId").notNull(),
  previousStatus: int("previousStatus").notNull(),
  nextStatus: int("nextStatus").notNull(),
  changedBy: int("changedBy"),
  changedAt: timestamp("changedAt").defaultNow().notNull(),
});

export const clientDiagnosticEvents = mysqlTable("client_diagnostic_events", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 64 }).notNull(),
  message: text("message").notNull(),
  route: varchar("route", { length: 240 }),
  context: text("context"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectMilestones = mysqlTable("project_milestones", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  milestoneDate: timestamp("milestoneDate").notNull(),
  icon: varchar("icon", { length: 32 }).default("target").notNull(),
});

export const projectPhotos = mysqlTable("project_photos", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 160 }),
  description: text("description"),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  url: varchar("url", { length: 700 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectDocuments = mysqlTable("project_documents", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  fileName: varchar("fileName", { length: 240 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  category: varchar("category", { length: 80 }),
  sizeBytes: int("sizeBytes"),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  url: varchar("url", { length: 700 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Area = typeof areas.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectMetric = typeof projectMetrics.$inferSelect;
export type ProjectStage = typeof projectStages.$inferSelect;
export type ProjectStageStatusHistory = typeof projectStageStatusHistory.$inferSelect;
export type ClientDiagnosticEvent = typeof clientDiagnosticEvents.$inferSelect;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type ProjectPhoto = typeof projectPhotos.$inferSelect;
export type ProjectDocument = typeof projectDocuments.$inferSelect;
