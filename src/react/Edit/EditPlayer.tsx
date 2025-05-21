import { fetchPlayer } from "@/lib/fetch";

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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  username: z
    .string()
    .nonempty("player username should not be empty")
    .max(255, {
      message: "Username is to long",
    }),
});

export default function EditPlayer({
  id,
  callback,
}: {
  id: number;
  callback?: () => void;
}) {
  const query = useQueryClient();
  const {
    data: player,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["player", id],
    queryFn: fetchPlayer(id),
    staleTime: 5 * 60 * 1000,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    if (player) {
      form.reset(
        {
          username: player.username,
        },
        { keepTouched: true },
      );
    }
  }, [player, form.reset]);

  function onSubmit(value: z.infer<typeof formSchema>) {
    fetch(`/api/player/${id}`, {
      method: "PATCH",
      body: JSON.stringify(value),
    }).then(() => {
      toast.success("Edit Succesfully");
      query.invalidateQueries({ queryKey: ["players"] });
      query.invalidateQueries({ queryKey: ["player", id] });
      if (callback !== undefined) {
        callback();
      }
    });
  }

  if (isError) {
    return <h1>TODO!!!</h1>;
  }

  if (isLoading) {
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
              <DialogTitle>Edit Player</DialogTitle>
              <DialogDescription>Edit player</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>Username for Player</FormDescription>
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
