import { fetchDeveloper } from "@/lib/fetch";
import { useEffect } from "react";

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

const formSchema = z.object({
  name: z.string().nonempty("developer name should not be empty").max(255, {
    message: "Name is to long",
  }),
});

export default function EditDeveloper({
  id,
  callback,
}: {
  id: number;
  callback?: () => void;
}) {
  const query = useQueryClient();
  const {
    data: developer,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["developer", id],
    queryFn: fetchDeveloper(id),
    staleTime: 5 * 60 * 1000,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    if (developer) {
      form.reset(
        {
          name: developer.name,
        },
        { keepTouched: true },
      );
    }
  }, [developer, form.reset]);

  function onSubmit(value: z.infer<typeof formSchema>) {
    fetch(`/api/developer/${id}`, {
      method: "PATCH",
      body: JSON.stringify(value),
    }).then(() => {
      toast.success("Edit Successfully");
      query.invalidateQueries({ queryKey: ["developer", id] });
      query.invalidateQueries({ queryKey: ["developers"] });
      if (callback !== undefined) {
        callback();
      }
    });
  }

  if (isError) {
    return <h1>TODO!</h1>;
  }

  if (isLoading) {
    return <h1>TODO!</h1>;
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
              <DialogTitle>Edit Developer</DialogTitle>
              <DialogDescription>Edit developer</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Developer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>Name for Developer</FormDescription>
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
