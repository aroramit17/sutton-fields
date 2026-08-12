"use server";

import { getDb } from "@/db";
import { board_status } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export type BoardKey = "pool" | "trash" | "water" | "roads";
export type BoardTone = "ok" | "warn" | "alert" | "unknown";

export interface BoardChip {
  key: BoardKey;
  value: string;
  note: string | null;
  tone: BoardTone;
  link_url: string | null;
  updated_at: string;
}

function serialize(row: typeof board_status.$inferSelect): BoardChip {
  return {
    key: row.key,
    value: row.value,
    note: row.note,
    tone: row.tone,
    link_url: row.link_url,
    updated_at: row.updated_at.toISOString(),
  };
}

export async function getBoardStatus(): Promise<Partial<Record<BoardKey, BoardChip>>> {
  const db = getDb();
  const rows = await db.select().from(board_status);
  return Object.fromEntries(rows.map((r) => [r.key, serialize(r)]));
}

export async function setBoardStatus(
  key: BoardKey,
  data: { value: string; note?: string; tone: BoardTone; link_url?: string }
): Promise<void> {
  await requireAdmin();
  const db = getDb();
  await db
    .insert(board_status)
    .values({
      key,
      value: data.value,
      note: data.note || null,
      tone: data.tone,
      link_url: data.link_url || null,
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: board_status.key,
      set: {
        value: data.value,
        note: data.note || null,
        tone: data.tone,
        link_url: data.link_url || null,
        updated_at: new Date(),
      },
    });
}
