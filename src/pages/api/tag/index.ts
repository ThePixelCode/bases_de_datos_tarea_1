import { tagTable } from "@/db/schema";
import { TagUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return json(await db.select().from(tagTable));
};

export const POST: APIRoute = async ({ request }) => {
  const newTagRes = TagUpdate.validate(await request.json());
  if (newTagRes.is_err()) {
    return json({ error: `invalid: ${newTagRes.unwrap_err()}` }, 400);
  }
  const newTag = newTagRes.unwrap().getFirst();

  const tag = await db.insert(tagTable).values(newTag).returning();

  return json(tag[0], 201);
};
