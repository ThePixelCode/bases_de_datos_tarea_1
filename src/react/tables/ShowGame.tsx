import { fetchGames, fetchDevelopers } from "@/lib/fetch";

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
import EditGame from "../Edit/EditGame";
import { useQueries } from "@tanstack/react-query";

export default function ShowGame() {
  const [
    { data: games, isLoading: isGameLoading, isError: isGameError },
    {
      data: developers,
      isLoading: isDeveloperLoading,
      isError: isDeveloperError,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ["games"],
        queryFn: fetchGames,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["developers"],
        queryFn: fetchDevelopers,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
  if (isGameLoading || isDeveloperLoading) {
    return <h1>Loading...</h1>;
  }
  if (isGameError || isDeveloperError) {
    return <h1>TODO!!!</h1>;
  }
  return (
    <Table>
      <TableCaption className="text-foreground">Games present</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Developer</TableHead>
          <TableHead>Publisher</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games?.map((game) => (
          <TableRow key={"game-id-" + game.id}>
            <TableCell>{game.id}</TableCell>
            <TableCell>{game.name}</TableCell>
            <TableCell>{game.price}</TableCell>
            <TableCell>
              {developers?.find((d) => d.id === game.developer)?.name}
            </TableCell>
            <TableCell>
              {developers?.find((d) => d.id === game.publisher)?.name}
            </TableCell>
            <TableCell className="grid grid-cols-2 gap-2">
              <EditGame id={game.id} />
              <GenericRemove
                url={`/api/game/${game.id}`}
                queryKey={[["game", game.id], ["games"]]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
