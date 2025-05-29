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
import type { Game, Player } from "@/lib/check";
import { SerializableError } from "@/lib/error";
import {
  fetchGames,
  fetchPlayerGames,
  fetchPlayers,
  fetchSavedPlay,
  STALE_TIME,
} from "@/lib/fetch";
import { getFileLocation, getFileName } from "@/lib/file";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormData {
  file: File;
  location: string;
  gameToPlayerId: string;
}

const SUPPORTED_FILE_EXTENSIONS = [
  ".zip",
  ".7z",
  ".tar",
  ".tar.gz",
  ".tar.bz2",
  ".tar.xz",
];

export default function EditSavePlay({ id }: { id: number }) {
  const query = useQueryClient();
  const [
    {
      isError: isPlayGameError,
      isLoading: isPlayGameLoading,
      data: playerGames,
    },
    { isError: isGameError, isLoading: isGameLoading, data: games },
    { isError: isPlayError, isLoading: isPlayLoading, data: players },
    {
      isError: isSavedPlayError,
      isLoading: isSavedPlayLoading,
      data: savedPlay,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ["player_games"],
        queryFn: fetchPlayerGames,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["games"],
        queryFn: fetchGames,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["players"],
        queryFn: fetchPlayers,
        staleTime: STALE_TIME,
      },
      {
        queryKey: ["saved_play", id],
        queryFn: fetchSavedPlay(id),
        staleTime: STALE_TIME,
      },
    ],
  });
  const [file, setFile] = useState<string>("None");
  const [uploading, setUploading] = useState<boolean>(false);
  const form = useForm<FormData>({});
  useEffect(() => {
    if (savedPlay) {
      form.reset({
        location: getFileLocation(savedPlay.local_file),
        gameToPlayerId: `${savedPlay.gameToPlayerId}`,
      });
      setFile(getFileName(savedPlay.local_file));
    }
  }, [savedPlay, form.reset]);
  const isValidFileFormat = (filename: string) => {
    return SUPPORTED_FILE_EXTENSIONS.some((ext) =>
      filename.toLowerCase().endsWith(ext),
    );
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length !== 1) {
      toast.error("You can only set 1 file!");
      return;
    }
    if (!isValidFileFormat(files[0].name)) {
      toast.error("The file added is not supported");
    }
    const validFile = files[0];
    form.setValue("file", validFile, { shouldTouch: true });
    setFile(validFile.name);
    event.target.value = "";
  };
  const uploadData = async ({
    file,
    location,
    gameToPlayerId,
  }: FormData): Promise<
    | { id: number; gameToPlayerId: number; local_file: string }
    | SerializableError
  > => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("location", location);
    formData.append("gameToPlayerId", gameToPlayerId);

    const response = await fetch(`/api/saved_play/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const { message, name, stack } = await response.json();
      return SerializableError.fromErrorLike(message, name, stack);
    }

    return (await response.json()) as {
      id: number;
      gameToPlayerId: number;
      local_file: string;
    };
  };
  const onSubmit = (value: FormData) => {
    console.log(value);
    setUploading(true);
    uploadData(value)
      .then((res) => {
        if (res instanceof SerializableError) {
          console.log("" + res);
          toast.error("Error uploading, " + res);
        } else {
          toast.success("Successfully wrote 1 entry");
          query.invalidateQueries({ queryKey: ["saved_plays"] });
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };
  if (isGameError && isPlayError && isPlayGameError && isSavedPlayError) {
    return <h1>TODO</h1>;
  }
  if (
    isGameLoading &&
    isPlayLoading &&
    isPlayGameLoading &&
    isSavedPlayLoading
  ) {
    return <h1>TODO</h1>;
  }
  if (
    games === undefined ||
    players === undefined ||
    playerGames === undefined ||
    savedPlay === undefined
  ) {
    return <h1>TODO</h1>;
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
              <DialogTitle>Edit SavedPlay</DialogTitle>
              <DialogDescription>Edit SavedPlay</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="gameToPlayerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player-Game</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="player-game" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {playerGames.map((playerGame) => {
                        const game = (
                          games.find(
                            (game) => game.id === playerGame.gameId,
                          ) as Game
                        ).name;
                        const player = (
                          players.find(
                            (player) => player.id === playerGame.playerId,
                          ) as Player
                        ).username;
                        return (
                          <SelectItem
                            key={`saved-play-${playerGame.id}-game-${game}-player-${player}`}
                            value={`${playerGame.id}`}
                          >{`${player} - ${game}`}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription>Player-Game</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormDescription>Location</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({}) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormDescription>File selected: {file}</FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Select a file"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"neutral"}>Cancel</Button>
              </DialogClose>
              {uploading ? (
                <Button variant={"neutral"} disabled>
                  <Loader className="animate-spin" />
                </Button>
              ) : (
                <Button type="submit">Save Changes</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
