import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  lte,
  sql,
  type SQL,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import {
  areas,
  clientDiagnosticEvents,
  InsertUser,
  projectDocuments,
  projectMetrics,
  projectMilestones,
  projectPhotos,
  projectStageStatusHistory,
  projectStages,
  projects,
  systemSettings,
  systemSettingsAuditLogs,
  userAreaAssignments,
  userProfileAuditLogs,
  users,
} from "../drizzle/schema";
import {
  canUseMasterProfile,
  roleForProfile,
  type UserProfile,
} from "../shared/userRoles";
import { nextProjectCode } from "../shared/projectCode";
import {
  ADVANCED_SETTING_DEFINITIONS,
  ADVANCED_SETTING_KEYS,
  parseAdvancedSettingValue,
  type AdvancedSettingKey,
} from "../shared/advancedSettings";

let _db: ReturnType<typeof drizzle> | null = null;

function compactFilters(filters: Array<SQL | undefined>): SQL[] {
  return filters.filter((filter): filter is SQL => filter !== undefined);
}

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
  const updateSet: Partial<InsertUser> = {};
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
  if (user.profile !== undefined || user.openId === ENV.ownerOpenId) {
    values.profile = user.profile ?? "admin_geral";
    updateSet.profile = values.profile;
  }
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function listAreas(includeHidden = false) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(areas);
  return includeHidden
    ? query.orderBy(asc(areas.name))
    : query.where(eq(areas.isHidden, false)).orderBy(asc(areas.name));
}

export async function getAreaById(id: number, includeHidden = false) {
  const db = await getDb();
  if (!db) return undefined;
  const filters = compactFilters([
    eq(areas.id, id),
    includeHidden ? undefined : eq(areas.isHidden, false),
  ]);
  const result = await db
    .select()
    .from(areas)
    .where(and(...filters))
    .limit(1);
  return result[0];
}

export async function listProjects(areaId?: number, includeHidden = false) {
  const db = await getDb();
  if (!db) return [];
  if (areaId !== undefined && !includeHidden && !(await getAreaById(areaId)))
    return [];
  const filters = compactFilters([
    areaId === undefined ? undefined : eq(projects.areaId, areaId),
    includeHidden ? undefined : eq(projects.isHidden, false),
  ]);
  const query = db.select().from(projects);
  return filters.length
    ? query.where(and(...filters)).orderBy(desc(projects.updatedAt))
    : query.orderBy(desc(projects.updatedAt));
}

export async function getProjectById(id: number, includeHidden = false) {
  const db = await getDb();
  if (!db) return undefined;
  const filters = compactFilters([
    eq(projects.id, id),
    includeHidden ? undefined : eq(projects.isHidden, false),
  ]);
  const project = await db
    .select()
    .from(projects)
    .where(and(...filters))
    .limit(1);
  return project[0];
}

const STAGE_WEIGHTS = [0, 50, 100] as const;

export function stageStatusToProgress(status: number) {
  return STAGE_WEIGHTS[Math.max(0, Math.min(2, Math.round(status)))];
}

export function calculateStageProgress(
  stages: Array<{ progressStatus: number }>
) {
  if (!stages.length) return 0;
  return Math.round(
    stages.reduce(
      (sum, stage) => sum + stageStatusToProgress(stage.progressStatus),
      0
    ) / stages.length
  );
}

export async function syncProjectProgressFromStages(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const project = await getProjectById(projectId, true);
  if (!project || project.isManual) return project;
  // A conclusão confirmada é uma decisão explícita do usuário e não deve ser
  // revertida por uma sincronização incidental de etapas.
  if (project.completionConfirmed) return project;
  const stages = await db
    .select({ progressStatus: projectStages.progressStatus })
    .from(projectStages)
    .where(eq(projectStages.projectId, projectId));
  const progress = calculateStageProgress(stages);
  await db
    .update(projects)
    .set({
      progress,
      status:
        progress >= 100
          ? "concluído"
          : project.status === "concluído"
            ? "andamento"
            : project.status,
    })
    .where(eq(projects.id, projectId));
  return getProjectById(projectId, true);
}

