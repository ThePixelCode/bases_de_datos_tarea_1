import { fetchDevelopers, fetchGame } from "@/lib/fetch";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().nonempty("game name should not be empty").max(255, {
    message: "Name is to long",
  }),
  price: z.coerce
    .number()
    .finite("game price should not be infinite")
    .nonnegative("game price should not be negative"),
  developer: z.string(),
  publisher: z.string(),
});

export default function EditGame({
  id,
  callback,
}: {
  id: number;
  callback?: () => void;
}) {
  const query = useQueryClient();
  const [
    { data: game, isLoading: isGameLoading, isError: isGameError },
    {
      data: developers,
      isLoading: isDeveloperLoading,
      isError: isDeveloperError,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ["game", id],
        queryFn: fetchGame(id),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["developers"],
        queryFn: fetchDevelopers,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (game) {
      form.reset(
        {
          name: game.name,
          price: game.price,
          developer: `${game.developer}`,
          publisher: `${game.publisher}`,
        },
        { keepTouched: true },
      );
    }
  }, [game, form.reset]);

  function onSubmit(value: z.infer<typeof formSchema>) {
    fetch(`/api/game/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: value.name,
        price: value.price,
        developer: Number(value.developer),
        publisher: Number(value.publisher),
      }),
    }).then((data) => {
      toast.success("Edit Successfully");
      query.invalidateQueries({ queryKey: ["game", id] });
      query.invalidateQueries({ queryKey: ["games"] });
      if (callback !== undefined) {
        callback();
      }
    });
  }

  if (isGameError || isDeveloperError) {
    return <h1>TODO!!!</h1>;
  }
  if (isGameLoading || isDeveloperLoading) {
    return <h1>Loading...</h1>;
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
              <DialogTitle>Edit Game</DialogTitle>
              <DialogDescription>Edit game</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>Name for Game</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Price</FormLabel>
                  <FormControl>
                    <Input placeholder="price" {...field} />
                  </FormControl>
                  <FormDescription>Price for Game</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="developer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Developer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="developer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {developers?.map((developer) => (
                        <SelectItem
                          key={`game-developer-${id}-${developer.id}`}
                          value={`${developer.id}`}
                        >
                          {developer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Developer of Game</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Publisher</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="publisher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {developers?.map((developer) => (
                        <SelectItem
                          key={`game-publisher-${id}-${developer.id}`}
                          value={`${developer.id}`}
                        >
                          {developer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Publisher of Game</FormDescription>
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
