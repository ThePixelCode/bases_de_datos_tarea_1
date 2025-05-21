import { fetchTags, fetchGames, fetchGameTags } from "@/lib/fetch";

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
import EditGameTag from "../Edit/EditGameTag";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function ShowGameTag() {
  const [
    { data: tags, isError: isTagLoading, isLoading: isTagError },
    { data: games, isError: isGameLoading, isLoading: isGameError },
    { data: gameTags, isError: isGameTagLoading, isLoading: isGameTagError },
  ] = useQueries({
    queries: [
      {
        queryKey: ["tags"],
        queryFn: fetchTags,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["games"],
        queryFn: fetchGames,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["game_tags"],
        queryFn: fetchGameTags,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  if (isTagError || isGameError || isGameTagError) {
    return <h1>TODO!!!</h1>;
  }

  if (isTagLoading || isGameLoading || isGameTagLoading) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Table>
      <TableCaption className="text-foreground">Tags present</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Game</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gameTags?.map((gameTag) => (
          <TableRow key={`tag-${gameTag.tagId}-game-${gameTag.gameId}`}>
            <TableCell>
              {games?.find((game) => gameTag.gameId === game.id)?.name}
            </TableCell>
            <TableCell>
              {tags?.find((tag) => gameTag.tagId === tag.id)?.name}
            </TableCell>
            <TableCell className="grid grid-cols-2 gap-2">
              <EditGameTag gameId={gameTag.gameId} tagId={gameTag.tagId} />
              <GenericRemove
                url={`/api/tag/${gameTag.gameId}/${gameTag.tagId}`}
                queryKey={[
                  ["game_tag", gameTag.gameId, gameTag.tagId],
                  ["game_tags"],
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
