import {
  tagTable,
  playerTable,
  gameTable,
  developerTable,
  savedPlayTable,
  friendshipTable,
  gameToTagsTable,
  playerToGameTable,
} from "@/db/schema";
import { sql, type SQL } from "drizzle-orm";
import { db } from "./database";

export type TableName =
  | "tag"
  | "player"
  | "game"
  | "developer"
  | "savedplay"
  | "friendship"
  | "gametotags"
  | "playertogame";

type ROW<T, K, S> = {
  table: T;
  keys: K;
  select: S;
  rowToCSV: (row: S) => string;
};
type Developer = ROW<
  typeof developerTable,
  ["id", "name"],
  typeof developerTable.$inferSelect
>;
type Friendship = ROW<
  typeof friendshipTable,
  ["id", "user1_id", "user2_id", "are_friends", "messages"],
  {
    id: number;
    user1_id: number;
    user2_id: number;
    are_friends: boolean;
    messages: {
      user: number;
      message: string;
    }[];
  }
>;
type Game = ROW<
  typeof gameTable,
  ["id", "name", "price", "developer", "publisher"],
  typeof gameTable.$inferSelect
>;
type GameToTag = ROW<
  typeof gameToTagsTable,
  ["game_id", "tag_id"],
  {
    game_id: number;
    tag_id: number;
  }
>;
type Player = ROW<
  typeof playerTable,
  ["id", "username"],
  typeof playerTable.$inferSelect
>;
type PlayerToGame = ROW<
  typeof playerToGameTable,
  ["id", "game_id", "player_id", "playtime", "recommended", "review"],
  {
    id: number;
    game_id: number;
    player_id: number;
    playtime: string;
    recommended: boolean | null;
    review: string | null;
  }
>;
type Savedplay = ROW<
  typeof savedPlayTable,
  ["id", "game_to_player_id", "server_file", "local_file"],
  {
    id: number;
    game_to_player_id: number;
    server_file: string;
    local_file: string;
  }
>;
type Tag = ROW<typeof tagTable, ["id", "name"], typeof tagTable.$inferSelect>;
type Tables = {
  developer: Developer;
  friendship: Friendship;
  game: Game;
  gametotags: GameToTag;
  player: Player;
  playertogame: PlayerToGame;
  savedplay: Savedplay;
  tag: Tag;
};

const TABLE: Tables = {
  developer: {
    table: developerTable,
    select: developerTable.$inferSelect,
    keys: ["id", "name"],
    rowToCSV: (row) => `${row.id},"${row.name.replace(/"/g, '""')}"`,
  },
  friendship: {
    table: friendshipTable,
    select: undefined as unknown as {
      id: number;
      user1_id: number;
      user2_id: number;
      are_friends: boolean;
      messages: {
        user: number;
        message: string;
      }[];
    },
    keys: ["id", "user1_id", "user2_id", "are_friends", "messages"],
    rowToCSV: (row) =>
      `${row.id},${row.user1_id},${row.user2_id},${row.are_friends},"${JSON.stringify(row.messages).replace(/"/g, '""')}"`,
  },
  game: {
    table: gameTable,
    select: gameTable.$inferSelect,
    keys: ["id", "name", "price", "developer", "publisher"],
    rowToCSV: (row) =>
      `${row.id},"${row.name.replace(/"/g, '""')}",${row.price},${row.developer},${row.publisher}`,
  },
  gametotags: {
    table: gameToTagsTable,
    select: undefined as unknown as {
      game_id: number;
      tag_id: number;
    },
    keys: ["game_id", "tag_id"],
    rowToCSV: (row) => `${row.game_id},${row.game_id}`,
  },
  player: {
    table: playerTable,
    select: playerTable.$inferSelect,
    keys: ["id", "username"],
    rowToCSV: (row) => `${row.id},"${row.username.replace(/"/g, '""')}"`,
  },
  playertogame: {
    table: playerToGameTable,
    select: undefined as unknown as {
      id: number;
      game_id: number;
      player_id: number;
      playtime: string;
      recommended: boolean | null;
      review: string | null;
    },
    keys: ["id", "game_id", "player_id", "playtime", "recommended", "review"],
    rowToCSV: (row) =>
      `${row.id},${row.game_id},${row.player_id},"${row.playtime.replace(/"/g, '""')}",${row.recommended === null ? "" : row.recommended},"${row.review === null ? "" : row.review.replace(/"/g, '""')}"`,
  },
  savedplay: {
    table: savedPlayTable,
    select: undefined as unknown as {
      id: number;
      game_to_player_id: number;
      server_file: string;
      local_file: string;
    },
    keys: ["id", "game_to_player_id", "server_file", "local_file"],
    rowToCSV: (row) =>
      `${row.id},${row.game_to_player_id},"${row.server_file.replace(/"/g, '""')}","${row.local_file.replace(/"/g, '""')}"`,
  },
  tag: {
    table: tagTable,
    select: tagTable.$inferSelect,
    keys: ["id", "name"],
    rowToCSV: (row) => `${row.id},"${row.name.replace(/"/g, '""')}"`,
  },
};

