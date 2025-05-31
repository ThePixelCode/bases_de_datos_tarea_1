import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Friendship, Player } from "@/lib/check";
import { SerializableError } from "@/lib/error";
import { fetchPlayers, STALE_TIME } from "@/lib/fetch";
import type { MaybeArr } from "@/lib/maybearray";
import { Result } from "@/lib/result";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  user1: z.coerce.number().positive().int(),
  user2: z.coerce.number().positive().int(),
  are_friends: z.coerce.boolean(),
  messages: z.array(
    z.object({
      user: z.number().nonnegative().int().lt(2, "Unexpected number of users"),
      message: z.string(),
    }),
  ),
});

export default function FormFriendship() {
  const [uploading, setUploading] = useState(false);
  const [newMessage, setNewMessage] = useState<{
    user: number;
    message: string;
  }>();
  const {
    isError,
    isLoading,
    data: players,
  } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    staleTime: STALE_TIME,
  });
  const query = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user1: 0,
      user2: 0,
      are_friends: false,
      messages: [],
    },
  });
  const formMessages = useFieldArray({
    control: form.control,
    name: "messages",
  });
  const fieldUser1 = Number(form.watch("user1"));
  const fieldUser2 = Number(form.watch("user2"));

  const upload = async (
    value: z.infer<typeof formSchema>,
  ): Promise<Result<MaybeArr<Friendship>, SerializableError>> => {
    return (
      await Result.tryAsyncArgs(
        async ({ value }) => {
          const res = await fetch("/api/friendship", {
            method: "POST",
            body: JSON.stringify(value),
          });

          if (!res.ok) {
            throw await SerializableError.fromResponse(res);
          }

          return Friendship.validate(await res.json());
        },
        { value },
      )
    ).map_err((e) => SerializableError.fromError(e));
  };
  const onSubmit = (value: z.infer<typeof formSchema>) => {
    setUploading(true);
    if (value.user1 >= value.user2) {
      const tmp = value.user1;
      value.user1 = value.user2;
      value.user2 = tmp;
    }
    upload(value)
      .then((res) => {
        if (res.is_err()) {
          const err = res.unwrap_err();
          console.log(err.toString());
          toast.error(`Got error: ${err.name}`);
          return;
        }
        const data = res.unwrap().toArray();
        toast.success(
          `Successfully wrote ${data.length} ${data.length === 1 ? "entry" : "entries"}`,
        );
        query.invalidateQueries({ queryKey: ["friendships"] });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  if (isError) {
    return <h1>TODO!!!</h1>;
  }

  if (isLoading) {
    return <h1>TODO!!!</h1>;
  }

  if (players === undefined) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="user1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User 1</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="user">
                      {fieldUser1 === 0
                        ? "Select a user"
                        : (
                            players.find(
                              (player) => player.id === fieldUser1,
                            ) as Player
                          ).username}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem
                      key={`friendship-new-player-1-id-${player.id}`}
                      value={`${player.id}`}
                    >
                      {player.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>User 1</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User 2</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="user">
                      {fieldUser2 === 0
                        ? "Select a user"
                        : (
                            players.find(
                              (player) => player.id === fieldUser2,
                            ) as Player
                          ).username}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem
                      key={`friendship-new-player-2-id-${player.id}`}
                      value={`${player.id}`}
                    >
                      {player.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>User 2</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="are_friends"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are friends?</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  name={field.name}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>Are user 1 and user 2 friends?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="messages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Messages</FormLabel>
              {fieldUser1 === 0 || fieldUser2 === 0 ? (
                <div className="text-red-500">
                  You need to add users before messages
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Messages</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Messages</DialogTitle>
                      <DialogDescription>Messages</DialogDescription>
                    </DialogHeader>
                    {field.value.map((message, i) => {
                      const user = [
                        players.find(
                          (player) => player.id === fieldUser1,
                        ) as Player,
                        players.find(
                          (player) => player.id === fieldUser2,
                        ) as Player,
                      ];
                      return (
                        <div
                          key={`message-new-${i}`}
                          className="grid grid-cols-4 gap-1"
                        >
                          <Select
                            defaultValue={`${message.user}`}
                            onValueChange={(val) => {
                              formMessages.update(i, {
                                user: Number(val),
                                message: message.message,
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="user">
                                {user[message.user].username}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">
                                {user[0].username}
                              </SelectItem>
                              <SelectItem value="1">
                                {user[1].username}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="text"
                            className="col-span-3"
                            value={message.message}
                            onChange={(val) => {
                              formMessages.update(i, {
                                user: message.user,
                                message: val.target.value,
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                    <div>Add message</div>
                    <div className="grid grid-cols-4 gap-1">
                      <Select
                        value={
                          newMessage === undefined ? "0" : `${newMessage.user}`
                        }
                        onValueChange={(val) => {
                          setNewMessage({
                            user: Number(val),
                            message: newMessage?.message ?? "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="user">
                            {newMessage === undefined
                              ? "Select User"
                              : (
                                  players.find(
                                    (player) =>
                                      player.id ===
                                      [
                                        players.find(
                                          (player) => player.id === fieldUser1,
                                        ) as Player,
                                        players.find(
                                          (player) => player.id === fieldUser2,
                                        ) as Player,
                                      ][newMessage.user].id,
                                  ) as Player
                                ).username}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">
                            {
                              (
                                players.find(
                                  (player) => player.id === fieldUser1,
                                ) as Player
                              ).username
                            }
                          </SelectItem>
                          <SelectItem value="1">
                            {
                              (
                                players.find(
                                  (player) => player.id === fieldUser2,
                                ) as Player
                              ).username
                            }
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="test"
                        value={newMessage?.message ?? ""}
                        className="col-span-3"
                        onChange={(event) => {
                          setNewMessage({
                            user: newMessage?.user ?? 0,
                            message: event.target.value,
                          });
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (newMessage !== undefined) {
                            formMessages.append(newMessage);
                          }
                        }}
                        className="col-span-4"
                      >
                        Add Message
                      </Button>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button>Done</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <FormDescription>Messages</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {uploading ? (
          <Button type="submit" variant={"neutral"} disabled>
            <Loader className="animate-spin" />
          </Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
