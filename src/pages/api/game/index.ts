import { gameTable } from "@/db/schema";
import { GameUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({}) => {
  return json(await db.select().from(gameTable));
};

export const POST: APIRoute = async ({ request }) => {
  const newDataRes = GameUpdate.validate(await request.json());
  if (newDataRes.is_err()) {
    return json({ error: `invalid: ${newDataRes.unwrap_err()}` }, 400);
  }
  const newData = newDataRes.unwrap().getFirst();

  const data = await db.insert(gameTable).values(newData).returning();

  return json(data[0], 201);
};
