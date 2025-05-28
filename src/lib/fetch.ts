import {
  Developer,
  Game,
  GameTag,
  Player,
  PlayerGame,
  SavedPlay,
  Tag,
} from "./check";

export const STALE_TIME: number = 5 * 60 * 1000;

export function fetchDeveloper(id: number): () => Promise<Developer> {
  return async () => {
    const response = await fetch(`/api/developer/${id}`);
    if (!response.ok) {
      throw new Error(`Error status ${response.status}`);
    }

    const json = Developer.validate(await response.json());

    if (json.is_err()) {
      throw new Error("TODO");
    }

    return json.unwrap().getFirst();
  };
}

export function fetchGame(id: number): () => Promise<Game> {
  return async () => {
    const response = await fetch(`/api/game/${id}`);
    if (!response.ok) {
      throw new Error(`Error status ${response.status}`);
    }

    const json = Game.validate(await response.json());

    if (json.is_err()) {
      throw new Error("TODO");
    }

    return json.unwrap().getFirst();
  };
}

export function fetchTag(id: number): () => Promise<Tag> {
  return async () => {
    const response = await fetch(`/api/tag/${id}`);
    if (!response.ok) {
      throw new Error(`Error status ${response.status}`);
    }

    const json = Tag.validate(await response.json());

    if (json.is_err()) {
      throw new Error("TODO");
    }

    return json.unwrap().getFirst();
  };
}

export function fetchPlayer(id: number): () => Promise<Player> {
  return async () => {
    const response = await fetch(`/api/player/${id}`);
    if (!response.ok) {
      throw new Error(`Error status ${response.status}`);
    }

    const json = Player.validate(await response.json());

    if (json.is_err()) {
      throw new Error("TODO");
    }

    return json.unwrap().getFirst();
  };
}

export function fetchGameTag(
  gameId: number,
  tagId: number,
): () => Promise<GameTag> {
  return async () => {
    const response = await fetch(`/api/game_tag/${gameId}/${tagId}`);
    if (!response.ok) {
      throw new Error(`Error status ${response.status}`);
    }

    const json = GameTag.validate(await response.json());

    if (json.is_err()) {
      throw new Error("TODO");
    }

    return json.unwrap().getFirst();
  };
}

export function fetchPlayerGame(id: number): () => Promise<PlayerGame> {
  return async () => {
    const response = await fetch(`/api/player_game/${id}`);
    if (!response.ok) {
      throw new Error(`Error status ${response.status}`);
    }

    const json = PlayerGame.validate(await response.json());

    if (json.is_err()) {
      throw new Error("TODO");
    }

    return json.unwrap().getFirst();
  };
}

export function fetchSavedPlay(id: number): () => Promise<SavedPlay> {
  return async () => {
    const response = await fetch(`/api/saved_play/${id}`);
    if (!response.ok) {
      throw new Error(`Error status ${response.status}`);
    }

    const json = SavedPlay.validate(await response.json());

    if (json.is_err()) {
      throw new Error("TODO");
    }

    return json.unwrap().getFirst();
  };
}

export async function fetchDevelopers(): Promise<Developer[]> {
  const response = await fetch("/api/developer");
  if (!response.ok) {
    throw new Error(`Error status ${response.status}`);
  }

  const json = Developer.validate(await response.json());

  if (json.is_err()) {
    throw new Error("TODO");
  }

  return json.unwrap().toArray();
}

export async function fetchGames(): Promise<Game[]> {
  const response = await fetch("/api/game");
  if (!response.ok) {
    throw new Error(`Error status ${response.status}`);
  }

  const json = Game.validate(await response.json());

  if (json.is_err()) {
    throw new Error("TODO");
  }

  return json.unwrap().toArray();
}

export async function fetchTags(): Promise<Tag[]> {
  const response = await fetch("/api/tag");
  if (!response.ok) {
    throw new Error(`Error status ${response.status}`);
  }

  const json = Tag.validate(await response.json());

  if (json.is_err()) {
    throw new Error("TODO");
  }

  return json.unwrap().toArray();
}

export async function fetchPlayers(): Promise<Player[]> {
  const response = await fetch("/api/player");
  if (!response.ok) {
    throw new Error(`Error status ${response.status}`);
  }

  const json = Player.validate(await response.json());

  if (json.is_err()) {
    throw new Error("TODO");
  }

  return json.unwrap().toArray();
}

export async function fetchGameTags(): Promise<GameTag[]> {
  const response = await fetch("/api/game_tag");
  if (!response.ok) {
    throw new Error(`Error status ${response.status}`);
  }

  const json = GameTag.validate(await response.json());

  if (json.is_err()) {
    throw new Error("TODO");
  }

  return json.unwrap().toArray();
}

export async function fetchPlayerGames(): Promise<PlayerGame[]> {
  const response = await fetch("/api/player_game");
  if (!response.ok) {
    throw new Error(`Error status ${response.status}`);
  }

  const json = PlayerGame.validate(await response.json());

  if (json.is_err()) {
    throw new Error("TODO");
  }

  return json.unwrap().toArray();
}

export async function fetchSavedPlays(): Promise<SavedPlay[]> {
  const response = await fetch("/api/saved_play");
  if (!response.ok) {
    throw new Error(`Error status ${response.status}`);
  }

  const json = SavedPlay.validate(await response.json());

  if (json.is_err()) {
    throw new Error("TODO");
  }

  return json.unwrap().toArray();
}
