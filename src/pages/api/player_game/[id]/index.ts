import { playerToGameTable } from "@/db/schema";
import { PlayerGameUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";
import { eq, sql } from "drizzle-orm";

export const prerender = false;
const selectData = {
  id: playerToGameTable.id,
  playerId: playerToGameTable.playerId,
  gameId: playerToGameTable.gameId,
  playtime: sql<string>`interval_to_iso8601(${playerToGameTable.playtime})`,
  recommended: playerToGameTable.recommended,
  review: playerToGameTable.review,
};

export const GET: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return json({ error: "invalid id" }, 400);
  }
  const data = await db
    .select(selectData)
    .from(playerToGameTable)
    .where(eq(playerToGameTable.id, id));
  if (data.length === 0) {
    return json({ error: "id not found" }, 404);
  }
  return json(data[0]);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return json({ error: "invalid id" }, 400);
  }

  const res = PlayerGameUpdate.validate(await request.json());
  if (res.is_err()) {
    return json({ err: res.unwrap_err() }, 400);
  }

  const update = res.unwrap().getFirst();

  const data = await db
    .update(playerToGameTable)
    .set(update)
    .where(eq(playerToGameTable.id, id))
    .returning(selectData);

  if (data.length === 0) {
    return json({ error: "Id not found" }, 404);
  }
  return json(data[0]);
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);

  if (isNaN(id)) {
    return json({ error: "invalid id" }, 400);
  }
  await db.delete(playerToGameTable).where(eq(playerToGameTable.id, id));
  return json({ ok: "completed" });
};
