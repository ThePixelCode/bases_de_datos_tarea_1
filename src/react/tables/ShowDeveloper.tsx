import { fetchDevelopers } from "@/lib/fetch";

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
import EditDeveloper from "../Edit/EditDeveloper";
import { useQuery } from "@tanstack/react-query";

export default function ShowDeveloper() {
  const {
    data: developers,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["developers"],
    queryFn: fetchDevelopers,
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
      <TableCaption className="text-foreground">
        Developers present
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {developers?.map((developer) => (
          <TableRow key={"developer-id-" + developer.id}>
            <TableCell>{developer.id}</TableCell>
            <TableCell>{developer.name}</TableCell>
            <TableCell className="grid grid-cols-2 gap-2">
              <EditDeveloper id={developer.id} />
              <GenericRemove
                url={`/api/developer/${developer.id}`}
                queryKey={[["developer", developer.id], ["developers"]]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
