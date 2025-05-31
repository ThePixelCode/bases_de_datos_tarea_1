import { json } from "@/lib/responses";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({}) => {
  return json([
    "tag",
    "player",
    "game",
    "developer",
    "savedplay",
    "friendship",
    "gametotags",
    "playertogame",
  ]);
};