export async function getProjectDetail(id: number, includeHidden = false) {
  const db = await getDb();
  if (!db) return undefined;
  const project = await getProjectById(id, includeHidden);
  if (!project) return undefined;
  if (!includeHidden && !(await getAreaById(project.areaId))) return undefined;
  const [metrics, stages, milestones, photos, documents, statusHistory] =
    await Promise.all([
      db
        .select()
        .from(projectMetrics)
        .where(eq(projectMetrics.projectId, id))
        .orderBy(asc(projectMetrics.recordedAt)),
      db
        .select()
        .from(projectStages)
        .where(eq(projectStages.projectId, id))
        .orderBy(asc(projectStages.orderIndex)),
      db
        .select()
        .from(projectMilestones)
        .where(eq(projectMilestones.projectId, id))
        .orderBy(asc(projectMilestones.milestoneDate)),
      db
        .select()
        .from(projectPhotos)
        .where(eq(projectPhotos.projectId, id))
        .orderBy(desc(projectPhotos.createdAt)),
      db
        .select()
        .from(projectDocuments)
        .where(eq(projectDocuments.projectId, id))
        .orderBy(desc(projectDocuments.createdAt)),
      db
        .select()
        .from(projectStageStatusHistory)
        .where(eq(projectStageStatusHistory.projectId, id))
        .orderBy(desc(projectStageStatusHistory.changedAt)),
    ]);
  return {
    project,
    metrics,
    stages: stages.map(stage => ({
      ...stage,
      progressStatus:
        stage.progressStatus ??
        (stage.status === "concluída"
          ? 2
          : stage.status === "em andamento"
            ? 1
            : 0),
    })),
    milestones,
    photos,
    documents,
    statusHistory,
  };
}

export async function getExecutiveSummary() {
  const db = await getDb();
  if (!db)
    return {
      areas: [],
      projects: [],
      totals: { projects: 0, active: 0, completed: 0, averageProgress: 0 },
    };
  const [areaRows, allProjectRows] = await Promise.all([
    listAreas(),
    listProjects(),
  ]);
  const visibleAreaIds = new Set(areaRows.map(area => area.id));
  const projectRows = allProjectRows
    .filter(
      project =>
        visibleAreaIds.has(project.areaId) && project.status !== "pausado"
    )
    .map(project =>
      project.progress >= 100 && project.status !== "concluído"
        ? { ...project, status: "concluído" as const }
        : project
    );
  const active = projectRows.filter(
    p => p.progress < 100 && p.status !== "concluído"
  ).length;
  const completed = projectRows.filter(
    p => p.progress >= 100 || p.status === "concluído"
  ).length;
  const averageProgress = projectRows.length
    ? Math.round(
        projectRows.reduce((sum, p) => sum + p.progress, 0) / projectRows.length
      )
    : 0;
  return {
    areas: areaRows,
    projects: projectRows,
    totals: {
      projects: projectRows.length,
      active,
      completed,
      averageProgress,
    },
  };
}

export async function createArea(input: typeof areas.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(areas).values(input);
  return { id: Number(result[0].insertId) };
}

export async function getNextProjectCode(areaId: number) {
  const area = await getAreaById(areaId, true);
  if (!area) throw new Error("Setor não encontrado.");
  const existingProjects = await listProjects(areaId, true);
  return nextProjectCode(
    area.shortCode || area.code,
    existingProjects.map(project => project.code)
  );
}

