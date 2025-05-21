import { tagTable } from "@/db/schema";
import { TagUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    return json({ error: "invalid id" }, 400);
  }
  const data = await db.select().from(tagTable).where(eq(tagTable.id, id));
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

  const res = TagUpdate.validate(await request.json());
  if (res.is_err()) {
    return json({ err: res.unwrap_err() }, 400);
  }

  const update = res.unwrap().getFirst();

  const data = await db
    .update(tagTable)
    .set(update)
    .where(eq(tagTable.id, id))
    .returning();

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
  await db.delete(tagTable).where(eq(tagTable.id, id));
  return json({ ok: "completed" });
};
