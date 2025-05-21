import { fetchTags } from "@/lib/fetch";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GenericRemove from "../GenericRemove";
import EditTag from "../Edit/EditTag";
import { useQuery } from "@tanstack/react-query";

export default function ShowTag() {
  const {
    data: tags,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return <h1>TODO!!!</h1>;
  }

  if (isLoading) {
    return <h1>TODO!!!</h1>;
  }

  return (
    <Table>
      <TableCaption className="text-foreground">Tags present</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags?.map((tag) => (
          <TableRow key={"tag-id-" + tag.id}>
            <TableCell>{tag.id}</TableCell>
            <TableCell>{tag.name}</TableCell>
            <TableCell className="grid grid-cols-2 gap-2">
              <EditTag id={tag.id} />
              <GenericRemove
                url={`/api/tag/${tag.id}`}
                queryKey={[["tag", tag.id], ["tags"]]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
