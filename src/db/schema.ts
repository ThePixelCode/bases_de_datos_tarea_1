import { relations, sql } from "drizzle-orm";
import { boolean, check, integer, interval, jsonb, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";

export const developerTable = pgTable("DEVELOPERS_PUBLISHERS", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).unique().notNull(),
});

export const developerRelations = relations(developerTable, ({many}) => ({
  games: many(gameTable),
}));

export const gameTable = pgTable("GAMES", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).unique().notNull(),
  price: integer().notNull(),
  developer: integer().notNull().references(()=>developerTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  publisher: integer().notNull().references(()=>developerTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
});

export const gameRelations = relations(gameTable, ({one, many}) => ({
  publisher: one(developerTable, {
    fields: [gameTable.publisher],
    references: [developerTable.id],
  }),
  developer: one(developerTable, {
    fields: [gameTable.developer],
    references: [developerTable.id],
  }),
  gameToTags: many(gameToTagsTable),
}));

export const tagTable = pgTable("TAGS", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).unique().notNull(),
});

export const tagRelations = relations(tagTable, ({many}) => ({
  gameToTags: many(gameToTagsTable),
}));

export const gameToTagsTable = pgTable("GAMETOTAGS", {
  gameId: integer("game_id").notNull().references(()=>gameTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  tagId: integer("tag_id").notNull().references(()=>tagTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
}, (table) => [
  primaryKey({ columns: [table.gameId, table.tagId] }),
]);

export const gameToTagsRelations = relations(gameToTagsTable, ({one}) => ({
  game: one(gameTable, {
    fields: [gameToTagsTable.gameId],
    references: [gameTable.id],
  }),
  tag: one(tagTable, {
    fields: [gameToTagsTable.tagId],
    references: [tagTable.id],
  }),
}));

export const playerTable = pgTable("PLAYERS", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).unique().notNull(),
});

export const playerRelations = relations(playerTable, ({many})=>({
  playerToGame: many(playerToGameTable),
  user1: many(friendshipTable),
  user2: many(friendshipTable),
}));

export const playerToGameTable = pgTable("PLAYERTOGAMES", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  gameId: integer("game_id").notNull().references(()=>gameTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  playerId: integer("player_id").notNull().references(()=>playerTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  playtime: interval().notNull().default("0 seconds"),
  recommended: boolean(),
  review: text(),
}, (table) => [
  check("review", sql`(${table.review} IS NULL AND ${table.recommended} IS NULL) OR (${table.review} IS NOT NULL AND ${table.recommended} IS NOT NULL)`),
]);

export const playerToGameRelations = relations(playerToGameTable, ({one, many})=>({
  savePlays: many(savedPlayTable),
  player: one(playerTable, {
    fields: [playerToGameTable.playerId],
    references: [playerTable.id],
  }),
  game: one(gameTable, {
    fields: [playerToGameTable.gameId],
    references: [gameTable.id],
  }),
}))

export const savedPlayTable = pgTable("SAVEDPLAYS", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  gameToPlayerId: integer("game_to_player_id").notNull().references(()=>playerToGameTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  file: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
});

export const savedPlayRelations = relations(savedPlayTable, ({one})=>({
  gamePlayer: one(playerToGameTable, {
    fields: [savedPlayTable.gameToPlayerId],
    references: [playerToGameTable.id],
  }),
}));

export const friendshipTable = pgTable("FRIENDSHIP", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user1: integer("user1_id").notNull().references(()=>playerTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  user2: integer("user2_id").notNull().references(()=>playerTable.id, {onDelete: "cascade", onUpdate: "cascade"}),
  are_friends: boolean().notNull(),
  messages: jsonb().$type<{user: number, message: string}[]>().notNull(),
},(table)=>[
  check("messages", sql`validate_messages(${table.messages}, (ARRAY[${table.user1}::TEXT, ${table.user2}::TEXT])::TEXT[])`),
  check("users", sql`${table.user1} < ${table.user2}`),
]);

export const friendshipRelations = relations(friendshipTable, ({one})=>({
  user: one(playerTable, {
    fields: [friendshipTable.user1, friendshipTable.user2],
    references: [playerTable.id, playerTable.id],
  }),
}));
