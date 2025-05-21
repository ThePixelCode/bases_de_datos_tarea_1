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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Data {
  title: string;
  description: string;
}

interface ComponentProps {
  createForm: React.ReactNode;
  readForm: React.ReactNode;
  create?: Data;
}

export default function GenericInfo({
  createForm,
  readForm,
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
      <div className="col-span-3">
        <h1>Edit</h1>
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
