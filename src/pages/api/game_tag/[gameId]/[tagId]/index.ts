import { gameToTagsTable } from "@/db/schema";
import { GameTagUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";
import { eq, and } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const gameId = Number(params.gameId);
  const tagId = Number(params.tagId);
  if (isNaN(gameId)) {
    return json({ error: "invalid id" }, 400);
  }
  if (isNaN(tagId)) {
    return json({ error: "invalid id" }, 400);
  }
  const data = await db
    .select()
    .from(gameToTagsTable)
    .where(
      and(eq(gameToTagsTable.gameId, gameId), eq(gameToTagsTable.tagId, tagId)),
    );
  if (data.length === 0) {
    return json({ error: "id not found" }, 404);
  }
  return json(data[0]);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const gameId = Number(params.gameId);
  const tagId = Number(params.tagId);
  if (isNaN(gameId)) {
    return json({ error: "invalid id" }, 400);
  }
  if (isNaN(tagId)) {
    return json({ error: "invalid id" }, 400);
  }

  const res = GameTagUpdate.validate(await request.json());
  if (res.is_err()) {
    return json({ err: res.unwrap_err() }, 400);
  }

  const update = res.unwrap().getFirst();

  const data = await db
    .update(gameToTagsTable)
    .set(update)
    .where(
      and(eq(gameToTagsTable.gameId, gameId), eq(gameToTagsTable.tagId, tagId)),
    )
    .returning();

  if (data.length === 0) {
    return json({ error: "Id not found" }, 404);
  }
  return json(data[0]);
};

export const DELETE: APIRoute = async ({ params }) => {
  const gameId = Number(params.gameId);
  const tagId = Number(params.tagId);
  if (isNaN(gameId)) {
    return json({ error: "invalid id" }, 400);
  }
  if (isNaN(tagId)) {
    return json({ error: "invalid id" }, 400);
  }

  await db
    .delete(gameToTagsTable)
    .where(
      and(eq(gameToTagsTable.gameId, gameId), eq(gameToTagsTable.tagId, tagId)),
    );
  return json({ ok: "completed" });
};
