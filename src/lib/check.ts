import { MaybeArr } from "./maybearray";
import { Result } from "./result";

export enum Errors {
  undefined,
  invalid,
}

export class TagUpdate {
  constructor(public name: string) {}

  public static isTag(value: any): value is TagUpdate {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "name") === "name" &&
      typeof value.name === "string"
    );
  }

  private static getOne(value: any): Result<TagUpdate, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (TagUpdate.isTag(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<TagUpdate>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => TagUpdate.getOne(val))).map(
        (ok) => MaybeArr.fromArray(ok),
      );
    }
    return TagUpdate.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class Tag {
  constructor(
    public id: number,
    public name: string,
  ) {}

  public static isTag(value: any): value is Tag {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "id") === "id" &&
      typeof value.id === "number" &&
      Object.keys(value).find((a) => a == "name") === "name" &&
      typeof value.name === "string"
    );
  }

  private static getOne(value: any): Result<Tag, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (Tag.isTag(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<Tag>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => Tag.getOne(val))).map((ok) =>
        MaybeArr.fromArray(ok),
      );
    }
    return Tag.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class DeveloperUpdate {
  constructor(public name: string) {}

  public static isDeveloper(value: any): value is DeveloperUpdate {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "name") === "name" &&
      typeof value.name === "string"
    );
  }

  private static getOne(value: any): Result<DeveloperUpdate, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (DeveloperUpdate.isDeveloper(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<DeveloperUpdate>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(
        value.map((val) => DeveloperUpdate.getOne(val)),
      ).map((ok) => MaybeArr.fromArray(ok));
    }
    return DeveloperUpdate.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class Developer {
  constructor(
    public id: number,
    public name: string,
  ) {}

  public static isDeveloper(value: any): value is Developer {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "id") === "id" &&
      typeof value.id === "number" &&
      Object.keys(value).find((a) => a == "name") === "name" &&
      typeof value.name === "string"
    );
  }

  private static getOne(value: any): Result<Developer, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (Developer.isDeveloper(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<Developer>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => Developer.getOne(val))).map(
        (ok) => MaybeArr.fromArray(ok),
      );
    }
    return Developer.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class GameUpdate {
  constructor(
    public name: string,
    public price: number,
    public developer: number,
    public publisher: number,
  ) {}

  public static isGame(value: any): value is GameUpdate {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "name") === "name" &&
      typeof value.name === "string" &&
      Object.keys(value).find((a) => a == "price") === "price" &&
      typeof value.price === "number" &&
      Object.keys(value).find((a) => a == "developer") === "developer" &&
      typeof value.developer === "number" &&
      Object.keys(value).find((a) => a == "publisher") === "publisher" &&
      typeof value.publisher === "number"
    );
  }

  private static getOne(value: any): Result<GameUpdate, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (GameUpdate.isGame(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<GameUpdate>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => GameUpdate.getOne(val))).map(
        (ok) => MaybeArr.fromArray(ok),
      );
    }
    return GameUpdate.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class Game {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public developer: number,
    public publisher: number,
  ) {}

  public static isGame(value: any): value is Game {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "id") === "id" &&
      typeof value.id === "number" &&
      Object.keys(value).find((a) => a == "name") === "name" &&
      typeof value.name === "string" &&
      Object.keys(value).find((a) => a == "price") === "price" &&
      typeof value.price === "number" &&
      Object.keys(value).find((a) => a == "developer") === "developer" &&
      typeof value.developer === "number" &&
      Object.keys(value).find((a) => a == "publisher") === "publisher" &&
      typeof value.publisher === "number"
    );
  }

  private static getOne(value: any): Result<Game, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (Game.isGame(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<Game>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => Game.getOne(val))).map((ok) =>
        MaybeArr.fromArray(ok),
      );
    }
    return Game.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class GameTagUpdate {
  constructor(
    public gameId: number,
    public tagId: number,
  ) {}

  public static isGameTag(value: any): value is GameTagUpdate {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "gameId") === "gameId" &&
      typeof value.gameId === "number" &&
      Object.keys(value).find((a) => a == "tagId") === "tagId" &&
      typeof value.tagId === "number"
    );
  }

  private static getOne(value: any): Result<GameTagUpdate, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (GameTagUpdate.isGameTag(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<GameTagUpdate>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => GameTagUpdate.getOne(val))).map(
        (ok) => MaybeArr.fromArray(ok),
      );
    }
    return GameTagUpdate.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class GameTag {
  constructor(
    public gameId: number,
    public tagId: number,
  ) {}

  public static isGameTag(value: any): value is GameTag {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "gameId") === "gameId" &&
      typeof value.gameId === "number" &&
      Object.keys(value).find((a) => a == "tagId") === "tagId" &&
      typeof value.tagId === "number"
    );
  }

  private static getOne(value: any): Result<GameTag, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (GameTag.isGameTag(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<GameTag>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => GameTag.getOne(val))).map((ok) =>
        MaybeArr.fromArray(ok),
      );
    }
    return GameTag.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class PlayerUpdate {
  constructor(public username: string) {}

  public static isPlayerUpdate(value: any): value is PlayerUpdate {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "username") === "username" &&
      typeof value.username === "string"
    );
  }

  private static getOne(value: any): Result<PlayerUpdate, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (PlayerUpdate.isPlayerUpdate(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<PlayerUpdate>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => PlayerUpdate.getOne(val))).map(
        (ok) => MaybeArr.fromArray(ok),
      );
    }
    return PlayerUpdate.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class Player {
  constructor(
    public id: number,
    public username: string,
  ) {}

  public static isPlayer(value: any): value is Player {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "id") === "id" &&
      typeof value.id === "number" &&
      Object.keys(value).find((a) => a == "username") === "username" &&
      typeof value.username === "string"
    );
  }

  private static getOne(value: any): Result<Player, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (Player.isPlayer(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<Player>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => Player.getOne(val))).map((ok) =>
        MaybeArr.fromArray(ok),
      );
    }
    return Player.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class PlayerGameUpdate {
  constructor(
    public gameId: number,
    public playerId: number,
    public playtime: string,
    public recommended: boolean | null,
    public review: string | null,
  ) {}

  public static isPlayerGameUpdate(value: any): value is PlayerGameUpdate {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "gameId") === "gameId" &&
      typeof value.gameId === "number" &&
      Object.keys(value).find((a) => a == "playerId") === "playerId" &&
      typeof value.playerId === "number" &&
      Object.keys(value).find((a) => a == "playtime") === "playtime" &&
      typeof value.playtime === "string" &&
      Object.keys(value).find((a) => a == "recommended") === "recommended" &&
      (typeof value.recommended === "boolean" ||
        (typeof value.recommended === "object" &&
          value.recommended === null)) &&
      Object.keys(value).find((a) => a == "review") === "review" &&
      (typeof value.review === "string" ||
        (typeof value.review === "object" && value.review === null))
    );
  }

  private static getOne(value: any): Result<PlayerGameUpdate, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (PlayerGameUpdate.isPlayerGameUpdate(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<PlayerGameUpdate>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(
        value.map((val) => PlayerGameUpdate.getOne(val)),
      ).map((ok) => MaybeArr.fromArray(ok));
    }
    return PlayerGameUpdate.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class PlayerGame {
  constructor(
    public id: number,
    public gameId: number,
    public playerId: number,
    public playtime: string,
    public recommended: boolean | null,
    public review: string | null,
  ) {}

  public static isPlayerGame(value: any): value is PlayerGame {
    if (typeof value !== "object") {
      return false;
    }
    return (
      Object.keys(value).find((a) => a == "id") === "id" &&
      typeof value.id === "number" &&
      Object.keys(value).find((a) => a == "gameId") === "gameId" &&
      typeof value.gameId === "number" &&
      Object.keys(value).find((a) => a == "playerId") === "playerId" &&
      typeof value.playerId === "number" &&
      Object.keys(value).find((a) => a == "playtime") === "playtime" &&
      typeof value.playtime === "string" &&
      Object.keys(value).find((a) => a == "recommended") === "recommended" &&
      (typeof value.recommended === "boolean" ||
        (typeof value.recommended === "object" &&
          value.recommended === null)) &&
      Object.keys(value).find((a) => a == "review") === "review" &&
      (typeof value.review === "string" ||
        (typeof value.review === "object" && value.review === null))
    );
  }

  private static getOne(value: any): Result<PlayerGame, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.undefined);
    }
    if (PlayerGame.isPlayerGame(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }

  static validate(value: any): Result<MaybeArr<PlayerGame>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((val) => PlayerGame.getOne(val))).map(
        (ok) => MaybeArr.fromArray(ok),
      );
    }
    return PlayerGame.getOne(value).map((ok) => MaybeArr.fromOne(ok));
  }
}