export async function createProject(
  input: Omit<typeof projects.$inferInsert, "code"> & { code?: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const code = input.code?.trim() || (await getNextProjectCode(input.areaId));
  const result = await db.insert(projects).values({ ...input, code });
  return { id: Number(result[0].insertId), code };
}

export async function updateArea(
  id: number,
  input: Partial<typeof areas.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(areas).set(input).where(eq(areas.id, id));
  return getAreaById(id, true);
}

export async function setAreaHidden(id: number, isHidden: boolean) {
  return updateArea(id, { isHidden });
}

export function normalizeProjectUpdate(
  input: Partial<typeof projects.$inferInsert>
) {
  const explicitlyConcluding = input.status === "concluído";
  const explicitlyReopening =
    input.status !== undefined && input.status !== "concluído";
  const normalizedInput = explicitlyConcluding
    ? {
        ...input,
        progress: 100,
        status: "concluído" as const,
        completionConfirmed: true,
        manualObservation:
          input.isManual === false ? null : input.manualObservation,
      }
    : input.isManual === false
      ? {
          ...input,
          completionConfirmed: explicitlyReopening
            ? false
            : input.completionConfirmed,
          manualObservation: null,
        }
      : explicitlyReopening
        ? { ...input, completionConfirmed: false }
        : input.progress !== undefined &&
            input.progress >= 100 &&
            input.status === undefined
          ? { ...input, status: "concluído" as const }
          : input;
  return { explicitlyConcluding, normalizedInput };
}

export async function updateProject(
  id: number,
  input: Partial<typeof projects.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  if (input.isManual && !input.manualObservation?.trim())
    throw new Error("A observação é obrigatória para o progresso manual.");
  const { explicitlyConcluding, normalizedInput } =
    normalizeProjectUpdate(input);
  await db.update(projects).set(normalizedInput).where(eq(projects.id, id));
  return explicitlyConcluding
    ? getProjectById(id, true)
    : normalizedInput.isManual === false
      ? syncProjectProgressFromStages(id)
      : getProjectById(id, true);
}

export async function setProjectHidden(id: number, isHidden: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(projects).set({ isHidden }).where(eq(projects.id, id));
  return getProjectById(id, true);
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
  const progressStatus =
    input.progressStatus ??
    (input.status === "concluída"
      ? 2
      : input.status === "em andamento"
        ? 1
        : 0);
  const result = await db
    .insert(projectStages)
    .values({ ...input, progressStatus });
  await syncProjectProgressFromStages(input.projectId);
  return { id: Number(result[0].insertId) };
}

export async function updateStage(
  id: number,
  input: Partial<typeof projectStages.$inferInsert>,
  changedBy?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const current = await db
    .select()
    .from(projectStages)
    .where(eq(projectStages.id, id))
    .limit(1);
  if (!current[0]) throw new Error("Etapa não encontrada");
  const progressStatus =
    input.progressStatus ??
    (input.status === "concluída"
      ? 2
      : input.status === "em andamento"
        ? 1
        : undefined);
  const nextProgressStatus = progressStatus ?? current[0].progressStatus;
  await db
    .update(projectStages)
    .set({
      ...input,
      ...(progressStatus === undefined
        ? {}
        : {
            progressStatus,
            status:
              progressStatus === 2
                ? "concluída"
                : progressStatus === 1
                  ? "em andamento"
                  : "pendente",
          }),
    })
    .where(eq(projectStages.id, id));
  if (nextProgressStatus !== current[0].progressStatus) {
    await db.insert(projectStageStatusHistory).values({
      projectId: current[0].projectId,
      stageId: id,
      previousStatus: current[0].progressStatus,
      nextStatus: nextProgressStatus,
      changedBy: changedBy ?? null,
    });
  }
  await syncProjectProgressFromStages(current[0].projectId);
  return db
    .select()
    .from(projectStages)
    .where(eq(projectStages.id, id))
    .limit(1)
    .then(rows => rows[0]);
}

export async function listStageStatusHistory(projectId: number) {
  return listFilteredStageStatusHistory({ projectId, limit: 500 });
}

export async function listFilteredStageStatusHistory(input: {
  projectId?: number;
  changedBy?: number;
  from?: Date;
  to?: Date;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const filters = compactFilters([
    input.projectId === undefined
      ? undefined
      : eq(projectStageStatusHistory.projectId, input.projectId),
    input.changedBy === undefined
      ? undefined
      : eq(projectStageStatusHistory.changedBy, input.changedBy),
    input.from === undefined
      ? undefined
      : gte(projectStageStatusHistory.changedAt, input.from),
    input.to === undefined
      ? undefined
      : lte(projectStageStatusHistory.changedAt, input.to),
  ]);
  return db
    .select()
    .from(projectStageStatusHistory)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(projectStageStatusHistory.changedAt))
    .limit(Math.min(Math.max(input.limit ?? 500, 1), 500));
}

export async function getUserAreaIds(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ areaId: userAreaAssignments.areaId })
    .from(userAreaAssignments)
    .where(eq(userAreaAssignments.userId, userId));
  return rows.map(row => row.areaId);
}

