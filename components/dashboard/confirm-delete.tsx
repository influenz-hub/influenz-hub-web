"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";

/**
 * Destructive actions always confirm. The dialog names the specific item so a
 * misclick is obvious before it's committed.
 */
export function ConfirmDelete({
  label,
  name,
  onConfirm,
}: {
  label: string;
  name: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await onConfirm();
        toast.success(`Deleted ${label}.`);
        setOpen(false);
      } catch {
        toast.error(`Couldn't delete that ${label}.`);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="quiet" size="icon" aria-label={`Delete ${name}`}>
          <Trash2 className="text-danger" />
        </Button>
      </DialogTrigger>

      <DialogContent
        title={`Delete this ${label}?`}
        description={`"${name}" will be removed permanently. This can't be undone.`}
        className="max-w-sm"
      >
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="quiet">Cancel</Button>
          </DialogClose>
          <Button variant="danger" onClick={handleDelete} loading={pending}>
            Delete {label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