export class SavedPlayCreate {
  constructor(
    public files: {
      file: File;
      local_file: string;
      gamePlayerId: number;
    }[],
  ) {}

  private static isFiles(obj: any): obj is File[] {
    return Array.isArray(obj) && obj.every((o) => o instanceof File);
  }

  private static isLocation(obj: any): obj is string {
    return typeof obj === "string";
  }

  private static isGamePlayerId(obj: any): obj is string {
    return typeof obj === "string" && !isNaN(Number(obj));
  }

  public static fromFormData(
    formData: FormData,
    path_join: (...paths: string[]) => string,
  ): Result<SavedPlayCreate, Errors> {
    const files = formData.getAll("files");
    const location = formData.get("location");
    const gamePlayerIdString = formData.get("gamePlayerId");

    if (!SavedPlayCreate.isGamePlayerId(gamePlayerIdString)) {
      return Result.err(Errors.invalid);
    }
    const gamePlayerId = Number(gamePlayerIdString);
    if (!SavedPlayCreate.isLocation(location)) {
      return Result.err(Errors.invalid);
    }
    if (!SavedPlayCreate.isFiles(files)) {
      return Result.err(Errors.invalid);
    }

    let file_list: { file: File; local_file: string; gamePlayerId: number }[] =
      [];

    for (let i = 0; i < files.length; i++) {
      file_list[i] = {
        file: files[i],
        local_file: path_join(location, files[i].name),
        gamePlayerId,
      };
    }

    return Result.ok(new SavedPlayCreate(file_list));
  }
}

