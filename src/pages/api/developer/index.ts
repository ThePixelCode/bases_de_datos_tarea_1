import { developerTable } from "@/db/schema";
import { DeveloperUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  return json(await db.select().from(developerTable));
};

export const POST: APIRoute = async ({ request }) => {
  const newDeveloperRes = DeveloperUpdate.validate(await request.json());
  if (newDeveloperRes.is_err()) {
    return json({ error: `invalid: ${newDeveloperRes.unwrap_err()}` }, 400);
  }
  const newDeveloper = newDeveloperRes.unwrap().getFirst();

  const data = await db.insert(developerTable).values(newDeveloper).returning();

  return json(data[0], 201);
};
