import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Game, Player, PlayerGame } from "@/lib/check";
import {
  fetchGames,
  fetchPlayerGames,
  fetchPlayers,
  fetchSavedPlays,
  STALE_TIME,
} from "@/lib/fetch";
import { useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import GenericRemove from "../GenericRemove";
import EditSavePlay from "../Edit/EditSavePlay";

export default function ShowSavePlay() {
  const [
    {
      isError: isPlayGameError,
      isLoading: isPlayGameLoading,
      data: playerGames,
    },
    { isError: isGameError, isLoading: isGameLoading, data: games },
    { isError: isPlayError, isLoading: isPlayLoading, data: players },
    {
      isError: isSavedPlayError,
      isLoading: isSavedPlayLoading,
      data: savedPlays,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ["player_games"],
        queryFn: fetchPlayerGames,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["games"],
        queryFn: fetchGames,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["players"],
        queryFn: fetchPlayers,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["saved_plays"],
        queryFn: fetchSavedPlays,
        staleTime: STALE_TIME,
      },
    ],
  });
  if (isGameError && isPlayError && isPlayGameError && isSavedPlayError) {
    return <h1>TODO</h1>;
  }
  if (
    isGameLoading &&
    isPlayLoading &&
    isPlayGameLoading &&
    isSavedPlayLoading
  ) {
    return <h1>TODO</h1>;
  }
  if (
    games === undefined ||
    players === undefined ||
    playerGames === undefined ||
    savedPlays === undefined
  ) {
    return <h1>TODO</h1>;
  }
  return (
    <Table>
      <TableCaption className="text-foreground">
        SavedGames present
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>GameToPlayer</TableHead>
          <TableHead>LocalFile</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {savedPlays.map((savedPlay) => {
          const gamePlay = playerGames.find(
            (gamePlay) => gamePlay.id === savedPlay.gameToPlayerId,
          ) as PlayerGame;
          const game = games.find(
            (game) => game.id === gamePlay.gameId,
          ) as Game;
          const player = players.find(
            (player) => player.id === gamePlay.playerId,
          ) as Player;
          return (
            <TableRow key={"savedPlay-id-" + savedPlay.id}>
              <TableCell>{savedPlay.id}</TableCell>
              <TableCell>{`${player.username}-${game.name}`}</TableCell>
              <TableCell>{savedPlay.local_file}</TableCell>
              <TableCell>
                <Button
                  variant={"neutral"}
                  onClick={() => {
                    const download = async () => {
                      try {
                        const res = await fetch(
                          `/api/saved_play/${savedPlay.id}/file`,
                          {
                            method: "GET",
                          },
                        );
                        const data = await res.text();

                        const blob = new Blob([data], {
                          type: res.headers.get("Content-Type") as string,
                        });
                        const url = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = decodeURIComponent(
                          (
                            res.headers.get("Content-Disposition") as string
                          ).replace("attachment; filename*=UTF-8'", ""),
                        );
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch {
                        toast.error("Error");
                      }
                    };

                    download();
                  }}
                >
                  here
                </Button>
              </TableCell>
              <TableCell className="grid grid-cols-2 gap-2">
                <EditSavePlay id={savedPlay.id} />
                <GenericRemove
                  url={`/api/saved_play/${savedPlay.id}`}
                  queryKey={[["saved_play", savedPlay.id], ["saved_plays"]]}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