export class SavedPlayUpdate {
  constructor(
    public file: {
      file: File;
      local_file: string;
      gamePlayerId: number;
    },
  ) {}

  private static isFile(obj: any): obj is File {
    return obj instanceof File;
  }

  private static isLocation(obj: any): obj is string {
    return typeof obj === "string";
  }

  private static isGamePlayerId(obj: any): obj is string {
    return typeof obj === "string" && !isNaN(Number(obj));
  }

  public static fromFormData(
    formData: FormData,
    path_join: (...paths: string[]) => string,
  ): Result<SavedPlayUpdate, Errors> {
    const file = formData.get("file");
    const location = formData.get("location");
    const gamePlayerIdString = formData.get("gameToPlayerId");

    if (!SavedPlayUpdate.isGamePlayerId(gamePlayerIdString)) {
      return Result.err(Errors.invalid);
    }
    const gamePlayerId = Number(gamePlayerIdString);
    if (!SavedPlayUpdate.isLocation(location)) {
      return Result.err(Errors.invalid);
    }
    if (!SavedPlayUpdate.isFile(file)) {
      return Result.err(Errors.invalid);
    }

    let file_update: {
      file: File;
      local_file: string;
      gamePlayerId: number;
    } = {
      file,
      local_file: path_join(location, file.name),
      gamePlayerId,
    };

    return Result.ok(new SavedPlayUpdate(file_update));
  }
}

export class SavedPlay {
  constructor(
    public id: number,
    public gameToPlayerId: number,
    public local_file: string,
  ) {}
  private static isId(value: any): value is number {
    return typeof value === "number" && !isNaN(value);
  }
  private static isString(value: any): value is string {
    return typeof value === "string" && value !== "";
  }
  private static isSavedPlay(value: any): value is SavedPlay {
    if (
      SavedPlay.isId(value.id) &&
      SavedPlay.isId(value.gameToPlayerId) &&
      SavedPlay.isString(value.local_file)
    ) {
      return true;
    }
    return false;
  }
  private static getOne(value: any): Result<SavedPlay, Errors> {
    if (value === null || value === undefined) {
      return Result.err(Errors.invalid);
    }
    if (SavedPlay.isSavedPlay(value)) {
      return Result.ok(value);
    }
    return Result.err(Errors.invalid);
  }
  public static validate(value: any): Result<MaybeArr<SavedPlay>, Errors> {
    if (Array.isArray(value)) {
      return Result.collect(value.map((v) => SavedPlay.getOne(v))).map((v) =>
        MaybeArr.fromArray(v),
      );
    }
    return SavedPlay.getOne(value).map((v) => MaybeArr.fromOne(v));
  }
}