export function toTableName(value: any): TableName | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  return [
    "tag",
    "player",
    "game",
    "developer",
    "savedplay",
    "friendship",
    "gametotags",
    "playertogame",
  ].find((table) => table === value.toLowerCase()) as TableName | undefined;
}

function tableToSql<K extends keyof Tables>(tableName: K): Tables[K]["table"] {
  return TABLE[tableName].table;
}

function tableNameToJSONSql<K extends keyof Tables>(
  tableName: K,
): SQL<Tables[K]["select"]> {
  return sql<Tables[K]["select"]>`ROW_TO_JSON(${tableToSql(tableName)})`;
}

export async function tableToJSON<K extends keyof Tables>(
  tableName: K,
): Promise<Tables[K]["select"][]> {
  return (
    await db
      .select({
        row_to_json: tableNameToJSONSql(tableName),
      })
      .from(TABLE[tableName].table)
  ).map(({ row_to_json }) => row_to_json);
}

function getKeys<K extends keyof Tables>(tableName: K): Tables[K]["keys"] {
  return TABLE[tableName].keys;
}

export async function tableToCSV<K extends keyof Tables>(
  tableName: K,
): Promise<string> {
  const keys = getKeys(tableName);
  const headers = keys.join(",") + "\n";
  const json = await tableToJSON(tableName);
  const rows = json
    .map((row) => TABLE[tableName].rowToCSV(row as any))
    .join("\n");
  return `${headers}${rows}`;
}

export async function tableToXML<K extends keyof Tables>(
  tableName: K,
): Promise<string> {
  switch (tableName) {
    case "developer":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "DEVELOPERS_PUBLISHERS", XMLAGG(xmlelement(name "DEVELOPER_PUBLISHER", xmlforest(${developerTable.id}, ${developerTable.name}))))`,
          })
          .from(developerTable)
      )[0].xmlelement;
    case "friendship":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "FRIENDSHIPS", XMLAGG(xmlelement(name "FRIENDSHIP", xmlforest(${friendshipTable.id}, ${friendshipTable.user1}, ${friendshipTable.user2}, ${friendshipTable.are_friends}), (xmlelement(name "messages", (select XMLAGG(xmlelement(name "message", xmlattributes((M->>'user')::int as "user"), (M->>'message'))) from jsonb_array_elements(${friendshipTable.messages}) as M))))))`,
          })
          .from(friendshipTable)
      )[0].xmlelement;
    case "game":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "GAMES", XMLAGG(xmlelement(name "GAME", xmlforest(${gameTable.id}, ${gameTable.name}, ${gameTable.price}, ${gameTable.developer}, ${gameTable.publisher}))))`,
          })
          .from(gameTable)
      )[0].xmlelement;
    case "gametotags":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "GAMETOTAGS", XMLAGG(xmlelement(name "GAMETOTAG", xmlforest(${gameToTagsTable.gameId}, ${gameToTagsTable.tagId}))))`,
          })
          .from(gameToTagsTable)
      )[0].xmlelement;
    case "player":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "PLAYERS", XMLAGG(xmlelement(name "PLAYER", xmlforest(${playerTable.id}, ${playerTable.username}))))`,
          })
          .from(playerTable)
      )[0].xmlelement;
    case "playertogame":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "PLAYERTOGAMES", XMLAGG(xmlelement(name "PLAYERTOGAME", xmlforest(${playerToGameTable.id}, ${playerToGameTable.gameId}, ${playerToGameTable.playerId}, ${playerToGameTable.playtime}, ${playerToGameTable.recommended}, ${playerToGameTable.review}))))`,
          })
          .from(playerToGameTable)
      )[0].xmlelement;
    case "savedplay":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "SAVEDPLAYS", XMLAGG(xmlelement(name "SAVEDPLAY", xmlforest(${savedPlayTable.id}, ${savedPlayTable.gameToPlayerId}, ${savedPlayTable.server_file}, ${savedPlayTable.local_file}))))`,
          })
          .from(savedPlayTable)
      )[0].xmlelement;
    case "tag":
      return (
        await db
          .select({
            xmlelement: sql<string>`xmlelement(name "TAGS", XMLAGG(xmlelement(name "TAG", xmlforest(${tagTable.id}, ${tagTable.name}))))`,
          })
          .from(tagTable)
      )[0].xmlelement;
  }
}
