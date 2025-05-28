import { savedPlayTable } from "@/db/schema";
import { db } from "@/lib/database";
import {
  getFileExtension,
  getFileName,
  getMIMEType,
  readFile,
} from "@/lib/file";
import { error } from "@/lib/responses";
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

      const dataRes = await db
        .select({
          server_file: savedPlayTable.server_file,
          local_file: savedPlayTable.local_file,
        })
        .from(savedPlayTable)
        .where(eq(savedPlayTable.id, id));
      if (dataRes.length === 0) {
        throw new Error("Not found");
      }

      const { local_file, server_file } = dataRes[0];
      const filename = getFileName(local_file);
      const contentType = getMIMEType(getFileExtension(filename).unwrap());
      const { data, length } = (await readFile(server_file)).unwrap();
      return { data, filename, contentType, length };
    },
    { params },
  );
  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  const { data, contentType, filename, length } = res.unwrap();
  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Content-Length": length.toString(),
    },
  });
};
