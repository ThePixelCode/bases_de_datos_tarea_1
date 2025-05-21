import { Button } from "@/components/ui/button";
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
import { fetchGames, fetchTags } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  gameId: z.string(),
  tagId: z.string(),
});

export default function FormGameTag() {
  const query = useQueryClient();
  const [
    { data: tags, isError: isTagLoading, isLoading: isTagError },
    { data: games, isError: isGameLoading, isLoading: isGameError },
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
    ],
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: "",
      tagId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/tag", {
      method: "POST",
      body: JSON.stringify(values),
    }).then(() => {
      toast.success("Created Succesfully");
      query.invalidateQueries({ queryKey: ["game_tags"] });
    });
  }

  if (isTagError || isGameError) {
    return <h1>TODO!!!</h1>;
  }

  if (isTagLoading || isGameError) {
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
                      key={`game-tag-game-new-${game.id}`}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tags?.map((tag) => (
                    <SelectItem
                      key={`game-tag-tag-new-${tag.id}`}
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
