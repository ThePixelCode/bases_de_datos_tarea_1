import { friendshipTable } from "@/db/schema";
import { FriendshipUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { error, json } from "@/lib/responses";
import { Result } from "@/lib/result";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const res = await Result.tryAsyncArgs(
    async ({ params }) => {
      const id = Number(params.id);
      if (isNaN(id)) {
        throw new Error("Invalid id");
      }

      const res = await db
        .select()
        .from(friendshipTable)
        .where(eq(friendshipTable.id, id));
      if (res.length !== 1) {
        throw new Error("Not found");
      }
      return res[0];
    },
    { params },
  );
  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  return json(res.unwrap());
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const res = await Result.tryAsyncArgs(
    async ({ params, request }) => {
      const id = Number(params.id);
      if (isNaN(id)) {
        throw new Error("Invalid id");
      }

      const data = FriendshipUpdate.validate(await request.json());
      if (data.is_err()) {
        throw data.unwrap_err();
      }
      const update = data.unwrap().getFirst();

      const res = await db
        .update(friendshipTable)
        .set(update)
        .where(eq(friendshipTable.id, id))
        .returning();

      if (res.length !== 1) {
        throw new Error("Not found");
      }

      return res[0];
    },
    { params, request },
  );
  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  return json(res.unwrap());
};

export const DELETE: APIRoute = async ({ params }) => {
  const res = await Result.tryAsyncArgs(
    async ({ params }) => {
      const id = Number(params.id);
      if (isNaN(id)) {
        throw new Error("Invalid id");
      }

      const res = await db
        .delete(friendshipTable)
        .where(eq(friendshipTable.id, id))
        .returning();
      console.log(res);
      if (res.length !== 1) {
        throw new Error("Not found");
      }
      return res[0];
    },
    { params },
  );

  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  return json(res.unwrap());
};
