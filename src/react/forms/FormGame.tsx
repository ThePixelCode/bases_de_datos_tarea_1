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
import { fetchDevelopers } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

export default function FormGame() {
  const query = useQueryClient();
  const {
    data: developers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["developers"],
    queryFn: fetchDevelopers,
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/game", {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        price: values.price,
        developer: Number(values.developer),
        publisher: Number(values.publisher),
      }),
    }).then(() => {
      toast.success("Created Succesfully");
      query.invalidateQueries({ queryKey: ["games"] });
    });
  }

  if (isError) {
    return <h1>TODO!!!</h1>;
  }

  if (isLoading) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <Input placeholder="price" type="number" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="developer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {developers?.map((developer) => (
                    <SelectItem
                      key={`game-developer-new-${developer.id}`}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="publisher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {developers?.map((developer) => (
                    <SelectItem
                      key={`game-publisher-new-${developer.id}`}
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
