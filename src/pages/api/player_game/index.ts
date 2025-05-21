import { playerToGameTable } from "@/db/schema";
import { PlayerGameUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";
import { sql } from "drizzle-orm";

export const prerender = false;
const selectData = {
  id: playerToGameTable.id,
  playerId: playerToGameTable.playerId,
  gameId: playerToGameTable.gameId,
  playtime: sql<string>`interval_to_iso8601(${playerToGameTable.playtime})`,
  recommended: playerToGameTable.recommended,
  review: playerToGameTable.review,
};

export const GET: APIRoute = async ({ request }) => {
  return json(await db.select(selectData).from(playerToGameTable));
};

export const POST: APIRoute = async ({ request }) => {
  const newTagRes = PlayerGameUpdate.validate(await request.json());
  if (newTagRes.is_err()) {
    return json({ error: `invalid: ${newTagRes.unwrap_err()}` }, 400);
  }
  const newTag = newTagRes.unwrap().getFirst();

  const tag = await db
    .insert(playerToGameTable)
    .values(newTag)
    .returning(selectData);

  return json(tag[0], 201);
};
