import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchGames, fetchPlayers } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Duration } from "luxon";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  playtime: z.string(),
  recommended: z.boolean().nullable(),
  review: z.string().nullable(),
});

export default function FormPlayerGame() {
  const [reviewPresent, setReviewPresent] = useState(false);
  const [
    { data: games, isError: isGameError, isLoading: isGameLoading },
    { data: players, isError: isPlayerError, isLoading: isPlayerLoading },
  ] = useQueries({
    queries: [
      { queryKey: ["games"], queryFn: fetchGames, staleTime: 5 * 60 * 1000 },
      {
        queryKey: ["players"],
        queryFn: fetchPlayers,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
  const query = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playtime: "PT0S",
      recommended: null,
      review: null,
    },
  });

  useEffect(() => {
    if (reviewPresent) {
      const recommended = form.getValues("recommended");
      form.setValue("recommended", recommended ?? true);
      const review = form.getValues("review");
      form.setValue("review", review ?? "");
    } else {
      form.setValue("recommended", null);
      form.setValue("review", null);
    }
  }, [reviewPresent]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const duration = Duration.fromISO(values.playtime);
    if (!duration.isValid) {
      throw new Error("Invalid duration");
    }

    fetch("/api/player_game", {
      method: "POST",
      body: JSON.stringify({
        gameId: Number(values.gameId),
        playerId: Number(values.playerId),
        playtime: values.playtime,
        recommended: values.recommended,
        review: values.review,
      }),
    }).then(() => {
      toast.success("Created Successfully");
      query.invalidateQueries({ queryKey: ["player_games"] });
    });
  }

  if (isGameError || isPlayerError) {
    return <h1>TODO!!!</h1>;
  }

  if (isGameLoading || isPlayerLoading) {
    return <h1>TODO!!!</h1>;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="game" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {games?.map((game) => (
                    <SelectItem
                      key={`player-game-game-new-${game.id}`}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="player" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players?.map((player) => (
                    <SelectItem
                      key={`player-game-player-new-${player.id}`}
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
                  <FormDescription>Is this game recommended?</FormDescription>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
