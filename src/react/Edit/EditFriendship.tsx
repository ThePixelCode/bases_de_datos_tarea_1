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
import { Friendship, type Player } from "@/lib/check";
import { SerializableError } from "@/lib/error";
import { fetchFriendship, fetchPlayers, STALE_TIME } from "@/lib/fetch";
import { Result } from "@/lib/result";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries, useQueryClient } from "@tanstack/react-query";
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

export default function EditFriendship({ id }: { id: number }) {
  const [uploading, setUploading] = useState(false);
  const [newMessage, setNewMessage] = useState<{
    user: number;
    message: string;
  }>();
  const query = useQueryClient();
  const [
    {
      isError: isFriendshipError,
      isLoading: isFriendshipLoading,
      data: friendship,
    },
    { isError: isPlayersError, isLoading: isPlayersLoading, data: players },
  ] = useQueries({
    queries: [
      {
        queryKey: ["friendship", id],
        queryFn: fetchFriendship(id),
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["players"],
        queryFn: fetchPlayers,
        staleTime: STALE_TIME,
      },
    ],
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const formMessages = useFieldArray({
    control: form.control,
    name: "messages",
  });
  const fieldUser1 = Number(form.watch("user1"));
  const fieldUser2 = Number(form.watch("user2"));

  useEffect(() => {
    if (friendship) {
      const user1 = friendship.user1;
      const user2 = friendship.user2;
      const messages: { user: number; message: string }[] = [];
      for (let i = 0; i < friendship.messages.length; i++) {
        messages[i] = {
          user: friendship.messages[i].user === user1 ? 0 : 1,
          message: friendship.messages[i].message,
        };
      }
      form.reset(
        {
          user1,
          user2,
          are_friends: friendship.are_friends,
          messages,
        },
        {
          keepTouched: true,
        },
      );
    }
  }, [friendship, form.reset]);

  const upload = (
    value: z.infer<typeof formSchema>,
  ): Promise<Result<Friendship[], Error>> => {
    return Result.tryAsyncArgs(
      async ({ value }) => {
        const res = await fetch(`/api/friendship/${id}`, {
          method: "PATCH",
          body: JSON.stringify(value),
        });
        if (!res.ok) {
          throw await SerializableError.fromResponse(res);
        }
        const friendship = Friendship.validate(await res.json());

        if (friendship.is_err()) {
          throw friendship.unwrap_err();
        }

        return friendship.unwrap().toArray();
      },
      { value },
    );
  };

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    setUploading(true);
    const messages: { user: number; message: string }[] = [];
    for (let i = 0; i < value.messages.length; i++) {
      messages[i] = {
        user: value.messages[i].user === 0 ? value.user1 : value.user2,
        message: value.messages[i].message,
      };
    }

    upload({
      user1: value.user1,
      user2: value.user2,
      are_friends: value.are_friends,
      messages,
    })
      .then((res) => {
        if (res.is_err()) {
          const err = res.unwrap_err();
          toast.error(`Got error: ${err}`);
          console.log(err);
          return;
        }
        toast.success("Edited Successfully!");
        query.invalidateQueries({ queryKey: ["friendship", id] });
        query.invalidateQueries({ queryKey: ["friendships"] });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  if (isPlayersError && isFriendshipError) {
    return <h1>TODO</h1>;
  }

  if (isPlayersLoading && isFriendshipLoading) {
    return <h1>TODO</h1>;
  }

  if (players === undefined || friendship === undefined) {
    return <h1>TODO</h1>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"neutral"}>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err);
            })}
          >
            <DialogHeader>
              <DialogTitle>Edit Friendship</DialogTitle>
              <DialogDescription>Edit friendship</DialogDescription>
            </DialogHeader>
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
                          key={`friendship-${id}-player-1-id-${player.id}`}
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
                          key={`friendship-${id}-player-2-id-${player.id}`}
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
                  <FormDescription>
                    Are user 1 and user 2 friends?
                  </FormDescription>
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
                            key={`message-${id}-${i}`}
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
                            newMessage === undefined
                              ? "0"
                              : `${newMessage.user}`
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
                                            (player) =>
                                              player.id === fieldUser1,
                                          ) as Player,
                                          players.find(
                                            (player) =>
                                              player.id === fieldUser2,
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
      </DialogContent>
    </Dialog>
  );
}
