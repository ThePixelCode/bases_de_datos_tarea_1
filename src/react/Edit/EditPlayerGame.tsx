import { fetchGames, fetchPlayerGame, fetchPlayers } from "@/lib/fetch";

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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Duration } from "luxon";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  playtime: z.string(),
  recommended: z.boolean().nullable(),
  review: z.string().nullable(),
});

export default function EditPlayerGame({
  id,
  callback,
}: {
  id: number;
  callback?: () => void;
}) {
  const [reviewPresent, setReviewPresent] = useState(false);
  const query = useQueryClient();
  const [
    { data: players, isError: isPlayerLoading, isLoading: isPlayerError },
    { data: games, isError: isGameLoading, isLoading: isGameError },
    {
      data: playerGame,
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
        queryKey: ["player_game", id],
        queryFn: fetchPlayerGame(id),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    if (playerGame) {
      form.reset(
        {
          gameId: `${playerGame.gameId}`,
          playerId: `${playerGame.playerId}`,
          playtime: Duration.fromISO(playerGame.playtime).toISO() ?? undefined,
          recommended: playerGame.recommended,
          review: playerGame.review,
        },
        { keepTouched: true },
      );
      if (playerGame.recommended === null) {
        setReviewPresent(false);
      } else {
        setReviewPresent(true);
      }
    }
  }, [playerGame]);

  useEffect(() => {
    if (reviewPresent) {
      form.setValue(
        "recommended",
        playerGame === undefined ? true : (playerGame.recommended ?? true),
      );
      form.setValue(
        "review",
        playerGame === undefined ? "" : (playerGame.review ?? ""),
      );
    } else {
      form.setValue("recommended", null);
      form.setValue("review", null);
    }
  }, [reviewPresent]);

  function onSubmit(value: z.infer<typeof formSchema>) {
    const duration = Duration.fromISO(value.playtime);
    if (!duration.isValid) {
      throw new Error("Invalid duration");
    }

    fetch(`/api/player_game/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        gameId: Number(value.gameId),
        playerId: Number(value.playerId),
        playtime: value.playtime,
        recommended: value.recommended,
        review: value.review,
      }),
    }).then(() => {
      toast.success("Edit Succesfully");
      query.invalidateQueries({ queryKey: ["player_games"] });
      query.invalidateQueries({ queryKey: ["player_game", id] });
      if (callback !== undefined) {
        callback();
      }
    });
  }

  if (isPlayerError || isGameError || isPlayerGameError) {
    return <h1>TODO!!!</h1>;
  }

  if (isPlayerLoading || isGameLoading || isPlayerGameLoading) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"neutral"}>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit PlayerGame</DialogTitle>
              <DialogDescription>Edit player game ownership</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="game" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {games?.map((game) => (
                        <SelectItem
                          key={`player-game-game-${id}-${game.id}`}
                          value={`${game.id}`}
                        >
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Game</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="playerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="player" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {players?.map((player) => (
                        <SelectItem
                          key={`player-game-player-${id}-${player.id}`}
                          value={`${player.id}`}
                        >
                          {player.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Player</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="playtime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playtime</FormLabel>
                  <FormControl>
                    <Input placeholder="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Playtime:{" "}
                    {Duration.fromISO(form.getValues("playtime")).toHuman()}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {reviewPresent ? (
              <>
                <FormField
                  control={form.control}
                  name="recommended"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommended</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          name={field.name}
                          onCheckedChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={field.disabled}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        Is this game recommended?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Review of the game"
                          className="resize-y"
                          value={field.value ?? undefined}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={field.disabled}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        What are your thoughts about this game?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={() => setReviewPresent(false)}>
                  Delete Review
                </Button>
              </>
            ) : (
              <Button onClick={() => setReviewPresent(true)}>Add Review</Button>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"neutral"}>Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
