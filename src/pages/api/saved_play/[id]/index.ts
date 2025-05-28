import { savedPlayTable } from "@/db/schema";
import { SavedPlayUpdate } from "@/lib/check";
import { db } from "@/lib/database";
import { isSameFile, saveFile } from "@/lib/file";
import { error, json } from "@/lib/responses";
import { Result } from "@/lib/result";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export const prerender = false;
const SERVER_FILES = "./server_files/savedPlay_files";

export const GET: APIRoute = async ({ params }) => {
  const res = await Result.tryAsyncArgs(
    async ({ params }) => {
      const id = Number(params.id);
      if (isNaN(id)) {
        throw new Error("Invalid id");
      }

      const res = await db
        .select({
          id: savedPlayTable.id,
          gameToPlayerId: savedPlayTable.gameToPlayerId,
          local_file: savedPlayTable.local_file,
        })
        .from(savedPlayTable)
        .where(eq(savedPlayTable.id, id));

      if (res.length === 0) {
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

      const currentSavedPlays = await db
        .select()
        .from(savedPlayTable)
        .where(eq(savedPlayTable.id, id));
      if (currentSavedPlays.length !== 1) {
        throw new Error("Not found");
      }
      const currentSavedPlay = currentSavedPlays[0];
      const newSavedPlay: Partial<{
        id: number;
        gameToPlayerId: number;
        server_file: string;
        local_file: string;
      }> = {};

      const formData = await request.formData();
      const savedPlayRes = SavedPlayUpdate.fromFormData(formData, path.join);
      if (savedPlayRes.is_err()) {
        throw new Error("Bad Data");
      }
      const savedPlay = savedPlayRes.unwrap().file;
      newSavedPlay.gameToPlayerId = savedPlay.gamePlayerId;
      newSavedPlay.local_file = savedPlay.local_file;
      const buffer = Buffer.from(await savedPlay.file.arrayBuffer());
      if (!(await isSameFile(currentSavedPlay.server_file, buffer))) {
        const res = await saveFile(SERVER_FILES, savedPlay.file);
        if (res.is_err()) {
          throw res.unwrap_err();
        }
        newSavedPlay.server_file = res.unwrap();
      } else {
        newSavedPlay.server_file = currentSavedPlay.server_file;
      }

      return await db
        .update(savedPlayTable)
        .set(newSavedPlay)
        .where(eq(savedPlayTable.id, id))
        .returning({
          id: savedPlayTable.id,
          gameToPlayer: savedPlayTable.gameToPlayerId,
          local_file: savedPlayTable.local_file,
        });
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
        .delete(savedPlayTable)
        .where(eq(savedPlayTable.id, id))
        .returning();
      if (res.length === 0) {
        throw new Error("Not found");
      }

      const others = await db
        .select()
        .from(savedPlayTable)
        .where(eq(savedPlayTable.server_file, res[0].server_file));

      if (others.length === 0) {
        await fs.rm(res[0].server_file);
      }

      return {
        id: res[0].id,
        gameToPlayerId: res[0].gameToPlayerId,
        local_file: res[0].local_file,
      };
    },
    { params },
  );

  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  return json(res.unwrap());
};
