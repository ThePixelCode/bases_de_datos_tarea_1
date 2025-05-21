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
