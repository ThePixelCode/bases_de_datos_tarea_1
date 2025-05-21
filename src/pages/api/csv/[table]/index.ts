import {
  developerTable,
  gameTable,
  gameToTagsTable,
  playerTable,
  playerToGameTable,
  tagTable,
} from "@/db/schema";
import { db } from "@/lib/database";
import { json } from "@/lib/responses";
import type { APIRoute } from "astro";
import { SQL, sql } from "drizzle-orm";

export const prerender = false;

function getTable(tableName: string): SQL<unknown> | undefined {
  switch (tableName) {
    case "player":
      return sql`${playerTable}`;
    case "game":
      return sql`${gameTable}`;
    case "developer":
      return sql`${developerTable}`;
    case "game_tag":
      return sql`${gameToTagsTable}`;
    case "player_game":
      return sql`${playerToGameTable}`;
    case "tag":
      return sql`${tagTable}`;
    default:
      return undefined;
  }
}

export const GET: APIRoute = async ({ params }) => {
  const sql_maybe_table = getTable(params.table ?? "");
  if (!sql_maybe_table) {
    return json({ error: "error" }, 400);
  }
  const data = await db.execute(
    sql`SELECT ROW_TO_JSON(T) FROM (SELECT * FROM ${sql_maybe_table}) T`,
  );
  const headers = Object.keys(data.rows[0].row_to_json as object).join(",");
  const rows = data.rows
    .map((row) => row.row_to_json)
    .map((row) =>
      Object.values(row as object)
        .map((value) =>
          value === null
            ? ""
            : typeof value === "string"
              ? `"${value.replace(/"/g, '""')}"`
              : value,
        )
        .join(","),
    )
    .join("\n");
  const csvContent = `${headers}\n${rows}`;
  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${params.table}.csv"`,
    },
  });
};
