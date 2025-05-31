import { fetchGames, fetchGameTag, fetchTags } from "@/lib/fetch";

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
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  gameId: z.string(),
  tagId: z.string(),
});

export default function EditTag({
  gameId,
  tagId,
  callback,
}: {
  gameId: number;
  tagId: number;
  callback?: () => void;
}) {
  const query = useQueryClient();
  const [
    { data: tags, isError: isTagLoading, isLoading: isTagError },
    { data: games, isError: isGameLoading, isLoading: isGameError },
    { data: gameTag, isError: isGameTagLoading, isLoading: isGameTagError },
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
        queryKey: ["game_tag", gameId, tagId],
        queryFn: fetchGameTag(gameId, tagId),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    if (gameTag) {
      form.reset(
        {
          gameId: `${gameTag.gameId}`,
          tagId: `${gameTag.tagId}`,
        },
        { keepTouched: true },
      );
    }
  }, [gameTag, form.reset]);

  function onSubmit(value: z.infer<typeof formSchema>) {
    fetch(`/api/game_tag/${gameId}/${tagId}`, {
      method: "PATCH",
      body: JSON.stringify({
        gameId: Number(value.gameId),
        tagId: Number(value.tagId),
      }),
    }).then(() => {
      toast.success("Edit Successfully");
      query.invalidateQueries({ queryKey: ["game_tags"] });
      query.invalidateQueries({ queryKey: ["game_tag", gameId, tagId] });
      if (callback !== undefined) {
        callback();
      }
    });
  }

  if (isTagError || isGameError || isGameTagError) {
    return <h1>TODO!!!</h1>;
  }

  if (isTagLoading || isGameLoading || isGameTagLoading) {
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
              <DialogTitle>Edit Tag</DialogTitle>
              <DialogDescription>Edit tag</DialogDescription>
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
                          key={`game-tag-game-${gameId}-${game.id}`}
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
              name="tagId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="tag" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tags?.map((tag) => (
                        <SelectItem
                          key={`game-tag-tag-${gameId}-${tag.id}`}
                          value={`${tag.id}`}
                        >
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Tag</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