export async function listUsers(scope?: {
  userId: number;
  profile: UserProfile;
}) {
  const db = await getDb();
  if (!db) return [];
  const [userRows, assignments] = await Promise.all([
    db
      .select({
        id: users.id,
        openId: users.openId,
        name: users.name,
        email: users.email,
        role: users.role,
        profile: users.profile,
        isActive: users.isActive,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn,
      })
      .from(users)
      .orderBy(asc(users.name)),
    db
      .select({
        userId: userAreaAssignments.userId,
        areaId: userAreaAssignments.areaId,
      })
      .from(userAreaAssignments),
  ]);
  const mapped = userRows.map(user => ({
    ...user,
    areaIds: assignments
      .filter(item => item.userId === user.id)
      .map(item => item.areaId),
  }));
  if (!scope || scope.profile !== "gestor_setor") return mapped;
  const actorAreaIds = new Set(
    assignments
      .filter(item => item.userId === scope.userId)
      .map(item => item.areaId)
  );
  return mapped.filter(user =>
    user.areaIds.some(areaId => actorAreaIds.has(areaId))
  );
}

export async function getManagedUserProfile(
  userId: number
): Promise<UserProfile | null> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .select({ profile: users.profile, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!rows[0]) return null;
  return (rows[0].profile ||
    (rows[0].role === "admin" ? "admin_geral" : "consulta")) as UserProfile;
}

export async function createManagedUser(input: {
  actorUserId: number;
  openId: string;
  name?: string;
  email?: string;
  profile?: UserProfile;
  areaIds?: number[];
}) {
  const profile = input.profile ?? "consulta";
  if (!canUseMasterProfile(input.email, profile))
    throw new Error(
      "O perfil Administrador Master é exclusivo da conta proprietária."
    );
  await upsertUser({
    openId: input.openId,
    name: input.name,
    email: input.email,
    role: roleForProfile(profile),
    profile,
  });
  const user = await getUserByOpenId(input.openId);
  if (!user) return user;
  const areaIds = Array.from(new Set(input.areaIds ?? []));
  await replaceUserAreaAssignments(user.id, profile, areaIds);
  await recordUserProfileAudit({
    actorUserId: input.actorUserId,
    targetUserId: user.id,
    action: "create",
    previousProfile: null,
    newProfile: profile,
    previousAreaIds: [],
    newAreaIds: areaIds,
    previousIsActive: null,
    newIsActive: user.isActive,
  });
  return user;
}

