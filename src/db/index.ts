import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  playerTable,
  savedPlayTable,
  tagTable,
  gameTable,
  gameToTagsTable,
  developerTable,
  playerToGameTable,
  friendshipTable,
} from "./schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

type Player = typeof playerTable.$inferInsert;
type SavedPlay = typeof savedPlayTable.$inferInsert;
type Tag = typeof tagTable.$inferInsert;
type Game = typeof gameTable.$inferInsert;
type GameTags = typeof gameToTagsTable.$inferInsert;
type Developer = typeof developerTable.$inferInsert;
type PlayerGame = typeof playerToGameTable.$inferInsert;
type Friendship = typeof friendshipTable.$inferInsert;

async function main() {
  const tags: Tag[] = [
    { name: "RPG" },
    { name: "FPS" },
    { name: "Strategy" },
    { name: "Management" },
  ];

  await db.insert(tagTable).values(tags);
  const tag = {
    rpg: (await db.select().from(tagTable).where(eq(tagTable.name, "RPG")))[0]
      .id,
    fps: (await db.select().from(tagTable).where(eq(tagTable.name, "FPS")))[0]
      .id,
    strategy: (
      await db.select().from(tagTable).where(eq(tagTable.name, "Strategy"))
    )[0].id,
    management: (
      await db.select().from(tagTable).where(eq(tagTable.name, "Management"))
    )[0].id,
  };
  console.log(tag);

  const developers: Developer[] = [
    {
      name: "Paradox Interactive",
    },
    {
      name: "Bethesda",
    },
    {
      name: "Sony",
    },
    {
      name: "Wube Software",
    },
    {
      name: "Arrowhead",
    },
    {
      name: "Hello Games",
    },
  ];

  await db.insert(developerTable).values(developers);
  const devs = {
    paradox: (
      await db
        .select()
        .from(developerTable)
        .where(eq(developerTable.name, "Paradox Interactive"))
    )[0].id,
    sony: (
      await db
        .select()
        .from(developerTable)
        .where(eq(developerTable.name, "Sony"))
    )[0].id,
    wube: (
      await db
        .select()
        .from(developerTable)
        .where(eq(developerTable.name, "Wube Software"))
    )[0].id,
    bethesda: (
      await db
        .select()
        .from(developerTable)
        .where(eq(developerTable.name, "Bethesda"))
    )[0].id,
    arrowhead: (
      await db
        .select()
        .from(developerTable)
        .where(eq(developerTable.name, "Arrowhead"))
    )[0].id,
    hello: (
      await db
        .select()
        .from(developerTable)
        .where(eq(developerTable.name, "Hello Games"))
    )[0].id,
  };
  console.log(devs);

  const players: Player[] = [
    {
      username: "martincitopants",
    },
    {
      username: "ambiguousamphibian",
    },
    {
      username: "DoshDoshington",
    },
  ];

  await db.insert(playerTable).values(players);
  const player = {
    dosh: (
      await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.username, "DoshDoshington"))
    )[0].id,
    ambiguous: (
      await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.username, "ambiguousamphibian"))
    )[0].id,
    martin: (
      await db
        .select()
        .from(playerTable)
        .where(eq(playerTable.username, "martincitopants"))
    )[0].id,
  };
  console.log(player);

  const games: Game[] = [
    {
      name: "Factorio",
      developer: devs.wube,
      publisher: devs.wube,
      price: 80_000,
    },
    {
      name: "Hearts of Iron 4",
      developer: devs.paradox,
      publisher: devs.paradox,
      price: 157_600,
    },
    {
      name: "Victoria 2",
      developer: devs.paradox,
      publisher: devs.paradox,
      price: 63_100,
    },
    {
      name: "Stellaris",
      developer: devs.paradox,
      publisher: devs.paradox,
      price: 126_100,
    },
    {
      name: "Fallout 4",
      developer: devs.bethesda,
      publisher: devs.bethesda,
      price: 60_000,
    },
    {
      name: "Helldivers 2",
      developer: devs.arrowhead,
      publisher: devs.sony,
      price: 149_000,
    },
    {
      name: "No Man's Sky",
      developer: devs.hello,
      publisher: devs.hello,
      price: 130_000,
    },
  ];

  await db.insert(gameTable).values(games);
  const game = {
    factorio: (
      await db.select().from(gameTable).where(eq(gameTable.name, "Factorio"))
    )[0].id,
    hoi: (
      await db
        .select()
        .from(gameTable)
        .where(eq(gameTable.name, "Hearts of Iron 4"))
    )[0].id,
    fallout: (
      await db.select().from(gameTable).where(eq(gameTable.name, "Fallout 4"))
    )[0].id,
    stellaris: (
      await db.select().from(gameTable).where(eq(gameTable.name, "Stellaris"))
    )[0].id,
    victoria: (
      await db.select().from(gameTable).where(eq(gameTable.name, "Victoria 2"))
    )[0].id,
    helldivers: (
      await db
        .select()
        .from(gameTable)
        .where(eq(gameTable.name, "Helldivers 2"))
    )[0].id,
    nms: (
      await db
        .select()
        .from(gameTable)
        .where(eq(gameTable.name, "No Man's Sky"))
    )[0].id,
  };
  console.log(game);
  
  const gameTags: GameTags[] = [
    {
      gameId: game.factorio,
      tagId: tag.management,
    },
    {
      gameId: game.factorio,
      tagId: tag.strategy,
    },
    {
      gameId: game.hoi,
      tagId: tag.strategy,
    },
  ];

  await db.insert(gameToTagsTable).values(gameTags);
  console.log(await db.select().from(gameToTagsTable));

  const playerGames: PlayerGame[] = [
    {
      gameId: game.factorio,
      playerId: player.dosh,
    },
    {
      gameId: game.factorio,
      playerId: player.martin,
    },
    {
      gameId: game.factorio,
      playerId: player.ambiguous,
    },
  ];

  await db.insert(playerToGameTable).values(playerGames);
  console.log(await db.select().from(playerToGameTable));

  const savedPlays: SavedPlay[] = [
    {
      link: "/saves/3/1/SeaBlock.zip",
      gameToPlayerId: 1,
      file: "/saves/SeaBlock.zip",
    },
    {
      link: "/saves/1/1/SeaBlock.zip",
      gameToPlayerId: 3,
      file: "/saves/SeaBlock.zip",
    },
  ];

  await db.insert(savedPlayTable).values(savedPlays);
  console.log(await db.select().from(savedPlayTable));

  const friendships: Friendship[] = [
    {
      user1: 1,
      user2: 2,
      are_friends: true,
      messages: [
        {
          user: 1,
          message: "Hello!",
        },
        {
          user: 1,
          message: "How are you?"
        },
        {
          user: 2,
          message: "Fine!",
        },
      ],
    }
  ];

  await db.insert(friendshipTable).values(friendships);
  console.log(await db.select().from(friendshipTable));
}

main();
