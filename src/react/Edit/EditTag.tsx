import { fetchTag } from "@/lib/fetch";

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
  name: z.string().nonempty("tag name should not be empty").max(255, {
    message: "Name is to long",
  }),
});

export default function EditTag({
  id,
  callback,
}: {
  id: number;
  callback?: () => void;
}) {
  const query = useQueryClient();
  const {
    data: tag,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["tag", id],
    queryFn: fetchTag(id),
    staleTime: 5 * 60 * 1000,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    if (tag) {
      form.reset(
        {
          name: tag.name,
        },
        { keepTouched: true },
      );
    }
  }, [tag, form.reset]);

  function onSubmit(value: z.infer<typeof formSchema>) {
    fetch(`/api/tag/${id}`, {
      method: "PATCH",
      body: JSON.stringify(value),
    }).then(() => {
      toast.success("Edit Succesfully");
      query.invalidateQueries({ queryKey: ["tags"] });
      query.invalidateQueries({ queryKey: ["tag", id] });
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
              <DialogTitle>Edit Tag</DialogTitle>
              <DialogDescription>Edit tag</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>Name for Tag</FormDescription>
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