export async function recordUserProfileAudit(input: {
  actorUserId: number;
  targetUserId?: number | null;
  action: "create" | "update" | "blocked";
  previousProfile?: UserProfile | null;
  newProfile?: UserProfile | null;
  previousAreaIds?: number[];
  newAreaIds?: number[];
  previousIsActive?: boolean | null;
  newIsActive?: boolean | null;
  reason?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(userProfileAuditLogs).values({
    actorUserId: input.actorUserId,
    targetUserId: input.targetUserId ?? null,
    action: input.action,
    previousProfile: input.previousProfile ?? null,
    newProfile: input.newProfile ?? null,
    previousAreaIds: JSON.stringify(input.previousAreaIds ?? []),
    newAreaIds: JSON.stringify(input.newAreaIds ?? []),
    previousIsActive: input.previousIsActive ?? null,
    newIsActive: input.newIsActive ?? null,
    reason: input.reason ?? null,
  });
}

export async function listUserProfileAuditLogs(
  filters?: {
    scope?: { userId: number; profile: UserProfile };
    actorUserId?: number;
    action?: "create" | "update" | "blocked";
    from?: Date;
    to?: Date;
  },
  limit = 200
) {
  const db = await getDb();
  if (!db) return [];
  const visibleUsers =
    filters?.scope?.profile === "gestor_setor"
      ? await listUsers(filters.scope)
      : null;
  const visibleTargetIds = visibleUsers?.map(user => user.id) ?? null;
  if (visibleTargetIds && visibleTargetIds.length === 0) return [];
  const conditions = compactFilters([
    visibleTargetIds
      ? inArray(userProfileAuditLogs.targetUserId, visibleTargetIds)
      : undefined,
    filters?.actorUserId === undefined
      ? undefined
      : eq(userProfileAuditLogs.actorUserId, filters.actorUserId),
    filters?.action === undefined
      ? undefined
      : eq(userProfileAuditLogs.action, filters.action),
    filters?.from === undefined
      ? undefined
      : gte(userProfileAuditLogs.createdAt, filters.from),
    filters?.to === undefined
      ? undefined
      : lte(userProfileAuditLogs.createdAt, filters.to),
  ]);
  const logs = await db
    .select()
    .from(userProfileAuditLogs)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(userProfileAuditLogs.createdAt))
    .limit(Math.min(Math.max(limit, 1), 500));
  const userIds = Array.from(
    new Set(
      logs.flatMap(log =>
        [log.actorUserId, log.targetUserId].filter(
          (id): id is number => id !== null
        )
      )
    )
  );
  const userRows = userIds.length
    ? await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(inArray(users.id, userIds))
    : [];
  return logs.map(log => ({
    ...log,
    actor: userRows.find(user => user.id === log.actorUserId) ?? null,
    target:
      log.targetUserId === null
        ? null
        : (userRows.find(user => user.id === log.targetUserId) ?? null),
  }));
}

export async function listAdvancedSettings() {
  const db = await getDb();
  if (!db)
    return ADVANCED_SETTING_KEYS.map(key => ({
      key,
      value: ADVANCED_SETTING_DEFINITIONS[key].defaultValue,
      updatedBy: null,
      updatedAt: null,
    }));
  const existing = await db.select().from(systemSettings);
  const byKey = new Map(existing.map(setting => [setting.key, setting]));
  const missing = ADVANCED_SETTING_KEYS.filter(key => !byKey.has(key));
  if (missing.length) {
    await db.insert(systemSettings).values(
      missing.map(key => ({
        key,
        value: String(ADVANCED_SETTING_DEFINITIONS[key].defaultValue),
        description: ADVANCED_SETTING_DEFINITIONS[key].description,
      }))
    );
    const refreshed = await db.select().from(systemSettings);
    return ADVANCED_SETTING_KEYS.map(key => ({
      ...refreshed.find(setting => setting.key === key),
      key,
      value: parseAdvancedSettingValue(
        refreshed.find(setting => setting.key === key)?.value,
        ADVANCED_SETTING_DEFINITIONS[key].defaultValue
      ),
    }));
  }
  return ADVANCED_SETTING_KEYS.map(key => ({
    ...byKey.get(key),
    key,
    value: parseAdvancedSettingValue(
      byKey.get(key)?.value,
      ADVANCED_SETTING_DEFINITIONS[key].defaultValue
    ),
  }));
}

