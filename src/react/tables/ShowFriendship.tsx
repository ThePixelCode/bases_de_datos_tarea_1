import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Player } from "@/lib/check";
import { fetchFriendships, fetchPlayers, STALE_TIME } from "@/lib/fetch";
import { useQueries } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import GenericRemove from "../GenericRemove";
import EditFriendship from "../Edit/EditFriendship";

export default function ShowFriendship() {
  const [
    {
      data: friendships,
      isError: isFriendshipsError,
      isLoading: isFriendshipsLoading,
    },
    { data: players, isError: isPlayersError, isLoading: isPlayersLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["friendships"],
        queryFn: fetchFriendships,
        staleTime: STALE_TIME,
      },
      { queryKey: ["players"], queryFn: fetchPlayers, staleTime: STALE_TIME },
    ],
  });
  if (isPlayersError || isFriendshipsError) {
    return <h1>TODO</h1>;
  }
  if (isPlayersLoading || isFriendshipsLoading) {
    return <h1>TODO</h1>;
  }

  if (players === undefined || friendships === undefined) {
    return <h1>TODO</h1>;
  }
  return (
    <Table>
      <TableCaption className="text-foreground">
        Friendship stablished
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>User1</TableHead>
          <TableHead>User2</TableHead>
          <TableHead>Are friends?</TableHead>
          <TableHead>Messages</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {friendships.map((friendship) => {
          const [user1, user2] = [
            players.find((player) => player.id === friendship.user1) as Player,
            players.find((player) => player.id === friendship.user2) as Player,
          ];
          return (
            <TableRow key={"friendship-id-" + friendship.id}>
              <TableCell>{friendship.id}</TableCell>
              <TableCell>{user1.username}</TableCell>
              <TableCell>{user2.username}</TableCell>
              <TableCell>
                {friendship.are_friends ? <Check /> : <X />}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"neutral"}>Show Messages</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Messages</DialogTitle>
                      <DialogDescription>Message List</DialogDescription>
                    </DialogHeader>
                    <ul>
                      {friendship.messages.map((message, i) => (
                        <li key={i} className="my-3">
                          <h3 className="text-lg font-bold leading-none">
                            {message.user === user1.id
                              ? user1.username
                              : user2.username}
                            :
                          </h3>
                          <p className="leading-normal">{message.message}</p>
                        </li>
                      ))}
                    </ul>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button>Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="grid grid-cols-2 gap-2">
                <EditFriendship id={friendship.id} />
                <GenericRemove
                  url={`/api/friendship/${friendship.id}`}
                  queryKey={[["friendship", friendship.id], ["friendships"]]}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
