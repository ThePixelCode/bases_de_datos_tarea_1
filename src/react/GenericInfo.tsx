import React from "react";

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

interface Data {
  title: string;
  description: string;
}

interface ComponentProps {
  createForm: React.ReactNode;
  readForm: React.ReactNode;
  tableName: string;
  create?: Data;
}

export default function GenericInfo({
  createForm,
  readForm,
  tableName,
  create,
}: ComponentProps) {
  const [show, setShow] = React.useState<boolean>(false);
  const createChecked: Data = create ?? {
    title: "Create New",
    description: "Creates New object",
  };
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="col-span-3">
        <h1>Create</h1>
      </div>
      <div className="col-span-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button>NEW</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{createChecked.title}</DialogTitle>
              <DialogDescription>{createChecked.description}</DialogDescription>
            </DialogHeader>
            {createForm}
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="col-span-2">
        <h1>Edit</h1>
      </div>
      <div className="col-span-1 grid grid-cols-2 gap-2">
        <Button
          onClick={() => {
            const download = async () => {
              const res = await fetch(`/api/json/${tableName}`, {
                method: "GET",
              });
              const data = await res.json();

              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = window.URL.createObjectURL(blob);

              const link = document.createElement("a");
              link.href = url;
              link.download = (res.headers.get("Content-Disposition") as string)
                .replace("attachment; filename=", "")
                .replaceAll('"', "");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            };

            download();
          }}
        >
          Download JSON
        </Button>
        <Button
          onClick={() => {
            const download = async () => {
              const res = await fetch(`/api/csv/${tableName}`, {
                method: "GET",
              });
              const data = await res.text();

              const blob = new Blob([data], {
                type: "text/csv",
              });
              const url = window.URL.createObjectURL(blob);

              const link = document.createElement("a");
              link.href = url;
              link.download = (res.headers.get("Content-Disposition") as string)
                .replace("attachment; filename=", "")
                .replaceAll('"', "");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            };

            download();
          }}
        >
          Download CSV
        </Button>
      </div>
      <div className="col-span-1">
        <Button
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? "Hide Info" : "Show Info"}
        </Button>
      </div>
      {show ? <div className="col-span-4">{readForm}</div> : <div></div>}
    </div>
  );
}