export async function getAdvancedSettingValue(key: AdvancedSettingKey) {
  const db = await getDb();
  if (!db) return ADVANCED_SETTING_DEFINITIONS[key].defaultValue;
  const row = (
    await db
      .select({ value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.key, key))
      .limit(1)
  )[0];
  return parseAdvancedSettingValue(
    row?.value,
    ADVANCED_SETTING_DEFINITIONS[key].defaultValue
  );
}

export async function updateAdvancedSetting(input: {
  key: AdvancedSettingKey;
  value: boolean;
  changedBy: number;
  reason: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const definition = ADVANCED_SETTING_DEFINITIONS[input.key];
  const current = (
    await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, input.key))
      .limit(1)
  )[0];
  const previousValue = current?.value ?? String(definition.defaultValue);
  await db
    .insert(systemSettings)
    .values({
      key: input.key,
      value: String(input.value),
      description: definition.description,
      updatedBy: input.changedBy,
    })
    .onDuplicateKeyUpdate({
      set: {
        value: String(input.value),
        description: definition.description,
        updatedBy: input.changedBy,
      },
    });
  await db.insert(systemSettingsAuditLogs).values({
    settingKey: input.key,
    previousValue,
    newValue: String(input.value),
    changedBy: input.changedBy,
    reason: input.reason.trim(),
  });
  return { key: input.key, value: input.value };
}

export async function listAdvancedSettingsAudit(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  const logs = await db
    .select()
    .from(systemSettingsAuditLogs)
    .orderBy(desc(systemSettingsAuditLogs.createdAt))
    .limit(Math.min(Math.max(limit, 1), 200));
  const userIds = Array.from(new Set(logs.map(log => log.changedBy)));
  const userRows = userIds.length
    ? await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(inArray(users.id, userIds))
    : [];
  return logs.map(log => ({
    ...log,
    setting:
      ADVANCED_SETTING_DEFINITIONS[log.settingKey as AdvancedSettingKey] ??
      null,
    actor: userRows.find(user => user.id === log.changedBy) ?? null,
  }));
}

export async function userHasAreaAccess(
  userId: number,
  profile: UserProfile,
  areaId: number
) {
  if (profile !== "gestor_setor") return true;
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .select({ id: userAreaAssignments.id })
    .from(userAreaAssignments)
    .where(
      and(
        eq(userAreaAssignments.userId, userId),
        eq(userAreaAssignments.areaId, areaId)
      )
    )
    .limit(1);
  return Boolean(rows[0]);
}

export async function assertUserCanManageStage(
  userId: number,
  profile: UserProfile,
  stageId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .select({ projectId: projectStages.projectId })
    .from(projectStages)
    .where(eq(projectStages.id, stageId))
    .limit(1);
  if (!rows[0]) throw new Error("Etapa não encontrada.");
  await assertUserCanManageProject(userId, profile, rows[0].projectId);
}

export async function assertUserCanManageProject(
  userId: number,
  profile: UserProfile,
  projectId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .select({ areaId: projects.areaId })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  if (!rows[0]) throw new Error("Projeto não encontrado.");
  if (!(await userHasAreaAccess(userId, profile, rows[0].areaId)))
    throw new Error("Seu perfil não possui acesso a este setor.");
}

export async function assertUserCanManageArea(
  userId: number,
  profile: UserProfile,
  areaId: number
) {
  if (!(await userHasAreaAccess(userId, profile, areaId)))
    throw new Error("Seu perfil não possui acesso a este setor.");
}

export async function replaceUserAreaAssignments(
  userId: number,
  profile: UserProfile,
  areaIds: number[]
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db
    .delete(userAreaAssignments)
    .where(eq(userAreaAssignments.userId, userId));
  if (profile === "gestor_setor" && areaIds.length) {
    await db
      .insert(userAreaAssignments)
      .values(Array.from(new Set(areaIds)).map(areaId => ({ userId, areaId })));
  }
}

