import { friendshipTable } from "@/db/schema";
import { Friendship, FriendshipUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { error, json } from "@/lib/responses";
import { Result } from "@/lib/result";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({}) => {
  return json(await db.select().from(friendshipTable));
};

export const POST: APIRoute = async ({ request }) => {
  const res = await Result.tryAsyncArgs(
    async ({ request }) => {
      const res = FriendshipUpdate.validate(await request.json());
      if (res.is_err()) {
        return res.return_err<Friendship>();
      }

      const friendship = res.unwrap().getFirst();
      return (
        await db.insert(friendshipTable).values(friendship).returning()
      )[0];
    },
    { request },
  );
  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  return json(res.unwrap(), 201);
};
