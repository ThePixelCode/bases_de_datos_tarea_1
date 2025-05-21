import { fetchGames, fetchPlayers, fetchPlayerGames } from "@/lib/fetch";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GenericRemove from "../GenericRemove";
import EditPlayerGame from "../Edit/EditPlayerGame";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Duration } from "luxon";

export default function ShowGameTag() {
  const [
    { data: players, isError: isPlayerLoading, isLoading: isPlayerError },
    { data: games, isError: isGameLoading, isLoading: isGameError },
    {
      data: playerGames,
      isError: isPlayerGameLoading,
      isLoading: isPlayerGameError,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ["players"],
        queryFn: fetchPlayers,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["games"],
        queryFn: fetchGames,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["player_games"],
        queryFn: fetchPlayerGames,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  if (isPlayerError || isGameError || isPlayerGameError) {
    return <h1>TODO!!!</h1>;
  }

  if (isPlayerLoading || isGameLoading || isPlayerGameLoading) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Table>
      <TableCaption className="text-foreground">Tags present</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Game</TableHead>
          <TableHead>Player</TableHead>
          <TableHead>Playtime</TableHead>
          <TableHead>Recommended</TableHead>
          <TableHead>Review</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playerGames?.map((playerGame) => (
          <TableRow key={`player-game-${playerGame.id}`}>
            <TableCell>{playerGame.id}</TableCell>
            <TableCell>
              {games?.find((game) => playerGame.gameId === game.id)?.name}
            </TableCell>
            <TableCell>
              {
                players?.find((player) => playerGame.playerId === player.id)
                  ?.username
              }
            </TableCell>
            <TableCell>
              {Duration.fromISO(playerGame.playtime).toHuman()}
            </TableCell>
            <TableCell>
              {playerGame.recommended === null ? (
                "NULL"
              ) : playerGame.recommended ? (
                <ThumbsUp size={22} color="blue" />
              ) : (
                <ThumbsDown size={22} color="red" />
              )}
            </TableCell>
            <TableCell>
              {playerGame.review === null ? "NULL" : playerGame.review}
            </TableCell>
            <TableCell className="grid grid-cols-2 gap-2">
              <EditPlayerGame id={playerGame.id} />
              <GenericRemove
                url={`/api/player_game/${playerGame.id}`}
                queryKey={[["player_game", playerGame.id], ["player_games"]]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