export async function updateManagedUser(
  id: number,
  input: {
    actorUserId: number;
    profile?: UserProfile;
    areaIds?: number[];
    isActive?: boolean;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const current = await db
    .select({
      profile: users.profile,
      role: users.role,
      email: users.email,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!current[0]) throw new Error("Usuário não encontrado.");
  const previousProfile = (current[0].profile ||
    (current[0].role === "admin" ? "admin_geral" : "consulta")) as UserProfile;
  const previousAreaIds = await getUserAreaIds(id);
  const profile = input.profile ?? previousProfile;
  if (!canUseMasterProfile(current[0].email, profile))
    throw new Error(
      "O perfil Administrador Master é exclusivo da conta proprietária."
    );
  const areaIds = input.areaIds ?? previousAreaIds;
  const isActive = input.isActive ?? current[0].isActive;
  await db
    .update(users)
    .set({
      ...(input.isActive === undefined ? {} : { isActive: input.isActive }),
      profile,
      role: roleForProfile(profile),
    })
    .where(eq(users.id, id));
  await replaceUserAreaAssignments(id, profile, areaIds);
  await recordUserProfileAudit({
    actorUserId: input.actorUserId,
    targetUserId: id,
    action: "update",
    previousProfile,
    newProfile: profile,
    previousAreaIds,
    newAreaIds: profile === "gestor_setor" ? Array.from(new Set(areaIds)) : [],
    previousIsActive: current[0].isActive,
    newIsActive: isActive,
  });
  return listUsers().then(rows => rows.find(user => user.id === id));
}

export async function listClientDiagnosticEvents(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(clientDiagnosticEvents)
    .orderBy(desc(clientDiagnosticEvents.createdAt))
    .limit(Math.min(Math.max(limit, 1), 500));
}

export async function listFilteredClientDiagnosticEvents(input: {
  type?: string;
  route?: string;
  from?: Date;
  to?: Date;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const filters = compactFilters([
    input.type ? eq(clientDiagnosticEvents.type, input.type) : undefined,
    input.route ? eq(clientDiagnosticEvents.route, input.route) : undefined,
    input.from === undefined
      ? undefined
      : gte(clientDiagnosticEvents.createdAt, input.from),
    input.to === undefined
      ? undefined
      : lte(clientDiagnosticEvents.createdAt, input.to),
  ]);
  return db
    .select()
    .from(clientDiagnosticEvents)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(clientDiagnosticEvents.createdAt))
    .limit(Math.min(Math.max(input.limit ?? 500, 1), 500));
}

export async function getRecurringDiagnosticAlerts(
  input: { days?: number; threshold?: number } = {}
) {
  const events = await listFilteredClientDiagnosticEvents({
    from: new Date(Date.now() - (input.days ?? 7) * 86400000),
    limit: 500,
  });
  const groups = new Map<
    string,
    {
      type: string;
      message: string;
      route: string | null;
      count: number;
      lastSeen: Date;
    }
  >();
  for (const event of events) {
    if (
      /resizeobserver/i.test(event.type) ||
      /resizeobserver/i.test(event.message)
    )
      continue;
    const key = `${event.type}|${event.message}|${event.route ?? ""}`;
    const current = groups.get(key);
    groups.set(key, {
      type: event.type,
      message: event.message,
      route: event.route,
      count: (current?.count ?? 0) + 1,
      lastSeen: current?.lastSeen ?? event.createdAt,
    });
  }
  return Array.from(groups.values())
    .filter(item => item.count >= (input.threshold ?? 3))
    .sort((a, b) => b.count - a.count);
}

export async function createClientDiagnosticEvent(
  input: typeof clientDiagnosticEvents.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(clientDiagnosticEvents).values(input);
  return { id: Number(result[0].insertId) };
}

export async function createMilestone(
  input: typeof projectMilestones.$inferInsert
) {
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

export async function createDocument(
  input: typeof projectDocuments.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(projectDocuments).values(input);
  return { id: Number(result[0].insertId) };
}
