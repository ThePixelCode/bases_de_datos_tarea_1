import { savedPlayTable } from "@/db/schema";
import { SavedPlayCreate } from "@/lib/check";
import { db } from "@/lib/database";
import { error, json } from "@/lib/responses";
import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";
import { Result } from "@/lib/result";
import { saveFile } from "@/lib/file";

export const prerender = false;
const SERVER_FILES = "./server_files/savedPlay_files";

export const GET: APIRoute = async ({}) => {
  return json(
    await db
      .select({
        id: savedPlayTable.id,
        gameToPlayerId: savedPlayTable.gameToPlayerId,
        local_file: savedPlayTable.local_file,
      })
      .from(savedPlayTable),
  );
};

export const POST: APIRoute = async ({ request }) => {
  const res = await Result.tryAsyncArgs(
    async ({ request }) => {
      await fs.mkdir(SERVER_FILES, { recursive: true });

      const formData = await request.formData();

      const savedPlayRes = SavedPlayCreate.fromFormData(formData, path.join);

      if (savedPlayRes.is_err()) {
        throw new Error("Bad format");
      }

      const savedPlay = savedPlayRes.unwrap();

      const results = await Promise.all(
        savedPlay.files.map((file) =>
          Result.tryAsyncArgs(
            async ({ file }) => {
              const saveFileRes = await saveFile(SERVER_FILES, file.file);

              if (saveFileRes.is_err()) {
                throw saveFileRes.unwrap_err();
              }

              const filePath = saveFileRes.unwrap();

              return {
                gameToPlayerId: file.gamePlayerId,
                server_file: filePath,
                local_file: file.local_file,
              };
            },
            { file },
          ),
        ),
      );

      const savedRes = Result.collect(results);

      if (savedRes.is_err()) {
        // TODO: some files failed so handle that
        throw savedRes.unwrap_err();
      }

      const saved = savedRes.unwrap();

      return await db.insert(savedPlayTable).values(saved).returning({
        id: savedPlayTable.id,
        gameToPlayerId: savedPlayTable.gameToPlayerId,
        local_file: savedPlayTable.local_file,
      });
    },
    { request },
  );

  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  return json(res.unwrap(), 201);
};
