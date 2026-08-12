"use server";

import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { road_projects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export interface RoadProject {
  id: string;
  name: string;
  status: string;
  eta_text: string;
  detail: string | null;
  source_url: string | null;
  sort: number;
  last_updated: string;
}

function serialize(row: typeof road_projects.$inferSelect): RoadProject {
  return { ...row, last_updated: row.last_updated.toISOString() };
}

export async function getRoadProjects(): Promise<RoadProject[]> {
  const db = getDb();
  const rows = await db.select().from(road_projects).orderBy(asc(road_projects.sort));
  return rows.map(serialize);
}

export interface RoadProjectInput {
  name: string;
  status: string;
  eta_text: string;
  detail?: string;
  source_url?: string;
  sort?: number;
}

export async function createRoadProject(input: RoadProjectInput): Promise<RoadProject> {
  await requireAdmin();
  const db = getDb();
  const [row] = await db
    .insert(road_projects)
    .values({
      ...input,
      detail: input.detail || null,
      source_url: input.source_url || null,
      sort: input.sort ?? 0,
      last_updated: new Date(),
    })
    .returning();
  return serialize(row);
}

export async function updateRoadProject(
  id: string,
  input: RoadProjectInput
): Promise<RoadProject> {
  await requireAdmin();
  const db = getDb();
  const [row] = await db
    .update(road_projects)
    .set({
      ...input,
      detail: input.detail || null,
      source_url: input.source_url || null,
      sort: input.sort ?? 0,
      last_updated: new Date(),
    })
    .where(eq(road_projects.id, id))
    .returning();
  return serialize(row);
}

export async function deleteRoadProject(id: string): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db.delete(road_projects).where(eq(road_projects.id, id));
}
