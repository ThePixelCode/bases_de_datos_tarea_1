import { fetchPlayers } from "@/lib/fetch";

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
import EditPlayer from "../Edit/EditPlayer";
import { useQuery } from "@tanstack/react-query";

export default function ShowPlayer() {
  const {
    data: players,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return <h1>TODO!!!</h1>;
  }

  if (isLoading) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Table>
      <TableCaption className="text-foreground">Players present</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players?.map((player) => (
          <TableRow key={"player-id-" + player.id}>
            <TableCell>{player.id}</TableCell>
            <TableCell>{player.username}</TableCell>
            <TableCell className="grid grid-cols-2 gap-2">
              <EditPlayer id={player.id} />
              <GenericRemove
                url={`/api/player/${player.id}`}
                queryKey={[["player", player.id], ["players"]]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
