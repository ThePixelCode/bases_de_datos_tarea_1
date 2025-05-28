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
import { useState, type ChangeEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchGames, fetchPlayerGames, fetchPlayers } from "@/lib/fetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SerializableError } from "@/lib/error";

const SUPPORTED_FILE_EXTENSIONS = [
  ".zip",
  ".7z",
  ".tar",
  ".tar.gz",
  ".tar.bz2",
  ".tar.xz",
];
interface FileData {
  file: File;
}
interface FormData {
  files: FileData[];
  location: string;
  gameToPlayerId: string;
}

export default function FormSavePlay() {
  const query = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [
    { data: players, isError: isPlayerLoading, isLoading: isPlayerError },
    { data: games, isError: isGameLoading, isLoading: isGameError },
    {
      data: playerGames,
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
        queryKey: ["player_games"],
        queryFn: fetchPlayerGames,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });
  const form = useForm<FormData>({
    defaultValues: {
      files: [],
      location: "",
    },
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "files",
  });

  const isValidFileFormat = (filename: string) => {
    return SUPPORTED_FILE_EXTENSIONS.some((ext) =>
      filename.toLowerCase().endsWith(ext),
    );
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const validFiles = selectedFiles.filter((file) =>
      isValidFileFormat(file.name),
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Algunos archivos tienen formatos no validos.");
      console.trace();
      return;
    }

    validFiles.forEach((file) => {
      fieldArray.append({
        file: file,
      });
    });

    event.target.value = "";
  };

  const uploadFiles = async ({
    files,
    location,
    gameToPlayerId,
  }: FormData): Promise<
    | {
        id: number;
        gameToPlayerId: number;
        local_file: string;
      }[]
    | SerializableError
  > => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file.file);
    });
    formData.append("location", location);
    formData.append("gamePlayerId", gameToPlayerId);

    const response = await fetch("/api/saved_play", {
      method: "POST",
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
    }[];
  };

  const onSubmit = (value: FormData) => {
    if (value.files.length === 0) {
      toast.error("You need to add at least one file");
      return;
    }
    setUploading(true);
    uploadFiles(value)
      .then((res) => {
        if (Array.isArray(res)) {
          toast.success(
            `Succesfully writed ${res.length} ${res.length === 1 ? "entry" : "entries"}`,
          );
          query.invalidateQueries({ queryKey: ["saved_plays"] });
        } else {
          console.log("" + res);
          toast.error("Error uploading, " + res);
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  if (isPlayerError || isGameError || isPlayerGameError) {
    return <h1>TODO!!!</h1>;
  }

  if (isPlayerLoading || isGameLoading || isPlayerGameLoading) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="gameToPlayerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player-Game</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="player-game" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {playerGames?.map((playerGame) => {
                    const game = games?.find(
                      (game) => game.id === playerGame.gameId,
                    )?.name as string;
                    const player = players?.find(
                      (player) => player.id === playerGame.playerId,
                    )?.username as string;
                    return (
                      <SelectItem
                        key={`saved-play-game-player-${playerGame.id}`}
                        value={`${playerGame.id}`}
                      >
                        {`${player} - ${game}`}
                      </SelectItem>
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
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormDescription>Files Selected:</FormDescription>
              <ul>
                {field.value.map((file) => (
                  <li key={`files-selected-new-${file.file.name}`}>
                    {file.file.name}
                  </li>
                ))}
              </ul>
              <FormControl>
                <Input
                  placeholder="Select a file"
                  type="file"
                  onChange={handleFileSelect}
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {uploading ? (
          <Button variant={"neutral"} disabled>
            <Loader className="animate-spin" />
          </Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
